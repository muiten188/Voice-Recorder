export const createQR = (...args) => ({
    type: 'order/createQR',
    args
})

export const createOrder = (...args) => ({
    type: 'order/createOrder',
    args
})

export const updateOrderAddress = (...args) => ({
    type: 'order/updateOrderAddress',
    args
})

export const calculateOrderFee = (...args) => ({
    type: 'order/calculateOrderFee',
    args
})

export const updateOrderInvoice = (...args) => ({
    type: 'order/updateOrderInvoice',
    args
})

export const setOrderList = (data) => ({
    type: 'order/setOrderList',
    payload: data
})

export const replaceOrderList = (data) => ({
    type: 'order/replaceOrderList',
    payload: data
})

export const getOrderDetail = (...args) => ({
    type: 'order/getOrderDetail',
    args
})

export const updateOrderOfflineTab = (data) => ({
    type: 'order/updateOrderOfflineTab',
    payload: data
})

export const updateOrderOnlineTab = (data) => ({
    type: 'order/updateOrderOnlineTab',
    payload: data
})

export const rejectOrder = (...args) => ({
    type: 'order/rejectOrder',
    args
})

export const approveOrder = (...args) => ({
    type: 'order/approveOrder',
    args
})


export const deliveryOrder = (...args) => ({
    type: 'order/deliveryOrder',
    args
})


export const completeOrder = (...args) => ({
    type: 'order/completeOrder',
    args
})

export const updatePaymentMethod = (...args) => ({
    type: 'order/updatePaymentMethod',
    args
})

export const getOrderStatistic = (...args) => ({
    type: 'order/getOrderStatistic',
    args
})

export const getTotalPaidOrderByMethod = (...args) => ({
    type: 'order/getTotalPaidOrderByMethod',
    args
})

export const addProductToOrder = (...args) => ({
    type: 'order/addProductToOrder',
    args
})



export const getOrderByTab = (...args) => ({
    type: 'order/getOrderByTab',
    args
})

export const createOtherOrder = (data) => ({
    type: 'order/createOtherOrder',
    payload: data
})

export const createCompleteOrder = (data) => ({
    type: 'order/createCompleteOrder',
    payload: data
})

export const createDraftTableOrder = (data) => ({
    type: 'order/createDraftTableOrder',
    payload: data
})

export const createCompleteTableOrder = (data) => ({
    type: 'order/createCompleteTableOrder',
    payload: data
})

export const completeTableOrder = (data) => ({
    type: 'order/completeTableOrder',
    payload: data
})

export const syncOrder = (...args) => ({
    type: 'order/syncOrder',
    args
})

export const deleteOrder = (data) => ({
    type: 'order/deleteOrder',
    payload: data
})

export const searchOrder = (...args) => ({
    type: 'order/searchOrder',
    args
})

export const printOrder = (data) => ({
    type: 'order/printOrder',
    payload: data
})

// Order Cart

export const emptyOrderCart = () => ({
    type: 'order/emptyOrderCart'
})

export const changeNumberProductOrderCart = (data) => ({
    type: 'order/changeNumberProductOrderCart',
    payload: data // {id, number} = data
})


export const updateNumberProductOrderCart = (data) => ({
    type: 'order/updateNumberProductOrderCart',
    payload: data // {id, number} = data
})

export const deleteProductFromOrderCart = (id) => ({
    type: 'order/deleteProductFromOrderCart',
    payload: id
})

export const addProductToOrderCart = (product) => ({
    type: 'order/addProductToOrderCart',
    payload: product
})

export const setOrderCart = (orderCart) => ({
    type: 'order/setOrderCart',
    payload: orderCart
})

export const setOrderCartInfo = (orderInfo) => ({
    type: 'order/setOrderCartInfo',
    payload: orderInfo
})


export const setCartNote = (payload) => ({
    type: 'order/setCartNote',
    payload: payload
})

export const setOrderDiscount = (payload) => ({
    type: 'order/setOrderDiscount',
    payload: payload
})

export const updateOrderTable = (payload) => ({
    type: 'order/updateOrderTable',
    payload: payload
})

export const updateOrderInfo = (payload) => ({
    type: 'order/updateOrderInfo',
    payload: payload
})


export const updateOrderTab = (data) => ({
    type: 'order/updateOrderTab',
    payload: data
})

export const deleteOrderOnline = (...args) => ({
    type: 'order/deleteOrderOnline',
    args
})

export const updateWaitingOrderSearchParam = (data) => ({
    type: 'order/updateWaitingOrderSearchParam',
    payload: data
})

export const updateWaitingOrderSearchResult = (data) => ({
    type: 'order/updateWaitingOrderSearchResult',
    payload: data
})

export const updatePaidOrderSearchParam = (data) => ({
    type: 'order/updatePaidOrderSearchParam',
    payload: data
})

export const updatePaidOrderSearchResult = (data) => ({
    type: 'order/updatePaidOrderSearchResult',
    payload: data
})

export const createOrderOffline = (data, callback) => ({
    type: 'order/createOrderOffline',
    payload: {
        data, callback
    }
})

export const completeOrderOffline = (orderId, paymentMethod, callback) => ({
    type: 'order/completeOrderOffline',
    payload: {
        orderId,
        paymentMethod,
        callback
    }
})

export const getOrderWaitByFloor = (...args) => ({
    type: 'order/getOrderWaitByFloor',
    args
})