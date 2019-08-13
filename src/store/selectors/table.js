import { chainParse } from '~/src/utils'
import lodash from 'lodash'

const emptyArray = []
const emptyObj = {}

// export const floorSelector = state => chainParse(state, ['table', 'floor']) || emptyArray

// export const tableSelector = (state, merchantId, floorId) => {
//     const table = chainParse(state, ['table', 'table'])
//     if (!table || Object.keys(table).length == 0) return emptyArray
//     return table[`${merchantId}-${floorId}`]
// }

const filterTableProduct = lodash.memoize((product) => product.filter(item => +item.qty > 0))

export const productTableSelector = (state, tableId) => {
    const orderTable = chainParse(state, ['table', 'orderTable'])
    if (!orderTable || !orderTable[tableId] || !orderTable[tableId]['listOrderDetail']) return emptyArray
    return filterTableProduct(orderTable[tableId]['listOrderDetail'])
}

export const tablePayableSelector = (state, tableId) => {
    const orderTable = chainParse(state, ['table', 'orderTable'])
    if (!orderTable || !orderTable[tableId]) return false
    return !!orderTable[tableId].payable
}

export const orderTableSelector = (state, tableId) => {
    const orderTable = chainParse(state, ['table', 'orderTable'])
    if (!orderTable || !orderTable[tableId]) return false
    return orderTable[tableId].order
}

export const tableNoteSelector = (state, tableId) => {
    const orderTable = chainParse(state, ['table', 'orderTable'])
    if (!orderTable || !orderTable[tableId]) return ''
    return orderTable[tableId]['note']
}


export const tableDiscountSelector = (state, tableId) => {
    const orderTable = chainParse(state, ['table', 'orderTable'])
    if (!orderTable || !orderTable[tableId]) return ''
    return orderTable[tableId]['discountAmount'] ? orderTable[tableId]['discountAmount'] : 0
}

export const floorTableSelector = state => chainParse(state, ['table', 'floorTable']) || emptyArray

export const floorSelector = (state, floorId) => {
    const floorTable = chainParse(state, ['table', 'floorTable'])
    if (!floorTable || floorTable.length == 0) return emptyObj
    const floorIndex = floorTable.findIndex(item => chainParse(item, ['floor', 'id']) == floorId)
    if (floorIndex < 0) return emptyObj
    return floorTable[floorIndex]
}

export const floorTableSectionSelector = state => {
    const floorTable = chainParse(state, ['table', 'floorTable'])
    if (!floorTable || !floorTable[0]) return emptyArray
    return floorTable.map(item => ({
        ...item,
        data: item.listTable
    }))
}

export const floorFreeTableSelector = state => {
    const floorTable = chainParse(state, ['table', 'floorTable'])
    if (!floorTable || !floorTable[0]) return emptyArray
    return floorTable
        .map(item => {
            const originListTable = item.listTable
            const freeListTable = originListTable.filter(item => !item.busy)
            return {
                ...item,
                listTable: freeListTable,
                data: freeListTable
            }
        })
        .filter(item => item.data.length > 0)
}

export const floorBusyTableSelector = (state, currentTableId) => {
    const floorTable = chainParse(state, ['table', 'floorTable'])
    if (!floorTable || !floorTable[0]) return emptyArray
    return floorTable
        .map(item => {
            const busyListTable = []
            for (let i = 0; i < item.listTable.length; i++) {
                if (!!item.listTable[i].busy && item.listTable[i].id != currentTableId) {
                    busyListTable.push(item.listTable[i])
                }
            }
            return {
                ...item,
                listTable: busyListTable,
                data: busyListTable
            }
        })
        .filter(item => item.data.length > 0)
}