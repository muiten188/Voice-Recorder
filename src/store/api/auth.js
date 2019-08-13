import { get, post } from './common'
export default {
    // signIn: (phone, password) => {
    //     return post('/user/signin', { phone, password })
    // },
    // signUp: (name, password, access_token) => {
    //     return post('/user/signup', { access_token, password, name })
    // },

    // {
    //     "name": "Nguyen Quoc Thang",
    //     "password": "e10adc3949ba59abbe56e057f20f883e",
    //     "phone" : "0983326480",
    //     "email" : "thangnguyen@octech.com.vn",
    //     "type" : 1,
    //     "tenantCode" : "octech",
    //     "tenantName" : "Cong ty co phan octech",
    //     "la": "1234567.78888",
    //     "lo": "3464565.45756",
    //     "tenantAddress": "54 Nguyễn Chí Thanh"
    //    }
    genTenantCode: (tenantName) => {
        return get('/user-tenant/generate-tenant-code', { tenantName })
    },
    signUp: (requestObj) => {
        return post('/user-tenant/signup', requestObj)
    },
    signIn: (tenant_code, userName, password) => {
        return post('/user-tenant/signin', { tenant_code, userName, password })
    },
    resetPassword: (userId) => {
        return post('/user-tenant/reset-password', { userId })
    },
    createOTPToken: (phone) => {
        return get('/otp/create-otp-token', { phone })
    },
    verifyOTPToken: (otp) => {
        return get('/otp/verify-otp-token', { otp })
    },
    checkExistUser: (tenantCode, phone) => {
        return get('/user/check-existed-user', { tenantCode, phone })
    },
    checkExistTenant: (tenantCode) => {
        return get('/user-tenant/check-existed-tenant', { tenantCode })
    },

    changePassword: (oldPassword, newPassword) => {
        return post('/user-tenant/change-password', { oldPassword, newPassword })
    },
    verifyPin: (pinNumber) => {
        return post('/user/verify-pin', { pinNumber })
    },

    getUserInfo: () => {
        return get('/user-tenant/get-user-info')
    },
    updateTokenInfo: (token) => {
        return post('/user-tenant/update-token-info', { token })
    },
    updateUserInfo: (name, phone) => {
        return post('/user-tenant/update-user-info', { name, phone })
    }

}