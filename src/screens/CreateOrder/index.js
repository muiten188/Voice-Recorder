import React, { PureComponent } from 'react'
import { FlatList, ScrollView, StatusBar, Platform } from 'react-native'
import { connect } from 'react-redux'
import { formatMoney, chainParse, getPrice, getWidth, generateHighlightText, getTableDisplayName } from '~/src/utils'
import I18n from '~/src/I18n'
import Image from 'react-native-fast-image'
import { Toolbar, BottomView, Button, Text, Caption, View, RoundBottomSheet, Container } from '~/src/themesnew/ThemeComponent'
import { COLORS } from '~/src/themesnew/common'
import { productMenuSelectorForSectionList } from '~/src/store/selectors/menu'
import ScrollTabHeader from '~/src/components/ScrollTabHeader'
import { floorTableSelector } from '~/src/store/selectors/table'
import styles from './styles'
import { createOrder, addProductToOrderCart, changeNumberProductOrderCart, updateNumberProductOrderCart, updateOrderTable, emptyOrderCart, createOrderOffline, updateOrderInfo } from '~/src/store/actions/order'
import { orderCartInfoSelector, orderCartSelector } from '~/src/store/selectors/order'
import lodash from 'lodash'
import ProductItem from '~/src/components/ProductItem'
import FloorTableCollapsibleSelector from '~/src/components/FloorTableCollapsibleSelector'
import LoadingModal from '~/src/components/LoadingModal'
import uuidv1 from 'uuid/v1'
import ToastUtils from '~/src/utils/ToastUtils'
import { FORM_MODE } from '~/src/constants'
import { allProductSelector } from '~/src/store/selectors/product'
import { textStyles } from '~/src/themesnew/Text'
import { isConnectSelector } from '~/src/store/selectors/info'

class CreateOrder extends PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            refreshing: false,
            showTable: false,
            page: 0,
            modalVisible: false,
            floorPage: 0,
            selectedTable: ''
        }
    }

    _handlePressChooseTable = () => {
        this.setState({ showTable: !this.state.showTable })
    }

    _onChangeTabHeader = (page) => {
        this.setState({ page })
    }

    _handPressProduct = (product) => {
        // console.log('Choose Product', product)
        // const { addProductToOrderCart } = this.props
        // const { id, productId, ...rest } = product
        // addProductToOrderCart({
        //     ...rest,
        //     productId: productId || id
        // })
    }

    _handlePlus = (item) => {
        const { addProductToOrderCart } = this.props
        console.log('_handlePlus', item)
        const { id, productId, ...rest } = item
        addProductToOrderCart({
            ...rest,
            productId: productId || id
        })
    }

    _handleMinus = (item) => {
        const { changeNumberProductOrderCart } = this.props
        console.log('_handleMinus', item)
        changeNumberProductOrderCart({
            productId: item.productId || item.id,
            number: -1
        })
    }

    _handleChangeNumber = (item, number) => {
        console.log('_handleChangeNumber', item, number)
        const { updateNumberProductOrderCart } = this.props
        updateNumberProductOrderCart({
            productId: item.productId || item.id,
            number: (number + '').replace(/\D/g, "")
        })
    }

    _renderProductItem = ({ item, index }) => {
        const { productMenu, orderCartInfo, orderCart } = this.props
        const productContent = productMenu && productMenu[this.state.page] && productMenu[this.state.page].data
            ? productMenu[this.state.page].data : []
        const isLastItem = (index == productContent.length - 1)
        const itemInCart = orderCart.find(it => it.productId == item.id)
        const numberItemCart = itemInCart ? itemInCart.qty : 0

        return (
            <ProductItem
                data={item}
                showStepper={true}
                number={numberItemCart}
                isLastItem={isLastItem}
                onPress={this._handPressProduct}
                onPlus={this._handlePlus}
                onMinus={this._handleMinus}
                onChangeNumber={this._handleChangeNumber}
            />
        )
    }

    _renderProductCartItem = ({ item, index }) => {
        const { orderCartInfo, orderCart } = this.props
        const isLastItem = (index == orderCart.length - 1)

        return (
            <ProductItem
                data={item}
                showStepper={true}
                number={item.qty}
                isLastItem={isLastItem}
                onPlus={this._handlePlus}
                onMinus={this._handleMinus}
            />
        )
    }

    _handleChangeFloor = (page) => {
        this.setState({ floorPage: page })
    }

    _handleChangeCollapse = () => {
        this.setState({ showTable: !this.state.showTable })
    }

    _handleSelectTable = (table) => {
        console.log('table', table)
        const { updateOrderInfo, orderCartInfo, floorTable } = this.props
        const chooseTableId = chainParse(table, ['id']) || ''
        const currentTableIdsStr = orderCartInfo.tableId || ''
        console.log('currentTableIdsStr', currentTableIdsStr)
        if (!chooseTableId) {
            // updateOrderTable(chooseTableId)
            updateOrderInfo({
                tableId: '',
                tableDisplayName: ''
            })
            return
        }
        let currentTableIdsArr = currentTableIdsStr.split(',')
        console.log('currentTableIdsArr', currentTableIdsArr)
        const chooseTableIndex = currentTableIdsArr.findIndex(item => item == chooseTableId)
        console.log('chooseTableIndex', chooseTableIndex)
        if (chooseTableIndex < 0) {
            currentTableIdsArr.push(chooseTableId)
        } else {
            currentTableIdsArr.splice(chooseTableIndex, 1)
        }
        currentTableIdsArr = currentTableIdsArr.filter(item => !!item)
        console.log('currentTableIdsArr', currentTableIdsArr)
        updateOrderInfo({
            tableId: currentTableIdsArr.join(','),
            tableDisplayName: getTableDisplayName(currentTableIdsArr, floorTable)
        })
    }

    _handlePressCreateOrder = () => {
        console.log('_handlePressCreateOrder')

        this._closeModal(() => {
            const { isConnected, orderCartInfo, orderCart, createOrder, createOrderOffline } = this.props
            const totalAmount = this._getTotalAmount(orderCart)
            const paidAmount = totalAmount
            const discountAmount = 0
            const generateOrderId = uuidv1().replace(/-/g, '')
            const orderRequestObj = {
                orderId: '',
                clientOrderId: generateOrderId,
                tableId: orderCartInfo.tableId || '',
                tableDisplayName: orderCartInfo.tableDisplayName || '',
                type: 3,
                items: orderCart.map(item => ({
                    productId: item.productId,
                    price: getPrice(item),
                    qty: item.qty
                })),
                totalAmount,
                paidAmount,
                discountAmount
            }
            console.log('orderRequestObj', orderRequestObj)

            if (isConnected) {
                this.setState({ loading: true })
                createOrder(orderRequestObj, (err, data) => {
                    console.log('createOrder err', err)
                    console.log('createOrder data', data)
                    this.setState({ loading: false })
                    const httpStatus = chainParse(data, ['httpHeaders', 'status'])
                    if (data && data.code) {
                        ToastUtils.showErrorToast(data.msg)
                    } else if (data && data.order) {
                        this.props.navigation.navigate('OrderDetail', {
                            orderInfo: data,
                            isCreate: true
                        })
                    }
                })
            } else {
                createOrderOffline(orderRequestObj, (data) => {
                    this.props.navigation.navigate('OrderDetail', {
                        orderInfo: data,
                        isCreate: true
                    })
                })
            }

        })
    }

    _handlePressCart = () => {
        console.log('_handlePressCart')
        this.setState({ modalVisible: true })
    }

    _getTotalAmount = lodash.memoize((orderCart) => {
        return orderCart
            .map(item => {
                const currentPrice = getPrice(item)
                return currentPrice * item.qty
            })
            .reduce((a, b) => a + b, 0)
    })

    _getTotalItem = lodash.memoize((orderCart) => {
        return orderCart
            .map(item => item.qty)
            .reduce((a, b) => a + b, 0)
    })



    _renderBottomButton = () => {
        const { orderCartInfo, orderCart } = this.props
        const totalAmount = this._getTotalAmount(orderCart)
        const totalItem = this._getTotalItem(orderCart)
        return (
            <BottomView>
                <Button
                    passive
                    onPress={this._handlePressCart}
                    style={styles.leftBtn}
                >
                    <View className='row-start'>
                        <View style={styles.cartIconContainer}>
                            <Image source={require('~/src/image/cart.png')} style={{ width: 24, height: 24 }} />
                            {!!totalItem &&
                                <View style={styles.badgeView}>
                                    <Text style={styles.badgeText}>{totalItem}</Text>
                                </View>
                            }
                        </View>
                        <Text style={styles.totalAmount}>{formatMoney(totalAmount)}</Text>
                    </View>

                </Button>
                <Button
                    onPress={this._handlePressCreateOrder}
                    style={styles.createOrderBtn}
                    disabled={(+totalItem <= 0)}
                >
                    <Text style={styles.createOrderText}>{I18n.t('create_order2')}</Text>
                    <Image source={require('~/src/image/imgBackWhite.png')}
                        style={styles.forwarImage}
                    />
                </Button>
            </BottomView>
        )
    }

    _closeModal = (callback) => {
        this.setState({ modalVisible: false }, () => {
            callback && callback()
        })
    }

    _renderCartModal = () => {
        const { orderCartInfo, orderCart } = this.props
        const totalAmount = this._getTotalAmount(orderCart)

        return (
            <RoundBottomSheet
                visible={this.state.modalVisible}
                onClose={this._closeModal}
                title={I18n.t('cart')}
            >
                <FlatList
                    data={orderCart}
                    keyExtractor={item => item.productId + ''}
                    showsVerticalScrollIndicator={false}
                    renderItem={this._renderProductCartItem}
                    ListFooterComponent={<View className='space50' />}
                />
                <View className='row-space-between ph24 pv16 white border-top2'>
                    <Text style={styles.totalLabel}>{I18n.t('bill_money_label')}:</Text>
                    <Text style={styles.totalValue}>{formatMoney(totalAmount)}</Text>
                </View>
                <View className='space50' />
                {this._renderBottomButton()}
            </RoundBottomSheet>
        )
    }

    componentDidMount() {
        StatusBar.setBarStyle("light-content");
        if (Platform.OS == "android") {
            StatusBar.setBackgroundColor(COLORS.CERULEAN);
        }
        const { emptyOrderCart } = this.props
        emptyOrderCart()
    }

    _handlePressAddFloorTable = () => {
        this.props.navigation.navigate('FloorTableInfo', {
            mode: FORM_MODE.ADD
        })
    }

    _handlePressAddProduct = () => {
        this.props.navigation.navigate('ProductInfo', {
            mode: FORM_MODE.ADD
        })
    }

    _renderChooseProductEmptyState = () => {
        return (
            <View className='white'>
                <View className='space12 background' />
                <View className='ph24 pt16 pb12 border-bottom2'>
                    <Text className='caption'>{I18n.t('choose_product_by_menu')}</Text>
                </View>
                <View className='row-center' style={{ marginTop: getWidth(32) }}>
                    <Image source={require('~/src/image/empty_product.png')}
                        style={{ width: getWidth(180), height: getWidth(103) }}
                    />
                </View>
                <View className='column-center' style={{ marginTop: getWidth(25), marginHorizontal: getWidth(42) }}>
                    <Text className='center'>
                        <Text className='s14 gray bold'>{I18n.t('no_setup_product')}</Text>
                        {"\n\n"}
                        {generateHighlightText(
                            I18n.t('add_product_hint'),
                            { ...textStyles.gray, ...textStyles.s14 },
                            { ...textStyles.cerulean, ...textStyles.s14, ...textStyles.bold }
                        )}
                    </Text>
                </View>
                <View className='row-center' style={{ marginTop: getWidth(32), marginBottom: getWidth(16) }}>
                    <Button
                        text={I18n.t('add_product')}
                        onPress={this._handlePressAddProduct}
                        style={{ borderRadius: 6 }}
                    />
                </View>
                <View className='space50' />
            </View>
        )
    }

    render() {
        const { productMenu, orderCartInfo, floorTable, orderCart, allProduct } = this.props
        const tabData = productMenu.map((item, index) => ({
            page: index,
            label: item.name
        }))
        const productContent = productMenu && productMenu[this.state.page] && productMenu[this.state.page].data
            ? productMenu[this.state.page].data : []
        return (
            <Container blue>
                <LoadingModal visible={this.state.loading} />
                <View className='flex white'>
                    {this._renderCartModal()}
                    <Toolbar
                        blue
                        title={I18n.t('create_order')}
                    />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View className='space8 background' />

                        <FloorTableCollapsibleSelector
                            floorTable={floorTable}
                            floorIndex={this.state.floorPage}
                            onChangeFloor={this._handleChangeFloor}
                            collapsed={!this.state.showTable}
                            onChangeCollapse={this._handleChangeCollapse}
                            selectedTable={orderCartInfo.tableId}
                            onSelectTable={this._handleSelectTable}
                            onPressAddFloorTable={this._handlePressAddFloorTable}
                        />
                        {!!(!allProduct || allProduct.length == 0) ?
                            this._renderChooseProductEmptyState()
                            :
                            <View>
                                <View className='ph24 pt16 pb8 background'>
                                    <Caption>{I18n.t('choose_product_by_menu')}</Caption>
                                </View>
                                <ScrollTabHeader data={tabData}
                                    onChangeTab={this._onChangeTabHeader}
                                    onPressSameTab={() => { }}
                                />
                                <FlatList
                                    extraData={orderCart}
                                    data={productContent}
                                    renderItem={this._renderProductItem}
                                    keyExtractor={item => '' + item.id}
                                    showsVerticalScrollIndicator={false}
                                    ListFooterComponent={<View className='space50' />}
                                    style={{ backgroundColor: COLORS.WHITE }}
                                    scrollEnabled={false}
                                />
                            </View>
                        }

                    </ScrollView>
                    {this._renderBottomButton()}
                </View>
            </Container>
        )
    }
}

export default connect(state => ({
    allProduct: allProductSelector(state),
    productMenu: productMenuSelectorForSectionList(state),
    floorTable: floorTableSelector(state),
    orderCartInfo: orderCartInfoSelector(state),
    orderCart: orderCartSelector(state),
    isConnected: isConnectSelector(state)
}), {
        addProductToOrderCart, changeNumberProductOrderCart, updateOrderTable,
        createOrder, emptyOrderCart, createOrderOffline, updateOrderInfo,
        updateNumberProductOrderCart
    })(CreateOrder)