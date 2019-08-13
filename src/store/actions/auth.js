export const signIn = (...args) => ({
    type: 'auth/signIn',
    args
})
export const genTenantCode=(...args)=>({
    type:'auth/genTenantCode',
    args
})
export const saveUserData = (data) => ({
    type: 'auth/saveUserData',
    payload: data
})

export const signUp = (...args) => ({
    type: 'auth/signUp',
    args
})
export const getProfile = (...args)=>({
    type:'auth/getProfile',
    args
})

export const createOTPToken = (...args) => ({
    type: 'auth/createOTPToken',
    args
})

export const verifyOTPToken = (...args) => ({
    type: 'auth/verifyOTPToken',
    args
})

export const checkExistUser = (...args) => ({
    type: 'auth/checkExistUser',
    args
})

export const checkExistTenant = (...args) => ({
    type: 'auth/checkExistTenant',
    args
})

export const changePassword = (...args) => ({
    type: 'auth/changePassword',
    args
})

export const resetPassword =  (...args) => ({
    type: 'auth/resetPassword',
    args
})

export const updateAccessToken = (data) => ({
    type: 'auth/updateAccessToken',
    payload: data
})

export const verifyPin = (...args) => ({
    type: 'user/verify-pin',
    args 
})

export const getUserInfo = (...args) => ({
    type: 'user/getUserInfo',
    args 
})

export const setUserInfo = (data) => ({
    type: 'user/setUserInfo',
    payload: data
})

export const setFirebaseToken = (data) => ({
    type: 'auth/setFirebaseToken',
    payload: data
})

export const updateTokenInfo = (...args) => ({
    type: 'auth/updateTokenInfo',
    args
})

export const updateUserInfo = (...args) => ({
    type: 'auth/updateUserInfo',
    args
})