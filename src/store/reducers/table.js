const initialState = {
    floor: [],
    table: {},
    floorTable: [],
    productTable: {},
    orderTable: {}
}
export const table = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'table/setFloorTable': {
            return {
                ...state,
                floorTable: payload
            }
        }

        case 'table/setFloor': {
            return {
                ...state,
                floor: payload
            }
        }

        case 'table/setTable': {
            const tablePayload = payload
            if (!tablePayload || !tablePayload[0]) return state
            const merchantId = tablePayload[0].merchantId
            const floorId = tablePayload[0].floorId
            const table = { ...state.table }
            table[`${merchantId}-${floorId}`] = tablePayload
            return {
                ...state,
                table
            }
        }

        case 'table/setTableProduct': {
            const tableId = payload.tableId
            const productInfo = payload.productInfo
            const productTable = { ...state.productTable }
            if (!productTable[tableId]) {
                productTable[tableId] = {}
            }
            productTable[tableId]['product'] = productInfo
            return {
                ...state,
                productTable
            }
        }

        case 'table/updateNumberProductTable': {
            const { tableId, productId, qty } = payload
            const orderTable = { ...state.orderTable }
            if (!orderTable || !orderTable[tableId]) return state
            const tableProductList = [...orderTable[tableId]['listOrderDetail']]
            const productIndex = tableProductList.findIndex(item => item.productId == productId)
            if (productIndex < 0) return state
            tableProductList[productIndex] = {
                ...tableProductList[productIndex],
                qty: Math.max(+tableProductList[productIndex].qty + qty, 0)
            }
            orderTable[tableId]['listOrderDetail'] = tableProductList
            orderTable[tableId]['payable'] = false
            return {
                ...state,
                orderTable
            }
        }

        case 'table/setTableNote': {
            const { tableId, note } = payload
            const orderTable = { ...state.orderTable }
            orderTable[tableId]['note'] = note
            return {
                ...state,
                orderTable
            }
        }

        case 'table/setTableDiscount': {
            const { tableId, discountAmount } = payload
            const orderTable = { ...state.orderTable }
            orderTable[tableId]['discountAmount'] = discountAmount
            orderTable[tableId]['payable'] = false
            return {
                ...state,
                orderTable
            }
        }

        case 'table/addTableProduct': {
            console.log('Payload addTableProduct', payload)
            const { tableId, productId, qty } = payload
            console.log('tableId, productId, qty', tableId, productId, qty)
            const orderTable = { ...state.orderTable }
            if (!orderTable || !orderTable[tableId]) return state
            const tableProductList = orderTable[tableId]['listOrderDetail'] ? [...orderTable[tableId]['listOrderDetail']] : []
            console.log('Table Product List Before', tableProductList)
            const productIndex = tableProductList.findIndex(item => item.productId == productId)
            console.log('productIndex', productIndex)
            if (productIndex < 0) {
                tableProductList.push({
                    ...payload,
                    qty: qty
                })
            } else {
                tableProductList[productIndex] = {
                    ...tableProductList[productIndex],
                    qty: Math.max(+tableProductList[productIndex].qty + qty, 0)
                }
            }
            console.log('Table Product List After', tableProductList)

            orderTable[tableId]['listOrderDetail'] = tableProductList
            orderTable[tableId]['payable'] = false
            return {
                ...state,
                orderTable
            }
        }

        case 'table/setOrderTable': {
            const tableId = payload.tableId
            const orderInfo = payload.orderInfo
            console.log('orderInfo', orderInfo)

            const orderTable = { ...state.orderTable }
            if (!orderTable[tableId]) {
                orderTable[tableId] = {}
            }
            orderTable[tableId] = {
                ...orderTable[tableId],
                ...orderInfo,
                payable: !!(orderInfo && orderInfo.listOrderDetail && orderInfo.listOrderDetail.length > 0)
            }
            return {
                ...state,
                orderTable
            }
        }

        case 'table/cleanOrderTable': {
            const tableId = payload
            const orderTable = { ...state.orderTable }
            if (!orderTable[tableId]) return state
            delete orderTable[tableId]
            return {
                ...state,
                orderTable
            }
        }

        case 'table/setPayableTable': {
            const tableId = payload.tableId
            const payable = !!payload.payable
            const orderTable = { ...state.orderTable }
            if (!orderTable[tableId]) {
                orderTable[tableId] = {}
            }
            orderTable[tableId].payable = payable
            return {
                ...state,
                orderTable
            }
        }

        case 'table/cleanTable': {
            const tableId = payload
            const orderTable = { ...state.orderTable }
            if (!orderTable[tableId]) return state
            orderTable[tableId] = {}
            return {
                ...state,
                orderTable
            }
        }

        case 'table/updateNumberGuestTableOffline': {

        }

        case 'app/logout': {
            return initialState
        }
        default:
            return state
    }
}