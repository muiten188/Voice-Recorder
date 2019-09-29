import { get, post } from './common'
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
}