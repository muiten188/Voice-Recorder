import * as ACTION_TYPES from '~/src/store/types'
// do nothing
export const noop = () => ({
    type: 'app/noop',
})

// do callback and get result as paload
export const invokeCallback = (callback, ...args) => ({
    type: 'app/invokeCallback',
    payload: callback && callback.call(null, ...args),
})

export const setAppState = (data) => ({ type: ACTION_TYPES.INFO_SET_APPSTATE, payload: data })
export const setConnection = (data) => ({ type: ACTION_TYPES.INFO_SET_CONNECTION, payload: data })
export const logout = () => ({ type: ACTION_TYPES.AUTH_LOGOUT })