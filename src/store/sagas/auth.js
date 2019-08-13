import { takeLatest, takeEvery, all } from 'redux-saga/effects'

import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { saveUserData, setUserInfo } from '~/src/store/actions/auth'
import { clearProduct } from '~/src/db/product'
import { clearOrder } from '~/src/db/order'
import tableModel from '~/src/db/table'
import menuModel from '~/src/db/menu'
import backgroundSyncModel from '~/src/db/backgroundSync'
import notificationModel from '~/src/db/localNotification'
import { StackActions, NavigationActions } from 'react-navigation'
import NavigationUtils from '~/src/utils/NavigationUtils'
import lodash from 'lodash'

export const requestSignIn = createRequestSaga({
    request: api.auth.signIn,
    key: 'auth/signIn',
    success: [
        (data) => {
            console.log('Data SignIn Saga', data)
            if (data && data.accessToken) {
                const { args, ...rest } = data
                return saveUserData(rest)
            }
            return noop('')
        }
    ]
})
export const requestGenTenantCode = createRequestSaga({
    request:api.auth.genTenantCode,
    key:'auth/genTenantCode',

})
export const requestSignUp = createRequestSaga({
    request: api.auth.signUp,
    key: 'auth/signUp',
    success: [
        (data) => {
            console.log('Data SignIn Saga', data)
            if (data && data.accessToken) {
                const { args, ...rest } = data
                return saveUserData(rest)
            }
            return noop('')
        }
    ]
})

export const requestCreateOTPToken = createRequestSaga({
    request: api.auth.createOTPToken,
    key: 'auth/createOTPToken',
})

export const requestVerifyOTPToken = createRequestSaga({
    request: api.auth.verifyOTPToken,
    key: 'auth/verifyOTPToken',
})

export const requestCheckExistUser = createRequestSaga({
    request: api.auth.checkExistUser,
    key: 'auth/checkExistUser',
})

export const requestCheckExistTenant = createRequestSaga({
    request: api.auth.checkExistTenant,
    key: 'auth/checkExistTenant',
})

export const requestChangePassword = createRequestSaga({
    request: api.auth.changePassword,
    key: 'auth/changePassword',
})

export const requestResetPassword = createRequestSaga({
    request: api.auth.resetPassword,
    key: 'auth/resetPassword',
})

export const requestVerifyPin = createRequestSaga({
    request: api.auth.verifyPin,
    key: 'user/verify-pin',
})

export const requestGetUserInfo = createRequestSaga({
    request: api.auth.getUserInfo,
    key: 'user/getUserInfo',
    success: [
        (data) => {
            console.log('Data SignIn Saga', data)
            if (data && data.id) {
                return setUserInfo(lodash.pick(data, ['name', 'avatar', 'tenantCode', 'userName', 'phone']))
            }
            return noop('')
        }
    ]
})


clearDB = function* () {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login', })],
        key: undefined
    })
    NavigationUtils.dispatch(resetAction)
    clearProduct()
        .then(result => {
            console.log('Clear product', result)
        })
        .catch(err => {
            console.log('Clear product err', err)
        })
    clearOrder()
        .then(result => {
            console.log('clearOrder', result)
        })
        .catch(err => {
            console.log('clearOrder err', err)
        })
    tableModel.clearFloor()
        .then(result => {
            console.log('clearFloor', result)
        })
        .catch(err => {
            console.log('clearFloor err', err)
        })
    backgroundSyncModel.clearVersion()
        .then(result => {
            console.log('clearVersion', result)
        })
        .catch(err => {
            console.log('clearVersion err', err)
        })
    menuModel.clearMenu()
        .then(result => {
            console.log('clearMenu', result)
        })
        .catch(err => {
            console.log('clearMenu err', err)
        })
    notificationModel.clearNotification()
}

export const requestUpdateTokenInfo = createRequestSaga({
    request: api.auth.updateTokenInfo,
    key: 'auth/updateTokenInfo',
})

export const requestUpdateUserInfo = createRequestSaga({
    request: api.auth.updateUserInfo,
    key: 'auth/updateUserInfo',
})


// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('auth/signIn', requestSignIn),
        takeEvery('auth/signUp', requestSignUp),
        takeEvery('auth/createOTPToken', requestCreateOTPToken),
        takeEvery('auth/verifyOTPToken', requestVerifyOTPToken),
        takeEvery('auth/checkExistUser', requestCheckExistUser),
        takeEvery('auth/checkExistTenant', requestCheckExistTenant),
        takeEvery('auth/changePassword', requestChangePassword),
        takeEvery('auth/resetPassword', requestResetPassword),
        takeEvery('user/verify-pin', requestVerifyPin),
        takeLatest('app/logout', clearDB),
        takeEvery('user/getUserInfo', requestGetUserInfo),
        takeEvery('auth/updateTokenInfo', requestUpdateTokenInfo),
        takeEvery('auth/genTenantCode',requestGenTenantCode),
        takeEvery('auth/updateUserInfo', requestUpdateUserInfo)
    ])
}


