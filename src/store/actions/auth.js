import * as ACTION_TYPES from '~/src/store/types'
export const signIn = (...args) => ({
    type: ACTION_TYPES.AUTH_SIGNIN,
    args
})

export const saveUserData = (data) => ({
    type: ACTION_TYPES.AUTH_SAVE_USER_DATA,
    payload: data
})

export const createAccessToken = (...args) => ({
    type: ACTION_TYPES.AUTH_CREATE_ACCESS_TOKEN,
    args
})

export const getUserInfo = (...args) => ({
    type: ACTION_TYPES.AUTH_GET_USER_INFO,
    args
})


// export const getProfile = (...args)=>({
//     type:'auth/getProfile',
//     args
// })

// export const changePassword = (...args) => ({
//     type: 'auth/changePassword',
//     args
// })

// export const resetPassword =  (...args) => ({
//     type: 'auth/resetPassword',
//     args
// })

// export const updateAccessToken = (data) => ({
//     type: 'auth/updateAccessToken',
//     payload: data
// })

// export const setUserInfo = (data) => ({
//     type: 'user/setUserInfo',
//     payload: data
// })

// export const updateTokenInfo = (...args) => ({
//     type: 'auth/updateTokenInfo',
//     args
// })

// export const updateUserInfo = (...args) => ({
//     type: 'auth/updateUserInfo',
//     args
// })