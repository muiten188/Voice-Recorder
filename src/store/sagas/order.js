import { takeEvery, all, put, call, select, throttle } from 'redux-saga/effects'
import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { setOrderList, syncOrder, replaceOrderList, emptyOrderCart, getOrderByTab } from '~/src/store/actions/order'
import { syncFloorTableFromDBToRedux, cleanOrderTable, openTable } from '~/src/store/actions/table'
import { takeLatest } from 'redux-saga/effects';
import {
    getListOrder as getListOrderFromDB, saveListOrder,
    getListOrderToPage as getListOrderToPageFromDB, createOtherOrder,
    createCompleteOrder, createDraftTableOrder, completeTableOrder,
    getUnsyncOrder, updateStatusSyncOk, getNumberUnsyncOrder,
    createCompleteTableOrder, deleteOrder, createOrder, completeOrder
} from '~/src/db/order'
import { chainParse, showToast, isTablet } from '~/src/utils'
import { orderListSelector, waitingOrderSelector, paidOrderSelector, orderTabSelector } from "~/src/store/selectors/order"
import I18n from '~/src/I18n'
import NavigationUtils from '~/src/utils/NavigationUtils'
import { syncOrderData } from '~/src/store/actions/backgroundSync'
import { connectedBluetoothPrinterSelector } from '~/src/store/selectors/printer'
import { userInfoSelector } from '~/src/store/selectors/auth'
import { merchantSelector, merchantIdSelector } from '~/src/store/selectors/merchant'
import { Alert } from 'react-native'
import { BLE_ERR, ORDER_TAB } from '~/src/constants'
import { hideToast } from '~/src/store/actions/toast'
import { setWaitingOrderNotification } from '~/src/store/actions/localNotification'
import { enablePrintSelector } from '~/src/store/selectors/setting'


export const requestCreateQR = createRequestSaga({
    request: api.order.createQR,
    key: 'order/createQR',
})

export const requestCreateOrder = createRequestSaga({
    request: api.order.createOrder,
    key: 'order/createOrder'
})

export const requestUpdateOrderAddress = createRequestSaga({
    request: api.order.updateOrderAddress,
    key: 'order/updateOrderAddress'
})

export const requestUpdateOrderInvoice = createRequestSaga({
    request: api.order.updateOrderInvoice,
    key: 'order/updateOrderInvoice'
})

export const requestCalculateOrderFee = createRequestSaga({
    request: api.order.calculateOrderFee,
    key: 'order/calculateOrderFee'
})

export const requestGetOrderDetail = createRequestSaga({
    request: api.order.getOrderDetail,
    key: 'order/getOrderDetail',
})

export const requestRejectOrder = createRequestSaga({
    request: api.order.rejectOrder,
    key: 'order/rejectOrder'
})

export const requestApproveOrder = createRequestSaga({
    request: api.order.approveOrder,
    key: 'order/approveOrder'
})

export const requestDeliveryOrder = createRequestSaga({
    request: api.order.deliveryOrder,
    key: 'order/deliveryOrder'
})

export const requestCompleteOrder = createRequestSaga({
    request: api.order.completeOrder,
    key: 'order/completeOrder'
})

export const requestUpdatePaymentMethod = createRequestSaga({
    request: api.order.updatePaymentMethod,
    key: 'order/updatePaymentMethod'
})

export const requestGetOrderStatistic = createRequestSaga({
    request: api.order.getOrderStatistic,
    key: 'order/getOrderStatistic'
})

export const requestGetTotalPaidOrderByMethod = createRequestSaga({
    request: api.order.getTotalPaidOrderByMethod,
    key: 'order/getTotalPaidOrderByMethod'
})

export const requestAddProductToOrder = createRequestSaga({
    request: api.order.addProductToOrder,
    key: 'order/addProductToOrder'
})

// Handle db online and offline
// export const requestGetOrderByTab = createRequestSaga({
//     request: api.order.getOrderByTab,
//     key: 'order/getOrderByTab',
//     success: [
//         (data) => {
//             if (data && data.content) {
//                 return setOrderList(data)
//             }
//             return noop('')
//         }
//     ]
// })

export const requestGetOrderListFromNetwork = createRequestSaga({
    request: api.order.getOrderByTab,
    key: 'order/getOrderFromNetwork',
})

// Call from View
export const requestGetOrderByTab = function* (action) {
    const { type, args = [] } = action
    try {
        const tab = action.args[1]
        const pageAction = action.args[2]

        const orderListDB = yield call(getListOrderFromDB, tab, pageAction)
        console.log('orderListDB', orderListDB)
        yield put(setOrderList({
            tab,
            orderList: orderListDB
        }))
        const numberUnsyncOrder = yield call(getNumberUnsyncOrder)
        console.log('numberUnsyncOrder', numberUnsyncOrder)
        if (numberUnsyncOrder > 0) return
        // Get from Network while get data from DB
        const orderListResponse = yield call(requestGetOrderListFromNetwork, { type: 'order/getOrderFromNetwork', args })
        if (!orderListResponse || !orderListResponse.content) return
        const orderContent = orderListResponse.content
        const page = chainParse(orderListResponse, ['pagingInfo', 'pageNumber'])
        const totalPage = chainParse(orderListResponse, ['totalPages'])
        const totalElement = chainParse(orderListResponse, ['totalElements'])
        const pageSize = chainParse(orderListResponse, ['pagingInfo', 'pageSize'])


        const saveListOrderResult = yield call(saveListOrder, orderContent, { tab, page, pageSize, totalPage, totalElement })
        console.log('saveListOrderResult', saveListOrderResult)
        const orderListFromRedux = tab == ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY ? yield select(waitingOrderSelector) : yield select(paidOrderSelector)
        // console.log('orderListFromRedux', orderListFromRedux)
        const currentPageRedux = chainParse(orderListFromRedux, ['pagingInfo', 'pageNumber']) || 1
        const orderListDBUpdate = yield call(getListOrderToPageFromDB, tab, currentPageRedux, pageSize)
        // console.log('Order List Db after load', orderListDBUpdate)
        yield put(replaceOrderList({
            tab,
            orderList: orderListDBUpdate
        }))
    } catch (err) {
        console.log('Error', err)
    }
}

// Create other order fucntion
export const requestCreateOtherOrder = function* (action) {
    const { type, payload } = action
    console.log('Payload requestCreateOtherOrder', action)
    const orderObj = payload
    try {
        yield call(createOtherOrder, orderObj)
        showToast(I18n.t('order_saved'))
        yield put(emptyOrderCart())
        yield put(syncOrderData())
    } catch (err) {
        console.log('Error createOtherOrder', err)
    }
}

const _openConnectPrinterPopup = () => {
    return new Promise((resolve, reject) => {
        Alert.alert(
            '',
            I18n.t('hint_connect_printer'),
            [
                {
                    text: I18n.t('ignore'),
                    onPress: () => {
                        resolve(false)
                    },
                    style: 'cancel',
                },
                {
                    text: I18n.t('agree'), onPress: () => {
                        resolve(true)
                    }
                },
            ],
            { cancelable: false }
        )
    })
}

const _openRetryPrinterPopup = () => {
    return new Promise((resolve, reject) => {
        Alert.alert(
            '',
            I18n.t('hint_retry_printer'),
            [
                {
                    text: I18n.t('ignore'),
                    onPress: () => {
                        resolve(false)
                    },
                    style: 'cancel',
                },
                {
                    text: I18n.t('retry'), onPress: () => {
                        resolve(true)
                    }
                },
            ],
            { cancelable: false }
        )
    })
}

const _tick = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 50)
    })
}

const _getBluetoothStatus = () => {
    return new Promise((resolve, reject) => {
        BluetoothStatus.state()
            .then(status => {
                console.log('_getBluetoothStatus', status)
                resolve(status)
            })
            .catch(err => {
                reject(err)
            })
    })
}

const _print = function* (orderObj, orderCode, finishFunc) {
    const enablePrint = yield select(enablePrintSelector)
    if (!enablePrint) {
        yield call(finishFunc)
        return
    }
    try {
        const isBluetoothEnabled = yield call(_getBluetoothStatus)
        const availableBlePrinter = yield select(connectedBluetoothPrinterSelector)
        const userInfo = yield select(userInfoSelector)
        const merchantInfo = yield select(merchantSelector)
        const printObj = {
            merchantName: chainParse(merchantInfo, ['merchant', 'fullName']) || '',
            merchantAddress: chainParse(merchantInfo, ['merchant', 'address']) || '',
            merchantPhone: chainParse(merchantInfo, ['merchant', 'phone']) || '',
            orderCode: orderObj.orderCode || orderCode,
            staff: userInfo.name,
            items: orderObj.items,
            tableDisplayName: orderObj.tableDisplayName || '',
            totalAmount: orderObj.totalAmount,
            discountAmount: orderObj.discountAmount,
            paidAmount: orderObj.paidAmount,
        }
        // console.log('isBluetoothEnabled', isBluetoothEnabled)
        // console.log('availableBlePrinter', availableBlePrinter)

        if (!isBluetoothEnabled || !availableBlePrinter || availableBlePrinter.length == 0) {
            yield put(hideToast())
            yield call(_tick)
            const confirmOpenPrinter = yield call(_openConnectPrinterPopup)
            if (confirmOpenPrinter) {
                NavigationUtils.navigate('BluetoothPrinter', { printData: printObj, finishFunc })
            } else {
                yield call(finishFunc)
            }
        } else {
            yield call(finishFunc)
        }
    } catch (err) {
        console.log('err _print', err.toString())
        const errStr = err.toString()
        if (errStr == BLE_ERR.DISCONNECTED || errStr == BLE_ERR.CHARACTERISTIC_NOT_FOUND) {
            yield put(hideToast())
            yield call(_tick)
            const retryPrint = yield call(_openRetryPrinterPopup)
            if (retryPrint) {
                yield call(_print, orderObj, orderCode, finishFunc)
            }
        }
    }
}

export const requestCreateCompleteOrder = function* (action) {
    const { type, payload } = action
    console.log('Payload requestCreateCompleteOrder', action)
    const orderObj = payload
    const _postFinishOrder = function* () {
        if (isTablet()) {
            yield put(emptyOrderCart())
            NavigationUtils.goBack()
        } else {
            NavigationUtils.navigate('Sale')
        }
    }

    try {
        // create complete order in sqlite DB
        const orderCode = yield call(createCompleteOrder, orderObj)
        showToast(I18n.t('pay_success'))
        yield put(syncOrderData())
        // print
        yield call(_print, orderObj, orderCode, _postFinishOrder)
    } catch (err) {
        console.log('Error requestCreateCompleteOrder', err)
    }
}

export const requestCreateDraftTableOrder = function* (action) {
    const { type, payload } = action
    console.log('Payload requestCreateDraftTableOrder', action)
    const orderObj = payload
    try {
        yield call(createDraftTableOrder, orderObj)
        yield put(openTable({ tableId: orderObj.tableId }))
        NavigationUtils.goBack()
        showToast(I18n.t('saved'))
        yield put(syncOrderData())
    } catch (err) {
        console.log('Error requestCreateDraftTableOrder', err)
    }
}

export const requestCreateCompleteTableOrder = function* (action) {
    const { type, payload } = action
    console.log('Payload requestCreateCompleteTableOrder', action)
    const orderObj = payload

    const _postFinishOrder = function* () {
        NavigationUtils.goBack()
    }
    try {
        yield call(createCompleteTableOrder, orderObj)
        yield put(cleanOrderTable(orderObj.tableId))
        yield put(syncFloorTableFromDBToRedux())
        showToast(I18n.t('pay_success'))
        yield put(syncOrderData())
        // print
        yield call(_print, orderObj, '', _postFinishOrder)
    } catch (err) {
        console.log('Error requestCreateDraftTableOrder', err)
    }
}

export const requestCompleteTableOrder = function* (action) {
    console.log('requestCompleteTableOrder', action)
    const _postFinishOrder = function* () {
        NavigationUtils.navigate('Table')
        showToast(I18n.t('pay_success'))
        yield put(syncOrderData())
    }

    try {
        const { payload: { orderId, paymentMethod, tableId, orderInfo } } = action
        yield call(completeTableOrder, orderId, paymentMethod, tableId)
        yield put(cleanOrderTable(tableId))
        yield put(syncFloorTableFromDBToRedux())
        // print
        yield call(_print, orderInfo, '', _postFinishOrder)
    } catch (err) {
        console.log('requestCompleteTableOrder err', err)
    }
}

const syncOrderToNetwork = createRequestSaga({
    request: api.order.syncOrder,
    key: 'order/syncOrderToNetwork',
})

export const requestSyncOrder = function* () {
    try {
        const notSyncOrder = yield call(getUnsyncOrder)
        console.log('Unsync order', JSON.stringify(notSyncOrder))
        if (!notSyncOrder || notSyncOrder.length == 0) return
        const syncResult = yield call(syncOrderToNetwork, { type: 'order/syncOrderToNetwork', args: [notSyncOrder] })
        console.log('Sync Result', syncResult)
        const syncOkOrderStr = chainParse(syncResult, ['updated', 'result'])
        if (!syncOkOrderStr) return
        const syncOkOrders = syncOkOrderStr.split(',')
        console.log('List update Ok', syncOkOrders)
        yield call(updateStatusSyncOk, syncOkOrders)

        const remainNotSyncOrder = yield call(getUnsyncOrder)
        console.log('remainNotSyncOrder', JSON.stringify(remainNotSyncOrder))
        if (!remainNotSyncOrder || remainNotSyncOrder.length == 0) {
            const merchantId = yield select(merchantIdSelector)
            const orderTab = yield select(orderTabSelector)
            yield put(getOrderByTab(merchantId, orderTab, 1))
            return
        }

        yield put(syncOrder())
    } catch (err) {
        console.log('requestSyncOrder err', err)
    }
}

export const requestDeleteOrder = function* (action) {
    console.log('requestDeleteOrder', action)
    try {
        const orderId = action.payload
        const deleteOrderResult = yield call(deleteOrder, orderId)
        yield put(syncFloorTableFromDBToRedux())
        yield put(syncOrderData())
        NavigationUtils.goBack()
        showToast(I18n.t('delete_order_success'))
    } catch (err) {
        console.log('requestDeleteOrder err', err)
    }
}

export const requestSearchOrder = createRequestSaga({
    request: api.order.searchOrder,
    key: "order/searchOrder",
});

export const requestPrintOrder = function* (action) {
    const orderInfo = action.payload
    console.log('orderInfo sagas', orderInfo)
    const _postFinishOrder = function* () {
    }
    yield call(_print, orderInfo, orderInfo.orderCode, _postFinishOrder)
}

export const requestDeleteOrderOnline = createRequestSaga({
    request: api.order.deleteOrder,
    key: 'order/deleteOrderOnline',
})

export const requestCreateOrderOffline = function* (action) {
    const { type, payload: { data, callback } } = action

    console.log('Payload requestCreateOrderOffline', action)
    const orderObj = data
    try {
        const result = yield call(createOrder, orderObj)
        callback && callback(result)
    } catch (err) {
        console.log('Error requestCreateOrderOffline', err)
    }
}

export const requestCompleteOrderOffline = function* (action) {
    const { type, payload: { orderId, paymentMethod, callback } } = action
    try {
        const result = yield call(completeOrder, orderId, paymentMethod)
        // callback && callback(result)
    } catch (err) {
        console.log('Error requestCompleteOrderOffline', err)
    }
}

export const requestGetOrderWaitByFloor = createRequestSaga({
    request: api.order.getOrderWaitByFloor,
    key: "order/getOrderWaitByFloor",
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('order/createQR', requestCreateQR),
        takeEvery('order/createOrder', requestCreateOrder),
        takeEvery('order/updateOrderAddress', requestUpdateOrderAddress),
        takeEvery('order/updateOrderInvoice', requestUpdateOrderInvoice),
        takeEvery('order/calculateOrderFee', requestCalculateOrderFee),
        takeEvery('order/getOrderDetail', requestGetOrderDetail),
        takeEvery('order/searchOrder', requestSearchOrder),
        takeLatest('order/rejectOrder', requestRejectOrder),
        takeLatest('order/approveOrder', requestApproveOrder),
        takeLatest('order/deliveryOrder', requestDeliveryOrder),
        takeLatest('order/completeOrder', requestCompleteOrder),
        takeLatest('order/updatePaymentMethod', requestUpdatePaymentMethod),
        takeLatest('order/getOrderStatistic', requestGetOrderStatistic),
        takeLatest('order/getTotalPaidOrderByMethod', requestGetTotalPaidOrderByMethod),
        takeLatest('order/addProductToOrder', requestAddProductToOrder),


        /* Order Offline */
        takeEvery('order/getOrderByTab', requestGetOrderByTab),
        takeEvery('order/createOtherOrder', requestCreateOtherOrder),
        takeEvery('order/createCompleteOrder', requestCreateCompleteOrder),
        takeEvery('order/createDraftTableOrder', requestCreateDraftTableOrder),
        takeEvery('order/completeTableOrder', requestCompleteTableOrder),
        throttle(20000, 'order/syncOrder', requestSyncOrder),
        // takeEvery('order/syncOrder', requestSyncOrder),
        takeEvery('order/createCompleteTableOrder', requestCreateCompleteTableOrder),
        takeEvery('order/deleteOrder', requestDeleteOrder),
        takeEvery('order/printOrder', requestPrintOrder),
        takeEvery('order/deleteOrderOnline', requestDeleteOrderOnline),
        takeEvery('order/createOrderOffline', requestCreateOrderOffline),
        takeEvery('order/completeOrderOffline', requestCompleteOrderOffline),
        takeEvery('order/getOrderWaitByFloor', requestGetOrderWaitByFloor)
    ])
}


