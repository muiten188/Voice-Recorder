import { call, put, take, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import {
    invokeCallback,
    logout
} from '~/src/store/actions/common'
import { updateAccessToken } from '~/src/store/actions/auth'
import { TIMEOUT, TIMEOUT_TIME, NETWORD_ERROR_EXCEPTION } from '~/src/constants'
import I18n from '~/src/I18n'
import { store } from '~/src/store/configStore'
import { StackActions, NavigationActions } from 'react-navigation'
import NavigationUtils from '~/src/utils/NavigationUtils'
import { isConnectSelector } from '~/src/store/selectors/info'
import { OFFLINE_ACTION_REQUESTER } from '~/src/store/api/constants'
import ToastUtils from '~/src/utils/ToastUtils'

export const handleCommonError = function* (response) {
    if (!response) return false
    const status = response.httpHeaders && response['httpHeaders']['status'] ? +response['httpHeaders']['status'] : 0
    if (status >= 500 && status < 599) {
        ToastUtils.showErrorToast(I18n.t('err_general'))
        return true
    } else if (response.code == 4903) {
        const state = store.getState()
        if (state && state.auth && Object.keys(state.auth).length > 0) {
            yield put(logout())
            const resetAction = StackActions.reset({
                index: 0,
                key: undefined,
                actions: [NavigationActions.navigate({ routeName: 'Login', params: { isExpired: true } })],
            })
            NavigationUtils.dispatch(resetAction)
        }
        return true
    }
    else if (response.code == 1010) {
        const state = store.getState()
        if (state && state.auth && Object.keys(state.auth).length > 0) {
            yield put(logout())
            const resetAction = StackActions.reset({
                index: 0,
                key: undefined,
                actions: [NavigationActions.navigate({ routeName: 'Login', params: { isResetPassWord: true } })],
            })
            NavigationUtils.dispatch(resetAction)
        }
        return true
    }
    else if (response.code == 1007) {
        const state = store.getState()
        if (state && state.auth && Object.keys(state.auth).length > 0) {
            yield put(logout())
            return true
        }
    } else if (response.code == 9001) {
        ToastUtils.showErrorToast(I18n.t('no_permission_error'))
        return true
    } else if (response.errorCode == 103) {
        ToastUtils.showForceUpdate(response.data.update_url)
        return true
    } else if (response.code == 104) {
        ToastUtils.showErrorToast(response.errorMessage || I18n.t('invalid_checksum'))
        return true
    }
    return false
}


export const createRequestSaga = ({ request, key, start, stop, success, failure, cancelled, timeout = TIMEOUT_TIME, cancel }) => {

    // when we dispatch a function, redux-thunk will give it a dispatch
    // while redux-saga will give it an action instead, good for testing
    // we may not needs this if we use redux-saga, of course we can use both
    return function* (action) {
        // default is empty
        let args = action && action.args ? action.args : []
        // check to see if we have success callback that pass as a param, so that it will be callback from where it was born
        // with this way we can make something like cleaning the messages
        let callback = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null
        if (callback) {
            args = args.slice(0, -1)
        }
        // error first callback
        let ret = null
        let err = null
        // let callCallback = true

        // store into redux
        const requestKey = (typeof key === 'function') ? key(...args) : key
        if (start) for (let actionCreator of start) {
            yield put(actionCreator())
        }

        try {

            // this is surely Error exception, assume as a request failed
            if (!request) {
                throw new Error("Api method not found!!!")
            }

            // we do not wait forever for whatever request !!!
            // timeout is 0 mean default timeout, so default is 0 in case user input 0
            let raceOptions = {
                data: call(request, ...args),
                isTimeout: call(delay, timeout)
            }

            if (cancel) {
                raceOptions.cancelRet = take(cancel)
            }
            let res = yield race(raceOptions)
            const { isTimeout, cancelRet } = res
            let { data } = res
            // console.log('Data Common', data)
            // Append Argument
            if (data) {
                const hasError = yield call(handleCommonError, data)
                if (hasError) return
                if (data.httpHeaders && data['httpHeaders']['access-token']) {
                    yield put(updateAccessToken(data['httpHeaders']['access-token']))
                }
                data.args = args
            }
            if (isTimeout) {
                const isConnect = yield select(isConnectSelector)
                console.log('Is connect', isConnect)
                if (!action || !action.type || !OFFLINE_ACTION_REQUESTER[action.type]) {
                    if (isConnect) {
                        console.log('Action isConnect', action)
                        ToastUtils.showErrorToast(I18n.t('request_time_out'))
                    } else {
                        console.log('Action notConnect', action)
                        // ToastUtils.showErrorToast(I18n.t('feature_not_available_when_offline'))
                        ToastUtils.showNotAvailableWhenOfflineToast()
                    }

                }
                throw TIMEOUT
            } else if (cancelRet) {
                // callback on success
                if (cancelled) for (let actionCreator of cancelled) {
                    yield put(actionCreator(cancelRet, action))
                }
            } else {
                // callback on success
                if (success) for (let actionCreator of success) {
                    yield put(actionCreator(data, action))
                }

                // assign data, for cancel both ret and err is null
                ret = data
            }
            return data

        } catch (reason) {
            if (reason && reason.toString().indexOf(NETWORD_ERROR_EXCEPTION) == 0) {
                const isConnect = yield select(isConnectSelector)
                console.log('Is connect', isConnect)
                if (!action || !action.type || !OFFLINE_ACTION_REQUESTER[action.type]) {
                    if (isConnect) {
                        console.log('Action catch connect', action)
                        ToastUtils.showErrorToast(I18n.t('request_time_out'))
                    } else {
                        console.log('Action catch not connect', action)
                        ToastUtils.showNotAvailableWhenOfflineToast()
                    }
                }
            }
            // anyway, we should treat this as error to log
            if (failure) for (let actionCreator of failure) {
                yield put(actionCreator(reason, action))
            }

            // mark error
            err = reason
        } finally {
            if (stop) for (let actionCreator of stop) {
                yield put(actionCreator(ret, action))
            }
            if (callback) {
                yield put(invokeCallback(callback, err, ret))
            }
        }
        return
    }
}
