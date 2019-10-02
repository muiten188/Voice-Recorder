import { get, post, put } from './common'
export default {
    signIn: (email, password) => {
        return post('/api/v2/logopt', { email, password })
    },
    createAccessToken: (refresh_token) => {
        return post('/api/v2/token', {}, { customHeader: { token: refresh_token } })
    },
    getUserInfo: () => {
        return get('/api/v2/user')
    },
    updateUserInfo: (email, body) => {
        return put(`/api/v2/user?email=${email}`, body)
    }
}