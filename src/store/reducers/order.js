import { ORDER_TAB } from '~/src/constants'
import { chainParse } from '~/src/utils'

const initialState = {
    orderTab: ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY,
    orderInfo: {
        orderCart: [],
        note: '',
        discountAmount: '',
        surcharge: '',
        tableId: '',
        payMethod: '',
        creatorName: ''
    },
    waitingOrderList: {},
    waitingOrderSearchParam: {
        keyword: '',
        startTime: '',
        endTime: '',
    },
    waitingOrderSearchResult: {

    },
    paidOrderList: {},
    paidOrderSearchParam: {
        keyword: '',
        startTime: '',
        endTime: '',
    },
    paidOrderSearchResult: {

    }
}

export const order = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'order/setOrderList': {
            const { orderList, tab } = payload
            if (!tab || !orderList) return state
            const pageNumber = +chainParse(orderList, ['pagingInfo', 'pageNumber'])
            if (pageNumber <= 1) {
                if (tab == ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY) {
                    return {
                        ...state,
                        waitingOrderList: orderList
                    }
                } else {
                    return {
                        ...state,
                        paidOrderList: orderList
                    }
                }

            }
            const payloadContent = chainParse(orderList, ['content']) || []

            if (tab == ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY) {
                const stateContent = chainParse(state, ['waitingOrderList', 'content']) || []
                const statePageNumber = +chainParse(state, ['waitingOrderList', 'pagingInfo', 'pageNumber'])
                if (pageNumber <= statePageNumber) return state
                return {
                    ...state,
                    waitingOrderList: {
                        ...orderList,
                        content: [...stateContent, ...payloadContent]
                    }
                }
            } else {
                const stateContent = chainParse(state, ['paidOrderList', 'content']) || []
                const statePageNumber = +chainParse(state, ['paidOrderList', 'pagingInfo', 'pageNumber'])
                if (pageNumber <= statePageNumber) return state
                return {
                    ...state,
                    paidOrderList: {
                        ...orderList,
                        content: [...stateContent, ...payloadContent]
                    }
                }
            }

        }
        case 'order/replaceOrderList': {
            const { orderList, tab } = payload
            if (!tab || !orderList) return state
            if (tab == ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY) {
                return {
                    ...state,
                    waitingOrderList: orderList
                }
            }
            return {
                ...state,
                paidOrderList: orderList
            }
        }

        case 'order/updateOrderOnlineTab': {
            return {
                ...state,
                orderOnlineTab: payload
            }
        }

        case 'order/updateOrderOfflineTab': {
            return {
                ...state,
                orderOfflineTab: payload
            }
        }


        case 'order/emptyOrderCart': {
            return {
                ...state,
                orderInfo: {
                    orderCart: [],
                    note: '',
                    discountAmount: '',
                    tableId: '',
                    payMethod: ''
                },
            }
        }

        case 'order/deleteProductFromOrderCart': {
            const currentOrderCart = chainParse(state, ['orderInfo', 'orderCart']) || []
            const orderCart = [...currentOrderCart]
            const productId = payload
            const index = orderCart.findIndex(item => item.productId == productId)
            if (index < 0) state
            orderCart.splice(index, 1)
            return {
                ...state,
                orderInfo: {
                    ...state.orderInfo,
                    orderCart
                }

            }
        }

        case 'order/setOrderCart': {
            const newOrderCart = payload
            return {
                ...state,
                orderInfo: {
                    ...state.orderInfo,
                    orderCart: newOrderCart
                }
            }
        }
        case 'order/setOrderCartInfo': {
            const orderInfo = payload
            const cart = orderInfo && Array.isArray(orderInfo.listOrderDetail) ? orderInfo.listOrderDetail.map(item => ({
                ...item,
                qty: item.qty,
                id: item.productId || item.id
            })) : []
            const note = chainParse(orderInfo, ['order', 'note'])
            const discountAmount = chainParse(orderInfo, ['order', 'discountAmount'])
            return {
                ...state,
                orderCart: cart,
                cartNote: note,
                discountAmount
            }
        }
        case 'order/setCartNote': {
            return {
                ...state,
                cartNote: payload
            }
        }
        case 'order/setOrderDiscount': {
            return {
                ...state,
                discountAmount: payload
            }
        }


        case 'order/changeNumberProductOrderCart': {
            const currentOrderCart = chainParse(state, ['orderInfo', 'orderCart']) || []
            const orderCart = [...currentOrderCart]
            const { productId, number } = payload
            const index = orderCart.findIndex(item => item.productId == productId)
            if (index < 0) return state
            // Delete from cart if number = 0
            if (number == 0) {
                orderCart.splice(index, 1)
                return {
                    ...state,
                    orderInfo: {
                        ...state.orderInfo,
                        orderCart
                    }
                }
            }
            orderCart[index] = {
                ...orderCart[index],
                qty: Math.max(orderCart[index].qty + number, 0)
            }
            return {
                ...state,
                orderInfo: {
                    ...state.orderInfo,
                    orderCart
                }
            }
        }

        case 'order/updateNumberProductOrderCart': {
            const currentOrderCart = chainParse(state, ['orderInfo', 'orderCart']) || []
            const orderCart = [...currentOrderCart]
            const { productId, number } = payload
            const index = orderCart.findIndex(item => item.productId == productId)
            if (index < 0) return state
            // Delete from cart if number = 0
            if (number == 0) {
                orderCart.splice(index, 1)
                return {
                    ...state,
                    orderInfo: {
                        ...state.orderInfo,
                        orderCart
                    }
                }
            }
            orderCart[index] = {
                ...orderCart[index],
                qty: Math.max(+number, 0)
            }
            return {
                ...state,
                orderInfo: {
                    ...state.orderInfo,
                    orderCart
                }
            }
        }

        case 'order/addProductToOrderCart': {
            const currentOrderCart = chainParse(state, ['orderInfo', 'orderCart']) || []
            const orderCart = [...currentOrderCart]
            const product = payload
            console.log('Product', product)
            console.log('Order Cart', orderCart)
            const index = orderCart.findIndex(item => item.productId == product.productId)

            const selectProduct = {
                ...product,
                qty: 1
            }
            if (index > -1) {
                orderCart[index] = {
                    ...orderCart[index],
                    qty: +orderCart[index].qty + 1
                }
                return {
                    ...state,
                    orderInfo: {
                        ...state.orderInfo,
                        orderCart
                    }
                }
            }
            return {
                ...state,
                orderInfo: {
                    ...state.orderInfo,
                    orderCart: [...orderCart, selectProduct]
                }

            }
        }

        case 'order/updateOrderTable': {
            return {
                ...state,
                orderInfo: {
                    ...state.orderInfo,
                    tableId: payload || ''
                }
            }
        }

        case 'order/updateOrderInfo': {
            return {
                ...state,
                orderInfo: {
                    ...state.orderInfo,
                    ...payload
                }
            }
        }

        case 'order/updateOrderTab': {
            return {
                ...state,
                orderTab: payload
            }
        }

        case 'order/updateWaitingOrderSearchParam': {
            return {
                ...state,
                waitingOrderSearchParam: {
                    ...state.waitingOrderSearchParam,
                    ...payload
                }
            }
        }

        case 'order/updateWaitingOrderSearchResult': {
            console.log('updateWaitingOrderSearchResult', payload)
            const pageNumber = +chainParse(payload, ['pagingInfo', 'pageNumber'])
            if (pageNumber <= 1) {
                return {
                    ...state,
                    waitingOrderSearchResult: payload
                }
            }
            const stateContent = chainParse(state, ['waitingOrderSearchResult', 'content']) || []
            const payloadContent = chainParse(payload, ['content']) || []
            return {
                ...state,
                waitingOrderSearchResult: {
                    ...payload,
                    content: [...stateContent, ...payloadContent]
                }
            }

        }

        case 'order/updatePaidOrderSearchParam': {
            return {
                ...state,
                paidOrderSearchParam: {
                    ...state.paidOrderSearchParam,
                    ...payload
                }
            }
        }

        case 'order/updatePaidOrderSearchResult': {
            const pageNumber = +chainParse(payload, ['pagingInfo', 'pageNumber'])
            if (pageNumber <= 1) {
                return {
                    ...state,
                    paidOrderSearchResult: payload
                }
            }
            const stateContent = chainParse(state, ['paidOrderSearchResult', 'content']) || []
            const payloadContent = chainParse(payload, ['content']) || []
            return {
                ...state,
                paidOrderSearchResult: {
                    ...payload,
                    content: [...stateContent, ...payloadContent]
                }
            }
        }

        case 'app/logout': {
            return initialState
        }
        default:
            return state
    }
}