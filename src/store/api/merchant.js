import { get, post } from './common'
export default {
    getListMerchant: () => {
        return get('/merchant/get-list-merchant', {})
    },
    getDeliveryMethod: () => {
        return get('/merchant/get-delivery-method', {})
    },
    generateMerchantId: () => {
        return get('/merchant/generate-merchant-id', {})
    },
    createMerchant: (requestObj) => {
        return post('/merchant/create-merchant', requestObj)
    },
    getCategory: () => {
        return get('/merchant/get-category')
    },
    removeMerchant: (merchantId) => {
        return post('/merchant/delete-merchant', { merchantId })
    },

    // Staff
    addStaff: (name, phone, userName, permissionIdList) => {
        return post('/merchant/add-staff', { name, phone, userName, permissionIdList })
    },
    updateStaff: (name, phone, userName, permissionIdList) => {
        return post('/merchant/update-staff', { name, phone, userName, permissionIdList })
    },
    getStaffList: (merchantId) => {
        return get('/merchant/get-staff-list', { merchantId })
    },
    removeStaff: (userId) => {
        return post('/merchant/remove-staff', { userId })
    },

    // Merchant Menu
    getMerchantMenu: (merchantId) => {
        return get('/merchant/get-merchant-menu', { merchantId })
    },
    createMerchantMenu: (merchantId, menuId, menuName, ordinal = 1) => {
        return post('/merchant/create-merchant-menu', { merchantId, menuId, menuName, ordinal })
    },
    removeMerchantMenu: (menuId) => {
        return post('/merchant/remove-merchant-menu', { menuId })
    },
    getMerchantMenuProduct: () => {
        return get('/merchant/get-merchant-menu-product', {})
    },
    updateOrdinalProductMenu: (items) => {
        return post('/merchant/update-ordinal-product-menu', { items })
    },

    // Floor Table
    createFloorTable: (merchantId, floorName, numOfTable, ordinal = 1) => {
        return post('/merchant/create-floor-table', { merchantId, floorName, numOfTable, ordinal })
    },
    getFloorTable: (merchantId) => {
        return get('/merchant/get-floor-table', { merchantId })
    },
    removeFloorTable: (id) => {
        return post('/merchant/remove-floor-table', { id })
    },

}
