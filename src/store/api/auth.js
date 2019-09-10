import { get, post } from './common'
export default {
    signIn: (email, password) => {
        return post('/api/v2/logopt', { email, password })
    },
    createAccessToken: (refresh_token) => {
        return post('/api/v2/token', {}, { token: refresh_token })
    },
    getUserInfo: () => {
        return get('/api/v2/user')
    },

    // genTenantCode: (tenantName) => {
    //     return get('/user-tenant/generate-tenant-code', { tenantName })
    // },
    // signUp: (requestObj) => {
    //     return post('/user-tenant/signup', requestObj)
    // },
    // signIn: (tenant_code, userName, password) => {
    //     return post('/user-tenant/signin', { tenant_code, userName, password })
    // },
    // resetPassword: (userId) => {
    //     return post('/user-tenant/reset-password', { userId })
    // },
    // createOTPToken: (phone) => {
    //     return get('/otp/create-otp-token', { phone })
    // },
    // verifyOTPToken: (otp) => {
    //     return get('/otp/verify-otp-token', { otp })
    // },
    // checkExistUser: (tenantCode, phone) => {
    //     return get('/user/check-existed-user', { tenantCode, phone })
    // },
    // checkExistTenant: (tenantCode) => {
    //     return get('/user-tenant/check-existed-tenant', { tenantCode })
    // },

    // changePassword: (oldPassword, newPassword) => {
    //     return post('/user-tenant/change-password', { oldPassword, newPassword })
    // },
    // verifyPin: (pinNumber) => {
    //     return post('/user/verify-pin', { pinNumber })
    // },

    // updateTokenInfo: (token) => {
    //     return post('/user-tenant/update-token-info', { token })
    // },
    // updateUserInfo: (name, phone) => {
    //     return post('/user-tenant/update-user-info', { name, phone })
    // }

}