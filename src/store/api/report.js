import { get, post } from './common'
export default {
    getProductReport: (fromDate, toDate, page = 1, pageSize = 30) => {
        return get('/home/product-report', { fromDate, toDate, page, pageSize })
    },
    getTransactionReport: (fromDate, toDate) => {
        return get('/home/transaction-report', { fromDate, toDate })
    },
}