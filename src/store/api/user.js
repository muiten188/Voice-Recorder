import { get, post, put } from './common'
import { PAGE_SIZE } from '~/src/constants'
export default {
    getListUser: (page = 1, max_result = PAGE_SIZE, filter = 'all', order_by = 'first_name', order_direction = 1) => {
        return get('/api/v2/user', { page, max_result, filter, order_by, order_direction })
    },
    createUser: (userInfo) => {
        return post('/api/v2/user', userInfo)
    }
}