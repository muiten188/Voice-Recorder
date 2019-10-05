import { takeLatest, takeEvery, all } from 'redux-saga/effects'
import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { saveUserData } from '~/src/store/actions/auth'
import { chainParse } from '~/src/utils'
import { StackActions, NavigationActions } from 'react-navigation'
import NavigationUtils from '~/src/utils/NavigationUtils'
import * as ACTION_TYPES from '~/src/store/types'

const requestSignIn = createRequestSaga({
    request: api.auth.signIn,
    key: ACTION_TYPES.AUTH_SIGNIN,
})

const requestCreateAccessToken = createRequestSaga({
    request: api.auth.createAccessToken,
    key: ACTION_TYPES.AUTH_CREATE_ACCESS_TOKEN,
    success: [
        (data) => {
            console.log('Data requestCreateAccessToken', data)
            const statusCode = chainParse(data, ['httpHeaders', 'status'])
            if (statusCode == 200) {
                return saveUserData(data)
            }
            return noop('')
        }
    ]
})

const requestLogout = function* () {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login', })],
        key: undefined
    })
    NavigationUtils.dispatch(resetAction)
}

const requestGetUserInfo = createRequestSaga({
    request: api.auth.getUserInfo,
    key: ACTION_TYPES.AUTH_GET_USER_INFO,
    success: [
        (data) => {
            const statusCode = chainParse(data, ['httpHeaders', 'status'])
            if (statusCode == 200) {
                return saveUserData(data)
            }
            return noop('')
        }
    ]
})

const requestUpdateUserInfo = createRequestSaga({
    request: api.auth.updateUserInfo,
    key: ACTION_TYPES.AUTH_UPDATE_USER_INFO,
})


// export const requestChangePassword = createRequestSaga({
//     request: api.auth.changePassword,
//     key: 'auth/changePassword',
// })




// export const requestUpdateTokenInfo = createRequestSaga({
//     request: api.auth.updateTokenInfo,
//     key: 'auth/updateTokenInfo',
// })

// export const requestUpdateUserInfo = createRequestSaga({
//     request: api.auth.updateUserInfo,
//     key: 'auth/updateUserInfo',
// })


// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery(ACTION_TYPES.AUTH_SIGNIN, requestSignIn),
        takeLatest('app/logout', requestLogout),
        takeEvery(ACTION_TYPES.AUTH_CREATE_ACCESS_TOKEN, requestCreateAccessToken),
        takeEvery(ACTION_TYPES.AUTH_GET_USER_INFO, requestGetUserInfo),
        takeEvery(ACTION_TYPES.AUTH_UPDATE_USER_INFO, requestUpdateUserInfo)

        // takeEvery('auth/changePassword', requestChangePassword),
        // takeEvery('auth/updateTokenInfo', requestUpdateTokenInfo),
        // takeEvery('auth/updateUserInfo', requestUpdateUserInfo)
    ])
}


