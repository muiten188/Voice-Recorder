import * as ACTION_TYPES from '~/src/store/types'

export const getListUser = (...args) => ({
    type: ACTION_TYPES.USER_GET_LIST,
    args
})

export const setListUser = (data) => ({
    type: ACTION_TYPES.USER_SET_LIST,
    payload: data
})

export const updateOtherUserInfo = (...args) => ({
    type: ACTION_TYPES.USER_UPDATE_INFO,
    args
})