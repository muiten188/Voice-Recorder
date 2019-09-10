export const signIn = (...args) => ({
    type: 'auth/signIn',
    args
})

export const saveUserData = (data) => ({
    type: 'auth/saveUserData',
    payload: data
})

export const createAccessToken = (...args) => ({
    type: 'auth/createAccessToken',
    args
})

export const getUserInfo = (...args) => ({
    type: 'auth/getUserInfo',
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