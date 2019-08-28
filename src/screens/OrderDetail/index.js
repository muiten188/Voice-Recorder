import React, { PureComponent } from 'react'
import { FlatList, StatusBar, TextInput, TouchableOpacity, Image, Platform, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import { formatMoney, chainParse, getPrice, revertFormatMoney, replacePatternString, getTableDisplayName } from '~/src/utils'
import I18n from '~/src/I18n'
import { PopupConfirm, Text, Toolbar, BottomView, Button, View, Label, Container, SingleRowInput } from '~/src/themes/ThemeComponent'
import { COLORS } from '~/src/themes/common'
import { productMenuSelectorForSectionList } from '~/src/store/selectors/menu'
import { floorTableSelector } from '~/src/store/selectors/table'
import styles from './styles'
import {
    addProductToOrderCart, changeNumberProductOrderCart, updateNumberProductOrderCart, updateOrderTable,
    updateOrderInfo, createOrder, updateOrderTab, deleteOrderOnline,
    emptyOrderCart, createOrderOffline, getOrderDetail
} from '~/src/store/actions/order'
import { orderCartInfoSelector, orderCartSelector } from '~/src/store/selectors/order'
import lodash from 'lodash'
import ProductItem from '~/src/components/ProductItem'
import FloorTableCollapsibleSelector from '~/src/components/FloorTableCollapsibleSelector'
import LoadingModal from '~/src/components/LoadingModal'
import { FORM_MODE, ORDER_TAB, ORDER_STATUS, PAY_METHOD_DISPAY } from '~/src/constants'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ToastUtils from '~/src/utils/ToastUtils'
import { isConnectSelector } from '~/src/store/selectors/info'


class OrderDetail extends PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null,
        gesturesEnabled: false,
    }

    constructor(props) {
        super(props)
        const orderInfo = props.navigation.getParam('orderInfo')
        this.state = {
            loading: false,
            refreshing: false,
            showTable: false,
            page: 0,
            modalVisible: false,
            floorPage: 0,
            selectedTable: '',
            discountAmount: chainParse(orderInfo, ['order', 'discountAmount']) || '',
            errDiscountAmount: '',
            surcharge: chainParse(orderInfo, ['order', 'surcharge']) || '',
            errSurcharge: '',
            note: chainParse(orderInfo, ['order', 'note']) || '',
            popupDeleteContent: '',
            changed: false
        }
        this.changed = false
        this.checkChanged = false
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this._handleBack)
        );
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


    _renderProductCartItem = ({ item, index }) => {
        const { orderCart } = this.props
        const isLastItem = (index == orderCart.length - 1)
        return (
            <ProductItem
                data={item}
                showStepper={true}
                number={item.qty}
                isLastItem={isLastItem}
                onPlus={this._handlePlus}
                onMinus={this._handleMinus}
                editable={!this._isOrderCompleted()}
                onChangeNumber={this._handleChangeNumber}
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
        this.changed = true
        if (!chooseTableId) {
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

    _handlePressPayNow = () => {
        console.log('_handlePressPayNow')
        const { updateOrderInfo, orderCart, orderCartInfo, createOrder, isConnected, createOrderOffline } = this.props
        if (this.state.note || this.state.discountAmount) {
            updateOrderInfo({
                note: this.state.note.trim(),
                discountAmount: revertFormatMoney(this.state.discountAmount)
            })
        }
        const isCreate = this.props.navigation.getParam('isCreate', false)
        const orderId = chainParse(orderCartInfo, ['id']) || ''
        const orderCode = chainParse(orderCartInfo, ['orderCode']) || ''
        const clientOrderId = chainParse(orderCartInfo, ['clientOrderId'])
        const totalAmount = this._getTotalAmount(orderCart)
        const discountAmount = +revertFormatMoney(this.state.discountAmount) || 0
        const surcharge = +revertFormatMoney(this.state.surcharge) || 0
        const paidAmount = totalAmount - discountAmount + surcharge
        const orderRequestObj = {
            orderId,
            clientOrderId,
            orderCode,
            tableId: orderCartInfo.tableId || '',
            tableDisplayName: orderCartInfo.tableDisplayName || '',
            type: 3,
            items: orderCart.map(item => ({
                productId: item.productId,
                price: getPrice(item),
                qty: item.qty
            })),
            note: this.state.note.trim() || '',
            discountAmount,
            surcharge,
            totalAmount,
            paidAmount,
            isTransaction: !isCreate
        }
        console.log('orderRequestObj', orderRequestObj)

        if (isConnected) {
            this.setState({ loading: true })
            createOrder(orderRequestObj, (err, data) => {
                console.log('createOrder err', err)
                console.log('createOrder data', data)
                this.setState({ loading: false })
                if (data && data.code) {
                    ToastUtils.showErrorToast(data.msg)
                } else if (data && data.order) {
                    this.props.navigation.navigate('OrderPay', {
                        orderId: chainParse(data, ['order', 'id']),
                        orderCode: chainParse(data, ['order', 'orderCode']),
                        clientOrderId: chainParse(data, ['order', 'orderCode']),
                        paidAmount: chainParse(data, ['order', 'paidAmount']),
                        note: this.state.note.trim() || '',
                        totalAmount: chainParse(data, ['order', 'totalAmount']),
                        discountAmount: revertFormatMoney(this.state.discountAmount) || '',
                        isCreate
                    })
                }
            })
        } else {
            createOrderOffline(orderRequestObj, (data) => {
                this.props.navigation.navigate('OrderPay', {
                    orderId: chainParse(data, ['order', 'id']),
                    orderCode: chainParse(data, ['order', 'orderCode']),
                    clientOrderId: chainParse(data, ['order', 'orderCode']),
                    paidAmount: chainParse(data, ['order', 'paidAmount']),
                    note: this.state.note.trim() || '',
                    totalAmount: chainParse(data, ['order', 'totalAmount']),
                    discountAmount: revertFormatMoney(this.state.discountAmount) || '',
                    isCreate
                })
            })
        }

    }

    _showToast = (isCreate, orderCode) => {
        let message = ''
        if (orderCode && isCreate) {
            message = replacePatternString(I18n.t('create_order_pattern_success'), `"${orderCode}"`)
        } else if (orderCode && !isCreate) {
            message = replacePatternString(I18n.t('update_order_pattern_success'), `"${orderCode}"`)
        } else if (!orderCode && isCreate) {
            message = I18n.t('create_order_success')
        } else {
            message = I18n.t('update_order_success')
        }
        ToastUtils.showSuccessToast(message)
    }

    _handlePressPayLater = () => {
        console.log('_handlePressPayLater')
        console.log('_handlePressPayNow')
        const { updateOrderInfo, orderCart, orderCartInfo, createOrder, updateOrderTab, isConnected, createOrderOffline } = this.props
        if (this.state.note || this.state.discountAmount) {
            updateOrderInfo({
                note: this.state.note.trim(),
                discountAmount: revertFormatMoney(this.state.discountAmount)
            })
        }
        const orderId = chainParse(orderCartInfo, ['id']) || ''
        const orderCode = chainParse(orderCartInfo, ['orderCode']) || ''
        const clientOrderId = chainParse(orderCartInfo, ['clientOrderId'])
        const totalAmount = this._getTotalAmount(orderCart)
        const discountAmount = +revertFormatMoney(this.state.discountAmount) || 0
        const surcharge = +revertFormatMoney(this.state.surcharge) || 0
        const paidAmount = totalAmount - discountAmount + surcharge
        const isCreate = this.props.navigation.getParam('isCreate', false)
        const orderRequestObj = {
            orderId,
            clientOrderId,
            orderCode,
            tableId: orderCartInfo.tableId || '',
            tableDisplayName: orderCartInfo.tableDisplayName || '',
            type: 3,
            items: orderCart.map(item => ({
                productId: item.productId,
                price: getPrice(item),
                qty: item.qty
            })),
            note: this.state.note.trim() || '',
            discountAmount,
            surcharge,
            totalAmount,
            paidAmount,
            isTransaction: !isCreate
        }
        console.log('orderRequestObj', orderRequestObj)


        if (isConnected) {
            this.setState({ loading: true })
            createOrder(orderRequestObj, (err, data) => {
                console.log('createOrder err', err)
                console.log('createOrder data', data)
                this.setState({ loading: false })
                if (data && data.code) {
                    ToastUtils.showErrorToast(data.msg)
                } else if (data && data.order) {
                    this._showToast(isCreate, orderCode)
                    this.props.navigation.navigate('OrderList')
                    updateOrderTab(ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY)

                }
            })
        } else {
            createOrderOffline(orderRequestObj, (data) => {
                this._showToast(isCreate, orderCode)
                this.props.navigation.navigate('OrderList')
                updateOrderTab(ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY)
            })
        }




    }

    _handlePressCancelOrder = () => {
        const { orderCartInfo, isConnected } = this.props
        if (!isConnected) return
        const orderCode = chainParse(orderCartInfo, ['orderCode'])
        const warnMessage = replacePatternString(I18n.t('warning_delete_order'), `"${orderCode}"`)
        this.setState({
            popupDeleteContent: warnMessage
        }, () => {
            this.popupConfirmDelete && this.popupConfirmDelete.open()
        })
    }

    _deleteOrder = () => {
        const { orderCartInfo } = this.props
        const orderId = chainParse(orderCartInfo, ['id'])
        const orderCode = chainParse(orderCartInfo, ['orderCode'])
        const { deleteOrderOnline } = this.props
        this.setState({ loading: true })
        deleteOrderOnline(orderId, (err, data) => {
            console.log('deleteOrderOnline err', err)
            console.log('deleteOrderOnline data', data)
            this.setState({ loading: false })
            const httpStatus = chainParse(data, ['httpHeaders', 'status'])
            if (httpStatus == 200) {
                ToastUtils.showSuccessToast(replacePatternString(I18n.t('delete_order_success2'), `"${orderCode}"`))
                this.props.navigation.navigate('OrderList')
            } else if (data && data.code) {
                ToastUtils.showErrorToast(data.msg)
            }
        })
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

    _isOrderCompleted = () => {
        const { orderCartInfo } = this.props
        return (orderCartInfo && (orderCartInfo.status == ORDER_STATUS.COMPLETED))
    }


    _renderBottomButton = () => {
        const { orderCart, orderCartInfo } = this.props
        if (this._isOrderCompleted()) return (
            <View className='bottom'>
                <View className='row-space-between ph24 pv16 white flex'>
                    <Text style={styles.totalLabel}>{I18n.t('bill_money_label')}:</Text>
                    <Text style={styles.totalValue}>{formatMoney(chainParse(orderCartInfo, ['paidAmount']))}</Text>
                </View>
            </View>
        )
        const totalAmount = this._getTotalAmount(orderCart)
        const discountAmount = +revertFormatMoney(this.state.discountAmount)
        const surcharge = +revertFormatMoney(this.state.surcharge)
        const totalItem = this._getTotalItem(orderCart)
        const paidAmount = Math.max(totalAmount - discountAmount + surcharge, 0)
        const mode = this.props.navigation.getParam('mode', FORM_MODE.ADD)
        return (
            <BottomView style={{ flexDirection: 'column', width: '100%' }}>
                <View className='row-start flex border-top2'>
                    <View className='row-space-between ph24 pv16 white flex'>
                        <Text style={styles.totalLabel}>{I18n.t('bill_money_label')}:</Text>
                        <Text style={styles.totalValue}>{formatMoney(paidAmount)}</Text>
                    </View>
                </View>
                <View className='row-start flex'>
                    <Button
                        passive
                        disabled={(+totalItem <= 0)}
                        onPress={this._handlePressPayLater}
                        style={{ flex: 1 }}
                        text={I18n.t('pay_later')}
                    />
                    <Button
                        disabled={(+totalItem <= 0 || !!this.state.errDiscountAmount)}
                        onPress={this._handlePressPayNow}
                        style={{ flex: 1 }}
                        text={I18n.t('pay_now')}
                    />
                </View>
            </BottomView>
        )
    }

    _handlePressAddProduct = () => {
        this.props.navigation.navigate('ChooseAddProduct')
    }

    _renderAddProductButton = () => {
        if (this._isOrderCompleted()) return (<View />)
        return (
            <TouchableOpacity onPress={this._handlePressAddProduct}>
                <View className='row-center pv12 border-top2'>
                    <Image source={require('~/src/image/add.png')} style={styles.addIcon} />
                    <Text className='action'>{I18n.t('find_and_add_product')}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _handleBack = () => {
        const { orderCart } = this.props
        const isCreate = this.props.navigation.getParam('isCreate', false)
        const totalItem = this._getTotalItem(orderCart)
        if ((!isCreate && !this.changed) || this._isOrderCompleted()
            || (+totalItem <= 0 || !!this.state.errDiscountAmount)
        ) {
            this.props.navigation.goBack()
            return true
        }
        this.popupConfirmBack && this.popupConfirmBack.open()
    }

    _handlePressNoBackConfirm = () => {
        const isCreate = this.props.navigation.getParam('isCreate', false)
        if (isCreate) {
            this._deleteOrder()
        } else {
            this.props.navigation.navigate('OrderList')
        }

    }

    componentDidMount() {
        StatusBar.setBarStyle("light-content");
        if (Platform.OS == "android") {
            StatusBar.setBackgroundColor(COLORS.CERULEAN);
        }
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this._handleBack)
        );
        const mode = this.props.navigation.getParam('mode', FORM_MODE.ADD)
        const orderInfo = this.props.navigation.getParam('orderInfo')
        const orderId = this.props.navigation.getParam('orderId')
        const creatorName = chainParse(orderInfo, ['creatorName']) || ''
        const { updateOrderInfo, getOrderDetail } = this.props
        const shouldeEmptyCart = this.props.navigation.getParam('shouldeEmptyCart')
        if (shouldeEmptyCart) {
            const { emptyOrderCart } = this.props
            emptyOrderCart()
        }
        console.log('orderInfo', orderInfo)
        if (orderInfo) {
            if (mode != FORM_MODE.ADD) {
                console.log('OrderInfo', orderInfo)
                const orderObj = chainParse(orderInfo, ['order']) || {}
                const discountAmount = chainParse(orderInfo, ['order', 'discountAmount']) || ''
                const note = chainParse(orderInfo, ['order', 'note']) || ''
                this.setState({ discountAmount, note })
                updateOrderInfo({
                    ...orderObj,
                    note,
                    tableId: chainParse(orderInfo, ['order', 'tableId']),
                    discountAmount,
                    creatorName,
                    orderCart: orderInfo.listOrderDetail.map(item => ({
                        price: getPrice(item),
                        productAvatar: item.productAvatar,
                        productId: item.productId,
                        productName: item.productName,
                        qty: item.qty
                    }))
                })
                setTimeout(() => {
                    this.checkChanged = true
                }, 200)

            } else {
                console.log('OrderInfo', orderInfo)
                const orderObj = chainParse(orderInfo, ['order']) || {}
                const discountAmount = chainParse(orderInfo, ['order', 'discountAmount']) || ''
                const note = chainParse(orderInfo, ['order', 'note']) || ''
                this.setState({ discountAmount, note })
                updateOrderInfo({
                    ...orderObj,
                    note,
                    tableId: chainParse(orderInfo, ['order', 'tableId']),
                    discountAmount,
                    creatorName
                })
                setTimeout(() => {
                    this.checkChanged = true
                }, 200)
            }
        } else if (orderId) {
            getOrderDetail(orderId, (err, data) => {
                console.log('getOrderDetail err', err)
                console.log('getOrderDetail data', data)
                if (data && data.order) {
                    this.setState({
                        discountAmount: chainParse(data, ['order', 'discountAmount']) || '',
                        surcharge: chainParse(data, ['order', 'surcharge']) || '',
                    })
                    updateOrderInfo({
                        orderCart: data.listOrderDetail || [],
                        ...data.order
                    })
                }
                setTimeout(() => {
                    this.checkChanged = true
                }, 200)
            })
        }
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.orderCart != this.props.orderCart) {
            const { orderCart } = this.props
            const totalAmount = this._getTotalAmount(orderCart)
            const discountValue = +revertFormatMoney(this.state.discountAmount) || 0
            const surcharge = +revertFormatMoney(this.state.surcharge) || 0
            if (JSON.stringify(prevProps.orderCart) != JSON.stringify(this.props.orderCart) && this.checkChanged) {
                console.log('prevProps.orderCart', JSON.stringify(prevProps.orderCart))
                console.log('this.props.orderCart', JSON.stringify(this.props.orderCart))
                console.log('CheckChanged', this.checkChanged)
                this.changed = true
            }
            if (discountValue > (totalAmount + surcharge)) {
                this.setState({ errDiscountAmount: I18n.t('error_in_order_discount_larger_than_total_amount') })
            } else {
                this.setState({ errDiscountAmount: '' })
            }
        }
    }

    _handlePressAddFloorTable = () => {
        this.props.navigation.navigate('FloorTableInfo', {
            mode: FORM_MODE.ADD
        })
    }

    _handleChangeDiscountAmount = (text) => {
        const { orderCart } = this.props
        const totalAmount = this._getTotalAmount(orderCart)
        const surcharge = +revertFormatMoney(this.state.surcharge) || 0
        const discountValue = +revertFormatMoney(text)
        this.changed = true
        if (discountValue > (totalAmount + surcharge)) {
            this.setState({ discountAmount: formatMoney(text), errDiscountAmount: I18n.t('error_in_order_discount_larger_than_total_amount') })
        } else {
            this.setState({ discountAmount: formatMoney(text), errDiscountAmount: '' })
        }
    }

    _handleChangeSurcharge = (text) => {
        const { orderCart } = this.props
        const totalAmount = this._getTotalAmount(orderCart)
        const surcharge = +revertFormatMoney(text) || 0
        const discountValue = +revertFormatMoney(this.state.discountAmount) || 0
        if (discountValue > (totalAmount + surcharge)) {
            this.setState({ surcharge: formatMoney(text), errDiscountAmount: I18n.t('error_in_order_discount_larger_than_total_amount') })
        } else {
            this.setState({ surcharge: formatMoney(text), errDiscountAmount: '' })
        }

    }

    _getPaymentMethodText = (paymentMethod) => {
        const paymentMethodItem = PAY_METHOD_DISPAY.find(item => item.type == paymentMethod)
        return chainParse(paymentMethodItem, ['name']) || ''
    }

    render() {
        const { orderCart, floorTable, orderCartInfo, isConnected } = this.props
        const orderCode = chainParse(orderCartInfo, ['orderCode'])
        const mode = this.props.navigation.getParam('mode', FORM_MODE.ADD)
        const toolbarTitle = mode == FORM_MODE.ADD ? I18n.t('create_order2') : I18n.t('order_detail')
        const isCreate = this.props.navigation.getParam('isCreate', false)

        return (
            <Container blue>
                <LoadingModal visible={this.state.loading} />
                <PopupConfirm
                    ref={ref => this.popupConfirmDelete = ref}
                    content={this.state.popupDeleteContent}
                    onPressYes={this._deleteOrder}
                    onPressNo={() => { }}
                />
                <PopupConfirm
                    ref={ref => this.popupConfirmBack = ref}
                    content={isCreate ? I18n.t('save_create_order_back_confirm') : I18n.t('save_change_order_back_confirm')}
                    negativeText={I18n.t('exit')}
                    onPressYes={this._handlePressPayLater}
                    onPressNo={this._handlePressNoBackConfirm}
                />
                <View className='flex background'>
                    <Toolbar
                        blue
                        title={toolbarTitle}
                        rightText={!isConnected ? '' : this._isOrderCompleted() ? I18n.t('delete_order') : I18n.t('cancel_order')}
                        onPressRight={this._handlePressCancelOrder}
                        onPressLeft={this._handleBack}
                    />
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={"handled"}
                        enableOnAndroid={true}
                    >
                        <View className='space8' />

                        <FloorTableCollapsibleSelector
                            floorTable={floorTable}
                            floorIndex={this.state.floorPage}
                            onChangeFloor={this._handleChangeFloor}
                            collapsed={!this.state.showTable}
                            onChangeCollapse={this._handleChangeCollapse}
                            selectedTable={orderCartInfo.tableId}
                            onSelectTable={this._handleSelectTable}
                            editable={!this._isOrderCompleted()}
                            onPressAddFloorTable={this._handlePressAddFloorTable}
                        />

                        <View className='space8' />
                        <View className='white'>
                            <View className='ph24 pv14 row-start border-bottom2'>
                                <View className='row-start flex'>
                                    <Text style={{ lineHeight: 20 }}>{I18n.t('order_code')}: </Text>
                                    <Text style={styles.orderCode}>{orderCode}</Text>
                                </View>
                                {!!orderCartInfo.creatorName &&
                                    <Text className='s12 gray lh16' style={{ marginLeft: 8 }}>{orderCartInfo.creatorName}</Text>
                                }
                            </View>
                            <FlatList
                                data={orderCart}
                                keyExtractor={item => item.productId + ''}
                                showsVerticalScrollIndicator={false}
                                renderItem={this._renderProductCartItem}
                                ListFooterComponent={this._renderAddProductButton}
                            />
                        </View>

                        <View className='space8' />

                        <View className='space8' />
                        <SingleRowInput
                            label={I18n.t('direct_discount')}
                            onChangeText={this._handleChangeDiscountAmount}
                            value={formatMoney(this.state.discountAmount)}
                            maxLength={19}
                            keyboardType={'number-pad'}
                            editable={!this._isOrderCompleted()}
                            error={this.state.errDiscountAmount}
                            rightLabel={I18n.t('d')}
                        />

                        <View className='space8' />
                        <SingleRowInput
                            label={I18n.t('surcharge')}
                            onChangeText={this._handleChangeSurcharge}
                            value={formatMoney(this.state.surcharge)}
                            maxLength={19}
                            keyboardType={'number-pad'}
                            editable={!this._isOrderCompleted()}
                            error={this.state.errSurcharge}
                            rightLabel={I18n.t('d')}
                        />

                        <View className='space8' />
                        <View className='row-start white'>
                            <View className='row-all-start pv16' style={styles.leftViewLarge}>
                                <Label style={{ fontSize: 14 }}>{I18n.t('note')}</Label>
                            </View>
                            <View className='flex ph16 border-left2'>
                                <TextInput
                                    style={{
                                        fontSize: 14,
                                        color: COLORS.TEXT_BLACK,
                                        flex: 1,
                                        height: 82,
                                        paddingTop: 16,
                                        paddingBottom: 16,
                                        textAlignVertical: 'top'
                                    }}
                                    multiline={true}
                                    placeholder={!this._isOrderCompleted() ? I18n.t('not_require') : ''}
                                    onChangeText={text => {
                                        this.changed = true
                                        this.setState({ note: text })
                                    }}
                                    value={this.state.note}
                                    maxLength={512}
                                    editable={!this._isOrderCompleted()}
                                />
                            </View>
                        </View>
                        {!!this._isOrderCompleted() && <View>
                            <View className='space8' />
                            <View className='ph24 pv12 white'>
                                <Text className='s12 gray' style={{ marginBottom: 8 }}>{I18n.t('payment_method')}</Text>
                                <Text className='s14 textBlack bold'>{this._getPaymentMethodText(chainParse(orderCartInfo, ['paymentMethod']))}</Text>
                            </View>
                        </View>}
                        <View className='space120' />

                    </KeyboardAwareScrollView>
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
    orderCart: orderCartSelector(state),
    isConnected: isConnectSelector(state)
}), {
        addProductToOrderCart, changeNumberProductOrderCart,
        updateOrderTable, updateOrderInfo, createOrder,
        updateOrderTab, deleteOrderOnline, emptyOrderCart,
        createOrderOffline, getOrderDetail, updateNumberProductOrderCart
    })(OrderDetail)