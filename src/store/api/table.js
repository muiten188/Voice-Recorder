import { get, post } from './common'
export default {
    // Update
    createFloor: (floorId, floorName, numberOfTable, isChangeTable = true, ordinal = 1) => {
        return post('/table/create-floor', { floorId, floorName, numberOfTable, isChangeTable, ordinal })
    },
    getFloor: (merchantId) => {
        return get('/table/get-floor', { merchantId })
    },
    removeFloor: (id) => {
        return post('/table/remove-floor', { id })
    },
    createTable: (merchantId, floorId, tableId, tableName, ordinal = 1) => {
        return post('/table/create-table', { merchantId, floorId, tableId, tableName, ordinal })
    },
    getTable: (merchantId, floorId) => {
        return get('/table/get-table', { merchantId, floorId })
    },
    removeTable: (id) => {
        return post('/table/remove-table', { id })
    },

    // addProduct: (requestObj) => {
    //     return post('/table-order/add-product', requestObj)
    // },
    getProduct: (merchantId, tableId) => {
        return get('/table-order/get-product', { merchantId, tableId })
    },
    clean: (merchantId, tableId) => {
        return post('/table-order/clean', { merchantId, tableId })
    },
    change: (merchantId, srcTableId, dstTableId) => {
        return post('/order/change-table', { merchantId, srcTableId, dstTableId })
    },
    merge: (merchantId, srcTableId, dstTableId) => {
        return post('/order/merge-table', { merchantId, srcTableId, dstTableId })
    },
    updateNumberGuest: (tableId, numOfGuest) => {
        return post('/table/set-guest-table', { tableId, numOfGuest })
    },
    getFloorTable: (page = 0) => {
        return get('/v2/table/get-floor-table', { page })
    },

    getOrderByTable: (tableId) => {
        return get('/order/get-order-by-table', { tableId })
    },
    syncTable: (tables) => {
        return post('/table/sync-table', { tables })
    },
    updateOrdinalFloor: (items) => {
        return post('/table/update-ordinal-floor', { items })
    }

}