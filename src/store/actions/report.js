export const getTransactionReport = (...args) => ({
    type: 'report/getTransactionReport',
    args
})

export const getProductReport = (...args) => ({
    type: 'report/getProductReport',
    args
})

export const setProductReport = (data) => ({
    type: 'report/setProductReport',
    payload: data
})