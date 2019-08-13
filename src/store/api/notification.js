import { get, post } from './common'
export default {
    getNotification: (merchantId, page = 1) => {
        return get('/notification/get-notification-list', { merchantId, page })
    },
    markReadNotification: (id) => {
        return post('/notification/mark-read', { id })
    },
    getNumberUnreadNotification: (merchantId) => {
        return get('/notification/count-unread', { merchantId })
    },
}