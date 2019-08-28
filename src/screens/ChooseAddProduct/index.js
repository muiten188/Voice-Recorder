import React, { PureComponent } from 'react'
import { FlatList } from 'react-native'
import { connect } from 'react-redux'
import { formatMoney, getPrice } from '~/src/utils'
import I18n from '~/src/I18n'
import Image from 'react-native-fast-image'
import { Toolbar, BottomView, Button, Text, Caption, View, RoundBottomSheet, Container } from '~/src/themes/ThemeComponent'
import { COLORS } from '~/src/themes/common'
import { productMenuSelectorForSectionList } from '~/src/store/selectors/menu'
import ScrollTabHeader from '~/src/components/ScrollTabHeader'
import { floorTableSelector } from '~/src/store/selectors/table'
import styles from './styles'
import { createOrder, addProductToOrderCart, changeNumberProductOrderCart, updateNumberProductOrderCart, updateOrderTable, emptyOrderCart } from '~/src/store/actions/order'
import { orderCartInfoSelector, orderCartSelector } from '~/src/store/selectors/order'
import lodash from 'lodash'
import ProductItem from '~/src/components/ProductItem'
import LoadingModal from '~/src/components/LoadingModal'


class ChooseAddProduct extends PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            refreshing: false,
            page: 0,
            modalVisible: false,
        }
    }

    _onChangeTabHeader = (page) => {
        this.setState({ page })
    }

    _handPressProduct = (product) => {
        console.log('Choose Product', product)
        const { addProductToOrderCart } = this.props
        const { id, productId, ...rest } = product
        addProductToOrderCart({
            ...rest,
            productId: productId || id
        })
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
                onChangeNumber={this._handleChangeNumber}
            />
        )
    }

    _handlePressUpdate = () => {
        console.log('_handlePressUpdate')

        this._closeModal(() => {
            this.props.navigation.goBack()

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
                    onPress={this._handlePressUpdate}
                    style={styles.updateBtn}
                    text={I18n.t('update')}
                />
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

    render() {
        const { productMenu, orderCartInfo, floorTable, orderCart } = this.props
        const tabData = productMenu.map((item, index) => ({
            page: index,
            label: item.name
        }))
        const productContent = productMenu && productMenu[this.state.page] && productMenu[this.state.page].data
            ? productMenu[this.state.page].data : []
        return (
            <Container blue>
                <LoadingModal visible={this.state.loading} />
                <View className='flex background'>
                    {this._renderCartModal()}
                    <Toolbar
                        blue
                        title={I18n.t('find_and_add_product')}
                    />
                    <View className='space10' />
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
                    />
                    {this._renderBottomButton()}
                </View>
            </Container>
        )
    }
}

export default connect(state => ({
    productMenu: productMenuSelectorForSectionList(state),
    floorTable: floorTableSelector(state),
    orderCartInfo: orderCartInfoSelector(state),
    orderCart: orderCartSelector(state)
}), {
    addProductToOrderCart, changeNumberProductOrderCart,
        updateOrderTable, createOrder, emptyOrderCart,
        updateNumberProductOrderCart
    })(ChooseAddProduct)