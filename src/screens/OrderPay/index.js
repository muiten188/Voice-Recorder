import React, { PureComponent } from 'react'
import { TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { formatMoney, chainParse, getPrice, generateHighlightText, replacePatternString } from '~/src/utils'
import I18n from '~/src/I18n'
import Image from 'react-native-fast-image'
import { PopupConfirm, Toolbar, BottomView, Button, View, Caption, RoundCheckbox, Text, TextBold, Container } from '~/src/themesnew/ThemeComponent'
import { productMenuSelectorForSectionList } from '~/src/store/selectors/menu'
import { floorTableSelector } from '~/src/store/selectors/table'
import styles from './styles'
import {
    createOrder, completeOrder, updateOrderInfo, updateOrderTab,
    deleteOrderOnline, printOrder, createOrderOffline, completeOrderOffline
} from '~/src/store/actions/order'
import { generateQRCode } from '~/src/store/actions/qrCode'
import { orderCartInfoSelector, orderCartSelector } from '~/src/store/selectors/order'
import lodash from 'lodash'
import { PAY_METHOD_DISPAY, ORDER_TAB, PAYMENT_METHOD } from '~/src/constants'
import LoadingModal from '~/src/components/LoadingModal'
import { merchantSelector } from '~/src/store/selectors/merchant'
import QRCodeComponent from 'react-native-qrcode-svg'
import ToastUtils from '~/src/utils/ToastUtils'
import { isConnectSelector } from '~/src/store/selectors/info'

class OrderPay extends PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            refreshing: false,
            payMethod: PAYMENT_METHOD.CASH,
            merchantQR: props.merchantInfo && props.merchantInfo.listMerchantQR && props.merchantInfo.listMerchantQR[0]
                && props.merchantInfo.listMerchantQR[0].body ? props.merchantInfo.listMerchantQR[0].body : '',
            orderQR: '',
            showQR: false,
            popupDeleteContent: ''
        }
    }

    _handlePressEndOrder = () => {
        console.log('_handlePressPayNow')
        const { updateOrderInfo, completeOrder, updateOrderTab, printOrder,
            orderCartInfo, orderCart, isConnected, completeOrderOffline } = this.props
        if (this.state.payMethod) {
            updateOrderInfo({
                payMethod: this.state.payMethod
            })
        }
        const orderId = this.props.navigation.getParam('orderId')
        const clientOrderId = this.props.navigation.getParam('clientOrderId')

        const _printAndGoBack = () => {
            const note = this.props.navigation.getParam('note', '')
            const discountAmount = this.props.navigation.getParam('discountAmount', '')
            const totalAmount = this.props.navigation.getParam('totalAmount', '')
            const paidAmount = this.props.navigation.getParam('paidAmount', '')
            console.log('discountAmount totalAmount paidAmount', { discountAmount, totalAmount, paidAmount })

            const orderCode = this.props.navigation.getParam('orderCode')
            const orderPrintObj = {
                orderId,
                orderCode,
                tableId: orderCartInfo.tableId || '',
                tableDisplayName: orderCartInfo.tableDisplayName || '',
                type: 3,
                items: orderCart.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    price: getPrice(item),
                    qty: item.qty
                })),
                note,
                discountAmount,
                totalAmount,
                paidAmount,
                paymentMethod: this.state.payMethod
            }
            printOrder(orderPrintObj)
            ToastUtils.showSuccessToast(I18n.t('pay_order_success'))
            this.props.navigation.navigate('OrderList')
            updateOrderTab(ORDER_TAB.ORDER_OFFLINE_PAID)
        }

        if (isConnected) {
            this.setState({ loading: true })
            completeOrder(orderId, this.state.payMethod, (err, data) => {
                console.log('createOrder err', err)
                console.log('createOrder data', data)
                this.setState({ loading: false })
                const httpStatus = chainParse(data, ['httpHeaders', 'status'])
                if (data && data.code) {
                    ToastUtils.showErrorToast(data.msg)
                } else if (httpStatus == 200) {
                    _printAndGoBack()
                }
            })
        } else {
            completeOrderOffline(orderId || clientOrderId, this.state.payMethod)
            _printAndGoBack()
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
        const orderId = this.props.navigation.getParam('orderId')
        const orderCode = this.props.navigation.getParam('orderCode', '')
        const clientOrderId = this.props.navigation.getParam('clientOrderId')
        const note = this.props.navigation.getParam('note', '')
        const discountAmount = this.props.navigation.getParam('discountAmount', '')
        const totalAmount = this.props.navigation.getParam('totalAmount', '')
        const paidAmount = this.props.navigation.getParam('paidAmount', '')
        const isCreate = this.props.navigation.getParam('isCreate', false)
        const { createOrder, orderCartInfo, orderCart, isConnected, createOrderOffline } = this.props
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
            note,
            discountAmount,
            totalAmount,
            paidAmount,
            paymentMethod: this.state.payMethod,
            isTransaction: false
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
                } else if (httpStatus == 200) {
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
        const { isConnected } = this.props
        if (!isConnected) return
        const orderCode = this.props.navigation.getParam('orderCode')
        console.log('Order Code', orderCode, I18n.t('warning_delete_order'))
        const warnMessage = replacePatternString(I18n.t('warning_delete_order'), `"${orderCode}"`)
        this.setState({
            popupDeleteContent: warnMessage
        }, () => {
            this.popupConfirmDelete && this.popupConfirmDelete.open()
        })
    }

    _deleteOrder = () => {
        const orderId = this.props.navigation.getParam('orderId')
        const orderCode = this.props.navigation.getParam('orderCode')
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

    _renderBottomButton = () => {
        const enableEndOrder = (
            this.state.payMethod == PAYMENT_METHOD.CASH
            || this.state.payMethod == PAYMENT_METHOD.CARD
            || (this.state.payMethod == PAYMENT_METHOD.QR && this.state.orderQR)
        )
        return (
            <BottomView>

                <Button
                    passive
                    onPress={this._handlePressPayLater}
                    style={{ flex: 1 }}
                    text={I18n.t('pay_later')}
                    disabled={!enableEndOrder}
                />

                <Button
                    onPress={this._handlePressEndOrder}
                    style={{ flex: 1 }}
                    text={I18n.t('end_order')}
                    disabled={!enableEndOrder}
                />
            </BottomView>
        )
    }

    _handlePressPayMethod = (item) => {
        if (item.type == PAYMENT_METHOD.QR) {
            if (this.state.merchantQR) {
                const { generateQRCode } = this.props
                const paidAmount = this.props.navigation.getParam('paidAmount')
                const orderId = this.props.navigation.getParam('orderId')
                this.setState({ loading: true })
                generateQRCode(paidAmount, orderId, (err, data) => {
                    console.log('generateQRCode err', err)
                    console.log('generateQRCode data', data)
                    this.setState({ loading: false })
                    const orderQR = chainParse(data, ['updated', 'result'])
                    if (orderQR) {
                        this.setState({ orderQR, payMethod: item.type, showQR: true })
                    }
                })

            } else {
                this.setState({ payMethod: item.type, showQR: true })
            }

        } else {
            this.setState({ payMethod: item.type, showQR: false })
        }

    }

    render() {
        const paidAmount = this.props.navigation.getParam('paidAmount')
        const orderCode = this.props.navigation.getParam('orderCode')
        const { isConnected } = this.props
        return (
            <Container blue>
                <View className='flex background'>
                    <LoadingModal visible={this.state.loading} />
                    <PopupConfirm
                        ref={ref => this.popupConfirmDelete = ref}
                        content={this.state.popupDeleteContent}
                        onPressYes={this._deleteOrder}
                        onPressNo={() => { }}
                    />
                    <Toolbar
                        blue
                        title={I18n.t('pay')}
                        rightText={!isConnected ? '' : I18n.t('cancel_order')}
                        onPressRight={this._handlePressCancelOrder}
                    />
                    <ScrollView>
                        <View className='space8' />
                        <View className='white'>
                            <View className='ph24 pv14 row-start'>
                                <View className='row-start flex'>
                                    <Text className='flex'>
                                        <Text className='lh20'>{I18n.t('order_code')}: </Text>
                                        <Text style={styles.orderCode}>{orderCode}</Text>
                                    </Text>
                                </View>
                                <Text style={styles.totalValue}>{formatMoney(paidAmount)}</Text>
                            </View>
                        </View>
                        <View className='ph24 pt16 pb8'>
                            <Caption>{I18n.t('choose_payment_method')}</Caption>
                        </View>
                        <View className='white'>
                            {PAY_METHOD_DISPAY.map((item, index) => {
                                const isLastItem = index == PAY_METHOD_DISPAY.length - 1
                                const className = isLastItem ? 'row-start ml24 pt24 pb16' : 'row-start ml24 pt24 pb16 border-bottom2'
                                return (
                                    <TouchableOpacity key={item.type} onPress={() => this._handlePressPayMethod(item)}>
                                        <View className={className}>
                                            <RoundCheckbox checked={item.type == this.state.payMethod} onPress={() => this._handlePressPayMethod(item)} />
                                            <TextBold style={{ marginLeft: 24 }}>{item.name}</TextBold>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                            {!!this.state.showQR && (
                                !!this.state.orderQR ?
                                    <View className='row-center pv24'>
                                        <QRCodeComponent
                                            value={this.state.orderQR}
                                            size={200}
                                            ecl={'L'}
                                        />
                                    </View>
                                    :

                                    <View className='row-center'>
                                        <View className='row-center ph24' style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
                                            {generateHighlightText(I18n.t('no_qr_hint'), styles.hightlightTextNormal, styles.hightLightTextHighlight)}
                                        </View>
                                        <Image source={require('~/src/image/no_qr.png')}
                                            style={styles.noQRImage}
                                        />
                                    </View>
                            )}
                        </View>
                        <View className='space50' />
                    </ScrollView>

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
    merchantInfo: merchantSelector(state),
    isConnected: isConnectSelector(state),
}), {
        createOrder, completeOrder, updateOrderInfo, updateOrderTab,
        generateQRCode, deleteOrderOnline, printOrder, createOrderOffline, completeOrderOffline
    })(OrderPay)