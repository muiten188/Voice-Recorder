import { fork, takeLatest, takeEvery, all } from 'redux-saga/effects'
import homeSaga from './home'
import authSaga from './auth'
import merchantSaga from './merchant'
import orderSaga from './order'
import productSagas from './product'
import addressSagas from './address'
import notificationSagas from './notification'
import tableSagas from './table'
import permissionSagas from './permission'
import backgroundSync from './backgroundSync'
import menuSagas from './menu'
import printerSagas from './printer'
import supplierSagas from './supplier'
import costManageSagas from './costManage'
import settingSagas from './setting'
import localNotificationSagas from './localNotification'
import reportSagas from './report'
import debtManageSagas from './debtManage'
import qrCodeSagas from './qrCode'

// saga must be a function like generator of other functions
export default function* () {
    yield all([
        fork(homeSaga),
        fork(authSaga),
        fork(merchantSaga),
        fork(orderSaga),
        fork(productSagas),
        fork(addressSagas),
        fork(notificationSagas),
        fork(tableSagas),
        fork(permissionSagas),
        fork(backgroundSync),
        fork(menuSagas),
        fork(printerSagas),
        fork(supplierSagas),
        fork(costManageSagas),
        fork(settingSagas),
        fork(localNotificationSagas),
        fork(reportSagas),
        fork(debtManageSagas),
        fork(qrCodeSagas)
    ])
}