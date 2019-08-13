import { get, post } from './common'
export default {
    getPermissionDef: () => {
        return get('/permission/get-permission-def')
    },

    addPermission: (userId, permissionId) => {
        return post('/permission/add-permission-user', { userId, permissionId })
    },

    getPermission: (merchantId, userId) => {
        return get('/permission/get-permission-user', { merchantId, userId })
    },

    removePermission: (id) => {
        return post('/permission/remove-permission-user', { id })
    }
}