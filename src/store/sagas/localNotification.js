import { takeEvery, all, put, call, select } from 'redux-saga/effects'
import { showToast } from '~/src/utils'
import I18n from '~/src/I18n'
import notificationModel from '~/src/db/localNotification'
import { NOTIFICATION_TYPE, WAITING_ORDER_NOTIFY_PERIOD } from '~/src/constants'
// import PushNotification from 'react-native-push-notification'

export const requestSetWaitingOrderNotification = function* (action) {
    console.log('Action requestSetWaitingOrderNotification', action)
    const order = action.payload
    const addNotificationResult = yield call(notificationModel.addNotification, order.orderId, NOTIFICATION_TYPE.SINGLE_WAITING_ORDER)
    console.log('addNotificationResult', addNotificationResult)
    // PushNotification.localNotificationSchedule({
    //     title: I18n.t('notification'), // (optional)
    //     message: `Đơn hàng ${order.orderCode} đang chờ thanh toán`, // (required)
    //     playSound: true, // (optional) default: true
    //     priority: 'max',
    //     importance: 'max',
    //     vibrate: true,
    //     date: new Date(Date.now() + (WAITING_ORDER_NOTIFY_PERIOD * 1000)),
    //     data: {
    //         id: order.orderId,
    //         type: NOTIFICATION_TYPE.SINGLE_WAITING_ORDER,
    //         order
    //     },
    //     userInfo: {
    //         id: order.orderId,
    //         type: NOTIFICATION_TYPE.SINGLE_WAITING_ORDER,
    //         order
    //     }

    // })
}

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('localNotification/setWaitingOrderNotification', requestSetWaitingOrderNotification),
    ])
}


