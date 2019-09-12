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


export const openDrawer = () => ({ type: 'app/openDrawer' })
export const closeDrawer = () => ({ type: 'app/closeDrawer' })
export const setConnection = (data) => ({ type: 'app/setConnection', payload: data })

export const showForceUpdate = (data) => ({ type: 'app/showForceUpdate' , payload: data})
export const setShowForceUpdate = (data) => ({ type: 'app/setShowForceUpdate' , payload: data})

export const logout = () => ({ type: ACTION_TYPES.AUTH_LOGOUT })