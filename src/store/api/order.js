import { get, post } from './common'
export default {
    createQR: (totalAmount, merchantId) => {
        return post('/order/create-qr-otc', { totalAmount, merchantId })
    },
    createOrder: (requestObj) => {
        return post('/order/create-order', requestObj)
    },
    updateOrderAddress: (requestObj) => {
        return post('/order/update-order-address', requestObj)
    },
    calculateOrderFee: (orderId) => {
        return post('/order/calculate-order-fee', { orderId })
    },
    updateOrderInvoice: (requestObj) => {
        return post('/order/update-order-invoice', requestObj)
    },
    getOrderList: (merchantId, status = 1, page = 1) => {
        return get('/order/get-order-merchant-list', { merchantId, status, page })
    },
    getOrderDetail: (orderId) => {
        return get('/order/get-order-detail', { orderId })
    },
    getOrderByTab: (merchantId, tab = 1, page = 1) => {
        return get('/order/get-order-merchant-tab', { merchantId, tab, page })
    },
    rejectOrder: (orderId, reason) => {
        return post('/order/reject-order', { orderId, reason })
    },
    approveOrder: (orderId) => {
        return post('/order/approve-order', { orderId })
    },
    deliveryOrder: (orderId) => {
        return post('/order/delivery-order', { orderId })
    },
    completeOrder: (orderId, paymentMethod) => {
        return post('/order/complete-order', { orderId, paymentMethod })
    },
    updatePaymentMethod: (orderId, paymentMethod) => {
        return post('/order/update-payment-method', { orderId, paymentMethod })
    },
    // http://171.244.49.184:9000/order/statistical?merchantId=011901131639310861&fromDate=1450560551&toDate=1650560551
    getOrderStatistic: (merchantId, fromDate, toDate) => {
        return get('/order/statistical', { merchantId, fromDate, toDate })
    },
    // http://171.244.49.184:9000/order/sum-total-paid?merchantId=011901131639310861&fromDate=1450560551&toDate=1650560551&paymentMethod=1
    getTotalPaidOrderByMethod: (merchantId, fromDate, toDate) => {
        return get('/order/sum-total-paid', { merchantId, fromDate, toDate })
    },

    addProductToOrder: (orderId) => {
        return post('/order/add-product-order', { orderId })
    },

    syncOrder: (orders) => {
        return post('/order/sync-order', { orders })
    },
    searchOrder: (requestObj) => {
        return get('/order/search-order', requestObj)
    },
    deleteOrder: (orderId) => {
        return post('/order/delete-order', { orderId })
    },
    getOrderWaitByFloor: (floorId) => {
        return get('/order/get-order-wait', { floorId })
    }

}