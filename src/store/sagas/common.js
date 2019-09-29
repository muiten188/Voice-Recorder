import { call, put, take, race, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import {
    invokeCallback,
    logout
} from '~/src/store/actions/common'
import { updateAccessToken } from '~/src/store/actions/auth'
import { TIMEOUT, TIMEOUT_TIME, NETWORD_ERROR_EXCEPTION, NETWORK_ERROR } from '~/src/constants'
import I18n from '~/src/I18n'
import { store } from '~/src/store/configStore'
import { StackActions, NavigationActions } from 'react-navigation'
import NavigationUtils from '~/src/utils/NavigationUtils'
import ToastUtils from '~/src/utils/ToastUtils'

export const handleCommonError = function* (response) {
    if (!response) return false
    const status = response.httpHeaders && response['httpHeaders']['status'] ? +response['httpHeaders']['status'] : 0
    if (status >= 500 && status < 599) {
        ToastUtils.showErrorToast(I18n.t('err_general'))
        return true
    } else if (response.code == TIMEOUT || response.code == NETWORK_ERROR) {
        ToastUtils.showErrorToast(I18n.t('request_time_out'))
        return true
    }
    return false
}

export const createRequestSaga = ({ request, success }) => {
    return function* (action) {
        let args = action && action.args ? action.args : []
        let callback = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null
        if (callback) args = args.slice(0, -1)
        // error first callback
        let ret = null
        let err = null
        try {
            // this is surely Error exception, assume as a request failed
            if (!request) throw new Error("Api method not found!!!")
            let apiResponse = yield call(request, ...args)
            console.log('Data Common', apiResponse)
            const hasError = yield call(handleCommonError, apiResponse)
            if (hasError) return
            if (apiResponse.httpHeaders && apiResponse['httpHeaders']['access-token']) {
                yield put(updateAccessToken(apiResponse['httpHeaders']['access-token']))
            }
            apiResponse.args = args
            if (success) for (let actionCreator of success) {
                yield put(actionCreator(apiResponse, action))
            }
            ret = apiResponse
            return apiResponse
        } catch (reason) {
            // mark error
            err = reason
        } finally {
            if (callback) {
                yield put(invokeCallback(callback, err, ret))
            }
        }
        return
    }
}
