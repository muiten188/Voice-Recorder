import DBManager from '~/src/db/DBManager'
import { getIntSQL, getStringSQL, executeSql } from '~/src/utils'
import { PAGE_SIZE, ORDER_TAB_STATUS_MAPPING, ORDER_STATUS } from '~/src/constants'
import shortid from 'shortid'
import moment from 'moment'
import lodash from 'lodash'
import uuidv1 from 'uuid/v1'

export const saveListOrder = async (orderList, { tab, page, totalPage, totalElement, pageSize }) => {
    // console.log('Save List Order', { orderList, tab, page, totalPage, totalElement, pageSize })
    if (!orderList || !Array.isArray(orderList)) return ''
    if (Array.isArray(orderList) && orderList.length == 0) {
        const deleteOrderQuery = `DELETE FROM s_order WHERE status IN (${ORDER_TAB_STATUS_MAPPING[tab].join(',')});`
        const orderSyncQuery = 'INSERT OR REPLACE INTO s_order_sync(TAB_ID, PAGE, TOTAL_PAGE, TOTAL_ELEMENT, PAGE_SIZE, LAST_SYNC) VALUES (? , ?, ?, ?, ?, ?)'
        const deleteOrderResult = await executeSql(deleteOrderQuery, [])
        const orderSyncResult = await executeSql(orderSyncQuery, [tab, page, totalPage, totalElement, pageSize, moment().unix()])
        return [deleteOrderResult, orderSyncResult]
    }
    let orderArray = orderList.map(item => ({
        ...item.order,
        creatorName: item.creatorName || ''
    }))

    // console.log('orderArray', orderArray)

    const clientOrderIdArr = orderArray.map(item => item.clientOrderId).filter(item => !!item) || []
    const orderIdArr = orderArray.map(item => item.id).filter(item => !!item) || []
    const cleanOrderDetailIdArr = [...clientOrderIdArr, ...orderIdArr]
    const orderDetailArray = orderList.map(item => item.listOrderDetail).reduce((a, b) => [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])], [])
    const orderQuery = `INSERT OR REPLACE INTO s_order(
        ID, ORDER_CODE, STATUS, TYPE, NOTE, TABLE_ID, TABLE_DISPLAY_NAME, PAID_AMOUNT, TOTAL_AMOUNT, DISCOUNT_AMOUNT, 
        CREATED_AT, LAST_MODIFIED_AT, CREATED_BY, LAST_MODIFIED_BY, REF_PAYMENT_CODE, VOUCHER_CODE,
        BUYER_COMPANY_NAME, BUYER_TAX_CODE, BUYER_COMPANY_ADDRESS, 
        RECEIVER_NAME, RECEIVER_PHONE, RECEIVER_PROVINCE, RECEIVER_DISTRICT, RECEIVER_WARD, RECEIVER_ADDRESS, RECEIVER_NOTE,
        SHIPPING_FEE, CREATOR_NAME, PAYMENT_METHOD, SURCHARGE, CLIENT_ORDER_ID, IS_SYNC
        ) VALUES 
        ${orderArray.map(item => (
        `(${getStringSQL(item.id)},` +
        `${getStringSQL(item.orderCode)},` +
        `${getIntSQL(item.status)},` +
        `${getIntSQL(item.type)},` +
        `${getStringSQL(item.note)},` +
        `${getStringSQL(item.tableId)},` +
        `${getStringSQL(item.tableDisplayName)},` +
        `${getIntSQL(item.paidAmount)},` +
        `${getIntSQL(item.totalAmount)},` +
        `${getIntSQL(item.discountAmount)},` +
        `${getIntSQL(item.createdAt)},` +
        `${getIntSQL(item.lastModifiedAt)},` +
        `${getStringSQL(item.createdBy)},` +
        `${getStringSQL(item.lastModifiedBy)},` +
        `${getStringSQL(item.refPaymentCode)},` +
        `${getStringSQL(item.voucherCode)},` +
        `${getStringSQL(item.buyerCompanyName)},` +
        `${getStringSQL(item.buyerTaxCode)},` +
        `${getStringSQL(item.buyerCompanyAddress)},` +
        `${getStringSQL(item.receiverName)},` +
        `${getStringSQL(item.receiverPhone)},` +
        `${getStringSQL(item.receiverProvince)},` +
        `${getStringSQL(item.receiverDistrict)},` +
        `${getStringSQL(item.receiverWard)},` +
        `${getStringSQL(item.receiverAddress)},` +
        `${getStringSQL(item.receiverNote)},` +
        `${getIntSQL(item.shippingFee)},` +
        `${getStringSQL(item.creatorName)},` +
        `${getIntSQL(item.paymentMethod)},` +
        `${getIntSQL(item.surcharge)},` +
        `${getStringSQL(item.clientOrderId)}, 1)`
    )).join(',')};`
    // console.log('Save Order query', orderQuery)

    const orderaDetailQuery = `INSERT OR REPLACE INTO s_order_detail(
        ID, ORDER_ID, PRODUCT_ID, PRICE, QTY
        ) VALUES 
        ${orderDetailArray.map(item => (
        `(${getStringSQL(item.id)},` +
        `${getStringSQL(item.orderId)},` +
        `${getStringSQL(item.productId)},` +
        `${getIntSQL(item.price)},` +
        `${getIntSQL(item.qty)})`
    )).join(',')};`
    // console.log('Order Detail Arr', orderDetailArray)
    // console.log('orderaDetailQuery', orderaDetailQuery)

    const orderSyncQuery = 'INSERT OR REPLACE INTO s_order_sync(TAB_ID, PAGE, TOTAL_PAGE, TOTAL_ELEMENT, PAGE_SIZE, LAST_SYNC) VALUES (? , ?, ?, ?, ?, ?)'
    if (page == 1) {
        const deleteOrderQuery = `DELETE FROM s_order WHERE status IN (${ORDER_TAB_STATUS_MAPPING[tab].join(',')});`
        // console.log('deleteOrderQuery', deleteOrderQuery)
        const deleteOrderResult = await executeSql(deleteOrderQuery, [])
        // console.log('deleteOrderResult', deleteOrderResult)
    }
    let deleteOrderOfflineResult, deleteOrderDetailOfflineResult
    if (cleanOrderDetailIdArr && cleanOrderDetailIdArr.length > 0) {
        const idJoinStr = cleanOrderDetailIdArr.map(item => getStringSQL(item)).join(',')
        const deleteOrderOfflineQuery = `DELETE FROM s_order WHERE ID IN (${idJoinStr})`
        const deleteOrderDetailOfflineQuery = `DELETE FROM s_order_detail WHERE ORDER_ID IN (${idJoinStr})`
        deleteOrderOfflineResult = await executeSql(deleteOrderOfflineQuery, [])
        deleteOrderDetailOfflineResult = await executeSql(deleteOrderDetailOfflineQuery, [])
    }

    const orderResult = await executeSql(orderQuery, [])
    let orderaDetailResult = ''
    if (orderDetailArray && orderDetailArray.length > 0) {
        orderaDetailResult = await executeSql(orderaDetailQuery, [])
    }
    const orderSyncResult = await executeSql(orderSyncQuery, [tab, page, totalPage, totalElement, pageSize, moment().unix()])
    return [deleteOrderOfflineResult, deleteOrderDetailOfflineResult, orderResult, orderaDetailResult, orderSyncResult]
}


export const saveOrder = async (order) => {
    if (!order || !order.order || !order.listOrderDetail || order.listOrderDetail.length == 0) return Promise.resolve('empty')
    const orderItem = order.order
    const clientOrderId = orderItem.clientOrderId
    const orderDetailArray = order.listOrderDetail
    const orderQuery = `INSERT OR REPLACE INTO s_order(
        ID, ORDER_CODE, STATUS, TYPE, NOTE, TABLE_ID, TABLE_DISPLAY_NAME, PAID_AMOUNT, TOTAL_AMOUNT, DISCOUNT_AMOUNT, 
        CREATED_AT, LAST_MODIFIED_AT, CREATED_BY, LAST_MODIFIED_BY, REF_PAYMENT_CODE, VOUCHER_CODE,
        BUYER_COMPANY_NAME, BUYER_TAX_CODE, BUYER_COMPANY_ADDRESS, 
        RECEIVER_NAME, RECEIVER_PHONE, RECEIVER_PROVINCE, RECEIVER_DISTRICT, RECEIVER_WARD, RECEIVER_ADDRESS, RECEIVER_NOTE,
        SHIPPING_FEE, CLIENT_ORDER_ID, SURCHARGE, CREATOR_NAME, IS_SYNC
        ) VALUES 
        (
            ${getStringSQL(orderItem.id)},
            ${getStringSQL(orderItem.orderCode)},
            ${getIntSQL(orderItem.status)},
            ${getIntSQL(orderItem.type)},
            ${getStringSQL(orderItem.note)},
            ${getStringSQL(orderItem.tableId)},
            ${getStringSQL(orderItem.tableDisplayName)},
            ${getIntSQL(orderItem.paidAmount)},
            ${getIntSQL(orderItem.totalAmount)},
            ${getIntSQL(orderItem.discountAmount)},
            ${getIntSQL(orderItem.createdAt)},
            ${getIntSQL(orderItem.lastModifiedAt)},
            ${getStringSQL(orderItem.createdBy)},
            ${getStringSQL(orderItem.lastModifiedBy)},
            ${getStringSQL(orderItem.refPaymentCode)},
            ${getStringSQL(orderItem.voucherCode)},
            ${getStringSQL(orderItem.buyerCompanyName)},
            ${getStringSQL(orderItem.buyerTaxCode)},
            ${getStringSQL(orderItem.buyerCompanyAddress)},
            ${getStringSQL(orderItem.receiverName)},
            ${getStringSQL(orderItem.receiverPhone)},
            ${getStringSQL(orderItem.receiverProvince)},
            ${getStringSQL(orderItem.receiverDistrict)},
            ${getStringSQL(orderItem.receiverWard)},
            ${getStringSQL(orderItem.receiverAddress)},
            ${getStringSQL(orderItem.receiverNote)},
            ${getIntSQL(orderItem.shippingFee)},
            ${getStringSQL(clientOrderId)},
            ${getIntSQL(orderItem.surcharge)},
            ${getStringSQL(item.creatorName)}, 
            1);
        `
    // console.log('Single order query', orderQuery)
    const orderaDetailQuery = `INSERT OR REPLACE INTO s_order_detail(
        ID, ORDER_ID, PRODUCT_ID, PRICE, QTY
        ) VALUES 
        ${orderDetailArray.map(item => (
        `(${getStringSQL(item.id)},` +
        `${getStringSQL(item.orderId)},` +
        `${getStringSQL(item.productId)},` +
        `${getIntSQL(item.price)},` +
        `${getIntSQL(item.qty)})`
    )).join(',')};`
    // console.log('orderaDetailQuery', orderaDetailQuery)

    let deleteOrderOfflineResult, deleteOrderDetailOfflineResult
    // console.log('clientOrderId', clientOrderId)
    if (clientOrderId) {
        const deleteOrderOfflineQuery = `DELETE FROM s_order WHERE CLIENT_ORDER_ID=? `
        const deleteOrderDetailOfflineQuery = `DELETE FROM s_order_detail WHERE ORDER_ID=? OR ORDER_ID=?`
        deleteOrderOfflineResult = await executeSql(deleteOrderOfflineQuery, [clientOrderId])
        deleteOrderDetailOfflineResult = await executeSql(deleteOrderDetailOfflineQuery, [orderItem.id, clientOrderId])
    }
    const orderResult = await executeSql(orderQuery, [])
    const orderaDetailResult = await executeSql(orderaDetailQuery, [])
    return [deleteOrderOfflineResult, deleteOrderDetailOfflineResult, orderResult, orderaDetailResult]
}

export const clearOrder = () => {
    const deleteOrderQuery = 'DELETE FROM s_order;'
    const deleteOrderDetailQuery = 'DELETE FROM s_order_detail;'
    const deleteOrderSync = 'DELETE FROM s_order_sync;'
    return new Promise((resolve, reject) => {
        DBManager.getInstance()
            .then(db => {
                db.transaction(tx => {
                    db.executeSql(deleteOrderQuery, [], (deleteOrderResult) => {
                        db.executeSql(deleteOrderDetailQuery, [], deleteOrderDetailResult => {
                            db.executeSql(deleteOrderSync, [], deleteOrderSyncResult => {
                                resolve([deleteOrderResult, deleteOrderDetailResult, deleteOrderSyncResult])
                            }, deleteOrderSyncErr => {
                                reject(deleteOrderSyncErr)
                            })
                        }, deleteOrderDetailErr => {
                            reject(deleteOrderDetailErr)
                        })
                    }, (deleteOrderErr) => {
                        reject(deleteOrderErr)
                    })
                })

            })
            .catch(err => {
                reject(err)
            })
    })
}

const getOrders = (tab, currentPage, offset, limit, pageSize = PAGE_SIZE) => {
    // console.log('getOrders', { tab, currentPage, offset, limit, pageSize })
    // console.log('${ORDER_TAB_STATUS_MAPPING[tab]', ORDER_TAB_STATUS_MAPPING[tab])

    const orderSyncQuery = 'SELECT TAB_ID as tab, PAGE as page, TOTAL_PAGE as totalPage, TOTAL_ELEMENT as totalElement, PAGE_SIZE as pageSize, LAST_SYNC as lastSync FROM s_order_sync WHERE TAB_ID = ?;'
    const orderNumQuery = `SELECT COUNT(*) as totalElement FROM s_order WHERE status IN (${ORDER_TAB_STATUS_MAPPING[tab].join(',')});`
    const orderQuery = `SELECT ID as id, ORDER_CODE as orderCode, STATUS as status, 
        TYPE as type, NOTE as note, TABLE_ID as tableId, TABLE_DISPLAY_NAME as tableDisplayName, 
        PAID_AMOUNT as paidAmount, TOTAL_AMOUNT as totalAmount, DISCOUNT_AMOUNT as discountAmount, 
        CREATED_AT as createdAt, LAST_MODIFIED_AT as lastModifiedAt, CREATED_BY as createBy, 
        LAST_MODIFIED_BY as lastModifiedBy, REF_PAYMENT_CODE as refPaymentCode, VOUCHER_CODE as voucherCode,
        BUYER_COMPANY_NAME as buyerCompanyName, BUYER_TAX_CODE as buyerTaxCode, BUYER_COMPANY_ADDRESS as buyerCompanyAddress, 
        RECEIVER_NAME as receiverName, RECEIVER_PHONE as receiverPhone, RECEIVER_PROVINCE as receiverProvince, 
        RECEIVER_DISTRICT as receiverDistrict, RECEIVER_WARD as receiverWard, RECEIVER_ADDRESS as receiverAddress, RECEIVER_NOTE as receiverNote,
        SHIPPING_FEE as shippingFee, PAYMENT_METHOD as paymentMethod,
        CLIENT_ORDER_ID as clientOrderId, SURCHARGE as surcharge, CREATOR_NAME as creatorName, IS_SYNC as isSync
        FROM s_order 
        WHERE status IN (${ORDER_TAB_STATUS_MAPPING[tab].join(',')}) AND IS_DELETED IS NULL
        ORDER BY createdAt DESC
        LIMIT ${offset},${limit};`
    // console.log('orderQuery', orderQuery)
    return new Promise((resolve, reject) => {
        DBManager.getInstance()
            .then(db => {
                db.transaction(tx => {
                    db.executeSql(orderSyncQuery, [tab], (orderSyncResult) => {
                        const orderSync = orderSyncResult.rows.raw()
                        const orderSyncRow = orderSync[0]
                        // console.log('orderSyncRow', orderSyncRow)
                        const totalPageNetwork = orderSyncRow ? orderSyncRow.totalPage : 0
                        const totalElementNetwork = orderSyncRow ? orderSyncRow.totalElement : 0
                        // console.log('Page Network', totalPageNetwork, totalElementNetwork)
                        db.executeSql(orderNumQuery, [], (orderNumResult) => {
                            const orderNum = orderNumResult.rows.raw()
                            // console.log('orderNum', orderNum)
                            const totalElementDB = orderNum[0].totalElement
                            const totalPageDB = Math.ceil(totalElementDB / pageSize)
                            // console.log('Page DB', totalPageDB, totalElementDB)
                            // console.log('totalRecord', totalRecord)
                            db.executeSql(orderQuery, [], (orderResult) => {
                                const orderList = orderResult.rows.raw()
                                // console.log('Order List', orderList)
                                const orderIdList = orderList.map(item => getStringSQL(item.id))
                                const orderDetailQuery = `SELECT od.ID as id, od.ORDER_ID as orderId,
                                    od.PRODUCT_ID as productId,
                                    od.PRICE as price, od.PRODUCT_VARIANT_ID as productVariantId, od.QTY as qty,
                                    p.NAME as productName, p.AVATAR as productAvatar
                                    FROM s_order_detail od
                                    INNER JOIN s_product p
                                    ON od.PRODUCT_ID = p.ID
                                    WHERE ORDER_ID IN (${orderIdList.join(',')});`

                                // console.log('orderDetailQuery', orderDetailQuery)
                                const orderListResult = []
                                db.executeSql(orderDetailQuery, [], (orderDetailResult) => {
                                    const orderDetailList = orderDetailResult.rows.raw()
                                    // console.log('orderDetailList', orderDetailList)
                                    for (let i = 0; i < orderList.length; i++) {
                                        const listOrderDetailTmp = []
                                        for (let j = 0; j < orderDetailList.length; j++) {
                                            if (orderDetailList[j].orderId == orderList[i].id) {
                                                listOrderDetailTmp.push(orderDetailList[j])
                                            }
                                        }
                                        orderListResult.push({
                                            creatorName: orderList[i].creatorName || '',
                                            order: orderList[i],
                                            listOrderDetail: listOrderDetailTmp
                                        })
                                    }
                                    resolve({
                                        content: orderListResult,
                                        totalElements: Math.max(totalElementDB, totalElementNetwork),
                                        totalPages: Math.max(totalPageDB, totalPageNetwork),
                                        pagingInfo: { pageSize, sort: "ACS", pageNumber: currentPage }
                                    })
                                }, (errOrderDetail) => {
                                    reject(errOrderDetail)
                                })
                            }, (err) => {
                                reject(err)
                            })
                        }, (errOrderNum) => {
                            reject(errOrderNum)
                        })
                    }, (errOrderSync) => {
                        reject(errOrderSync)
                    })
                })
            })
            .catch(err => {
                reject(err)
            })
    })
}

export const getListOrder = (tab, page = 1, pageSize = PAGE_SIZE) => {
    console.log('getListOrder params', tab, page, pageSize)
    const offset = (page - 1) * pageSize
    const limit = pageSize
    const currentPage = page
    return getOrders(tab, currentPage, offset, limit, pageSize)
}


export const getListOrderToPage = (tab, toPage = 1, pageSize = PAGE_SIZE) => {
    // console.log('getListOrderToPage params', tab, toPage, pageSize)
    const offset = 0
    const limit = toPage * pageSize
    const currentPage = toPage
    return getOrders(tab, currentPage, offset, limit, pageSize)
}

export const getOrderSync = () => {
    const sqlQuery = 'SELECT TAB_ID as tab, PAGE as page, TOTAL_PAGE as totalPage, TOTAL_ELEMENT as totalElement, PAGE_SIZE as pageSize, LAST_SYNC as lastSync FROM s_order_sync'
    return new Promise((resolve, reject) => {
        DBManager.getInstance()
            .then(db => {
                db.executeSql(sqlQuery, [], (result) => {
                    resolve(result.rows.raw())
                })
            })
            .catch(err => {
                reject(err)
            })

    })
}


const getOrderByClientId = async (clientOrderId) => {
    const orderQuery = `SELECT ID as id, ORDER_CODE as orderCode, STATUS as status, 
        TYPE as type, NOTE as note, TABLE_ID as tableId, TABLE_DISPLAY_NAME as tableDisplayName, 
        PAID_AMOUNT as paidAmount, TOTAL_AMOUNT as totalAmount, DISCOUNT_AMOUNT as discountAmount, 
        CREATED_AT as createdAt, LAST_MODIFIED_AT as lastModifiedAt, CREATED_BY as createBy, 
        LAST_MODIFIED_BY as lastModifiedBy, REF_PAYMENT_CODE as refPaymentCode, VOUCHER_CODE as voucherCode,
        BUYER_COMPANY_NAME as buyerCompanyName, BUYER_TAX_CODE as buyerTaxCode, BUYER_COMPANY_ADDRESS as buyerCompanyAddress, 
        RECEIVER_NAME as receiverName, RECEIVER_PHONE as receiverPhone, RECEIVER_PROVINCE as receiverProvince, 
        RECEIVER_DISTRICT as receiverDistrict, RECEIVER_WARD as receiverWard, RECEIVER_ADDRESS as receiverAddress, RECEIVER_NOTE as receiverNote,
        SHIPPING_FEE as shippingFee, CLIENT_ORDER_ID as clientOrderId, IS_SYNC as isSync
        FROM s_order 
        WHERE CLIENT_ORDER_ID = ?`
    const orderResult = await executeSql(orderQuery, [clientOrderId])
    console.log('orderResult', orderResult.rows.raw())
    const orderList = orderResult.rows.raw()
    if (!orderList || orderList.length == 0) return {}
    const orderIdList = orderList.map(item => getStringSQL(item.id))
    const orderDetailQuery = `SELECT od.ID as id, od.ORDER_ID as orderId,
        od.PRODUCT_ID as productId,
        od.PRICE as price, od.PRODUCT_VARIANT_ID as productVariantId, od.QTY as qty,
        p.NAME as productName, p.AVATAR as productAvatar
        FROM s_order_detail od
        INNER JOIN s_product p
        ON od.PRODUCT_ID = p.ID
        WHERE ORDER_ID IN (${orderIdList.join(',')});`


    const orderListResult = []
    const orderDetailResult = await executeSql(orderDetailQuery, [])
    const orderDetailList = orderDetailResult.rows.raw()
    for (let i = 0; i < orderList.length; i++) {
        const listOrderDetailTmp = []
        for (let j = 0; j < orderDetailList.length; j++) {
            if (orderDetailList[j].orderId == orderList[i].id) {
                listOrderDetailTmp.push(orderDetailList[j])
            }
        }
        orderListResult.push({
            order: orderList[i],
            listOrderDetail: listOrderDetailTmp
        })
    }
    console.log('Order List result', orderListResult)
    if (!orderListResult || orderListResult.length == 0) return {}
    return orderListResult[0]

}


export const createOrder = async (orderObj) => {
    console.log('orderObj', orderObj)
    const status = ORDER_STATUS.CREATED
    const paymentMethod = orderObj.paymentMethod || 0
    const type = orderObj.type
    const note = orderObj.note
    const now = moment().unix()
    console.log('Now', now)
    const createAt = now
    const lastModifiedAt = now
    const totalAmount = orderObj.totalAmount
    const paidAmount = orderObj.paidAmount
    const discountAmount = orderObj.discountAmount
    const surcharge = orderObj.surcharge || 0
    const creatorName = orderObj.creatorName || ''
    const generateOrderId = uuidv1().replace(/-/g, '')
    const tableId = orderObj.tableId
    const tableDisplayName = orderObj.tableDisplayName
    const generateOrderCode = shortid.generate()
    const orderId = orderObj.orderId || generateOrderId
    const orderCode = orderObj.orderCode || ''
    const clientOrderId = orderObj.clientOrderId || generateOrderId
    const items = orderObj.items

    console.log('orderId, orderCode', orderId, orderCode)
    const orderQuery = `INSERT OR REPLACE INTO 
        s_order(ID, ORDER_CODE, CLIENT_ORDER_ID, IS_SYNC, PAYMENT_METHOD, TYPE, TOTAL_AMOUNT, DISCOUNT_AMOUNT, PAID_AMOUNT, TABLE_ID, TABLE_DISPLAY_NAME, NOTE, STATUS, CREATED_AT, LAST_MODIFIED_AT, CREATOR_NAME, SURCHARGE) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    const orderDetailQuery = `INSERT OR REPLACE INTO s_order_detail(ID, ORDER_ID, PRODUCT_ID, PRICE, QTY) VALUES (?, ?, ?, ?, ?);`
    const deleteOrderDetailQuery = `DELETE FROM s_order_detail WHERE ORDER_ID = ?;`

    const orderResult = await executeSql(orderQuery, [orderId, orderCode, clientOrderId, 0, paymentMethod, type, totalAmount, discountAmount, paidAmount, tableId, tableDisplayName, note, status, createAt, lastModifiedAt, creatorName, surcharge])
    const deleteOrderResult = await executeSql(deleteOrderDetailQuery, [orderId])
    for (let i = 0; i < items.length; i++) {
        const orderDetailUid = items[i].id || shortid.generate()
        await executeSql(orderDetailQuery, [orderDetailUid, orderId, items[i].productId, items[i].price, items[i].qty])
    }

    const orderDetail = await getOrderByClientId(clientOrderId)
    return orderDetail
}

export const completeOrder = async (orderId, paymentMethod) => {
    console.log('completeOrder', orderId, paymentMethod)
    const orderQuery = 'SELECT * FROM s_order WHERE ID=? or CLIENT_ORDER_ID=?'
    const orderResult = await executeSql(orderQuery, [orderId, orderId])
    console.log('orderResult', orderResult.rows.raw())
    const orderUpdateQuery = 'UPDATE s_order SET PAYMENT_METHOD=?, `STATUS`=? WHERE ID=? or CLIENT_ORDER_ID=?'
    console.log('Log log', paymentMethod, orderId)
    const result = await executeSql(orderUpdateQuery, [paymentMethod, ORDER_STATUS.COMPLETED, orderId, orderId])
    console.log('result', result.rows.raw())
}


export const createOtherOrder = (orderObj) => {
    console.log('orderObj', orderObj)
    const status = ORDER_STATUS.CREATED
    const paymentMethod = orderObj.paymentMethod || 0
    const type = orderObj.type
    const note = orderObj.note
    const now = moment().unix()
    console.log('Now', now)
    const createAt = now
    const lastModifiedAt = now
    const totalAmount = orderObj.totalAmount
    const paidAmount = orderObj.paidAmount
    const discountAmount = orderObj.discountAmount
    const generateOrderId = uuidv1().replace(/-/g, '')
    const generateOrderCode = shortid.generate()
    const orderId = orderObj.orderId || generateOrderId
    const orderCode = orderObj.orderCode || ''
    const clientOrderId = orderObj.clientOrderId || generateOrderId
    const items = orderObj.items

    console.log('orderId, orderCode', orderId, orderCode)
    const orderQuery = `INSERT OR REPLACE INTO 
        s_order(ID, ORDER_CODE, CLIENT_ORDER_ID, IS_SYNC, PAYMENT_METHOD, TYPE, TOTAL_AMOUNT, DISCOUNT_AMOUNT, PAID_AMOUNT, NOTE, STATUS, CREATED_AT, LAST_MODIFIED_AT) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    const orderDetailQuery = `INSERT OR REPLACE INTO s_order_detail(ID, ORDER_ID, PRODUCT_ID, PRICE, QTY) VALUES (?, ?, ?, ?, ?);`
    const deleteOrderDetailQuery = `DELETE FROM s_order_detail WHERE ORDER_ID = ?;`
    // console.log('Prepare Order insert', [orderId, orderCode, clientOrderId, 0, paymentMethod, type, totalAmount, discountAmount, paidAmount, note, status, createAt, lastModifiedAt])
    return new Promise((resolve, reject) => {
        DBManager.getInstance()
            .then(db => {
                db.transaction(tx => {
                    tx.executeSql(orderQuery, [orderId, orderCode, clientOrderId, 0, paymentMethod, type, totalAmount, discountAmount, paidAmount, note, status, createAt, lastModifiedAt])
                    tx.executeSql(deleteOrderDetailQuery, [orderId])
                    for (let i = 0; i < items.length; i++) {
                        const orderDetailUid = items[i].id || shortid.generate()
                        // console.log('Prepare order detail', [orderDetailUid, orderId, items[i].productId, items[i].price, items[i].qty])
                        tx.executeSql(orderDetailQuery, [orderDetailUid, orderId, items[i].productId, items[i].price, items[i].qty])
                    }
                }, (err) => {
                    reject(err)
                }, () => {
                    console.log('Transaction OK')
                    resolve('')
                })
            })
    })
}

export const createCompleteOrder = (orderObj) => {
    console.log('orderObj', orderObj)
    const status = ORDER_STATUS.COMPLETED
    const paymentMethod = orderObj.paymentMethod || 0
    const type = orderObj.type
    const note = orderObj.note
    const now = moment().unix()
    console.log('Now', now)
    const createAt = now
    const lastModifiedAt = now
    const totalAmount = orderObj.totalAmount
    const paidAmount = orderObj.paidAmount
    const discountAmount = orderObj.discountAmount

    const generateOrderId = uuidv1().replace(/-/g, '')
    const generateOrderCode = shortid.generate()
    const orderId = orderObj.orderId || generateOrderId
    const orderCode = orderObj.orderCode || ''
    const clientOrderId = orderObj.clientOrderId || generateOrderId
    const items = orderObj.items

    console.log('orderId, orderCode', orderId, orderCode)
    const orderQuery = `INSERT OR REPLACE INTO 
        s_order(ID, ORDER_CODE, CLIENT_ORDER_ID, IS_SYNC, PAYMENT_METHOD, TYPE, TOTAL_AMOUNT, DISCOUNT_AMOUNT, PAID_AMOUNT, NOTE, STATUS, CREATED_AT, LAST_MODIFIED_AT) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    const deleteOrderDetailQuery = `DELETE FROM s_order_detail WHERE ORDER_ID = ?;`
    const orderDetailQuery = `INSERT OR REPLACE INTO s_order_detail(ID, ORDER_ID, PRODUCT_ID, PRICE, QTY) VALUES (?, ?, ?, ?, ?);`
    console.log('Prepare Order insert', [orderId, orderCode, clientOrderId, 0, paymentMethod, type, totalAmount, discountAmount, paidAmount, note, status, createAt, lastModifiedAt])
    return new Promise((resolve, reject) => {
        DBManager.getInstance()
            .then(db => {
                db.transaction(tx => {
                    tx.executeSql(orderQuery, [orderId, orderCode, clientOrderId, 0, paymentMethod, type, totalAmount, discountAmount, paidAmount, note, status, createAt, lastModifiedAt], (tx, orderResult) => {
                        console.log('createCompleteOrder orderResult', orderResult)
                    })
                    tx.executeSql(deleteOrderDetailQuery, [orderId], (tx, orderDetailResult) => {
                        console.log('createCompleteOrder orderDetailResult', orderDetailResult)
                    })
                    for (let i = 0; i < items.length; i++) {
                        const orderDetailUid = items[i].id || shortid.generate()
                        console.log('Prepare order detail', [orderDetailUid, orderId, items[i].productId, items[i].price, items[i].qty])
                        tx.executeSql(orderDetailQuery, [orderDetailUid, orderId, items[i].productId, items[i].price, items[i].qty])
                    }
                }, (err) => {
                    reject(err)
                }, () => {
                    console.log('Transaction OK')
                    resolve(orderCode)
                })
            })
    })
}

export const createDraftTableOrder = (orderObj) => {
    console.log('orderObj', orderObj)
    const status = ORDER_STATUS.DRAFT
    const paymentMethod = orderObj.paymentMethod || 0
    const type = orderObj.type
    const note = orderObj.note
    const now = moment().unix()
    console.log('Now', now)
    const createAt = now
    const lastModifiedAt = now
    const totalAmount = orderObj.totalAmount
    const paidAmount = orderObj.paidAmount
    const discountAmount = orderObj.discountAmount

    const generateOrderId = uuidv1().replace(/-/g, '')
    const generateOrderCode = shortid.generate()
    const orderId = orderObj.orderId || generateOrderId
    const orderCode = orderObj.orderCode || ''
    const clientOrderId = orderObj.clientOrderId || generateOrderId
    const items = orderObj.items
    const tableId = orderObj.tableId
    const tableDisplayName = orderObj.tableDisplayName

    console.log('orderId, orderCode', orderId, orderCode)
    const orderQuery = `INSERT OR REPLACE INTO 
        s_order(ID, ORDER_CODE, TABLE_ID, TABLE_DISPLAY_NAME, CLIENT_ORDER_ID, IS_SYNC, PAYMENT_METHOD, TYPE, TOTAL_AMOUNT, DISCOUNT_AMOUNT, PAID_AMOUNT, NOTE, STATUS, CREATED_AT, LAST_MODIFIED_AT) 
        VALUES (?, ?, ?, ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    const deleteOrderDetailQuery = `DELETE FROM s_order_detail WHERE ORDER_ID=? OR ORDER_ID=?;`
    const orderDetailQuery = `INSERT OR REPLACE INTO s_order_detail(ID, ORDER_ID, PRODUCT_ID, PRICE, QTY) VALUES (?, ?, ?, ?, ?);`

    console.log('Prepare Order insert', [orderId, orderCode, tableId, tableDisplayName, clientOrderId, 0, paymentMethod, type, totalAmount, discountAmount, paidAmount, note, status, createAt, lastModifiedAt])
    return new Promise((resolve, reject) => {
        DBManager.getInstance()
            .then(db => {
                db.transaction(tx => {
                    tx.executeSql(orderQuery, [orderId, orderCode, tableId, tableDisplayName, clientOrderId, 0, paymentMethod, type, totalAmount, discountAmount, paidAmount, note, status, createAt, lastModifiedAt], (tx, resultSaveOrder) => {
                        console.log('Result save order')
                    }, (tx, errSaveOrder) => {
                        console.log('errSaveOrder')
                    })
                    tx.executeSql(deleteOrderDetailQuery, [orderId, clientOrderId], (tx, deleteResult) => {
                        console.log('Delete OrderDetail', deleteResult)
                    })
                    for (let i = 0; i < items.length; i++) {
                        const orderDetailUid = items[i].id || shortid.generate()
                        console.log('Prepare order detail', [orderDetailUid, orderId, items[i].productId, items[i].price, items[i].qty])
                        tx.executeSql(orderDetailQuery, [orderDetailUid, orderId, items[i].productId, items[i].price, items[i].qty])
                    }
                }, (err) => {
                    reject(err)
                }, () => {
                    console.log('Transaction OK')
                    resolve('')
                })
            })
    })
}

export const createCompleteTableOrder = (orderObj) => {
    console.log('orderObj', orderObj)
    const status = ORDER_STATUS.COMPLETED
    const paymentMethod = orderObj.paymentMethod || 0
    const type = orderObj.type
    const note = orderObj.note
    const now = moment().unix()
    console.log('Now', now)
    const createAt = now
    const lastModifiedAt = now
    const totalAmount = orderObj.totalAmount
    const paidAmount = orderObj.paidAmount
    const discountAmount = orderObj.discountAmount
    const generateOrderId = uuidv1().replace(/-/g, '')
    const generateOrderCode = shortid.generate()
    const orderId = orderObj.orderId || generateOrderId
    const orderCode = orderObj.orderCode || ''
    const clientOrderId = orderObj.clientOrderId || generateOrderId
    const items = orderObj.items
    const tableId = orderObj.tableId
    const tableDisplayName = orderObj.tableDisplayName

    console.log('orderId, orderCode', orderId, orderCode)
    const orderQuery = `INSERT OR REPLACE INTO 
        s_order(ID, ORDER_CODE, TABLE_ID, TABLE_DISPLAY_NAME, CLIENT_ORDER_ID, IS_SYNC, PAYMENT_METHOD, TYPE, TOTAL_AMOUNT, DISCOUNT_AMOUNT, PAID_AMOUNT, NOTE, STATUS, CREATED_AT, LAST_MODIFIED_AT) 
        VALUES (?, ?, ?, ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    const deleteOrderDetailQuery = `DELETE FROM s_order_detail WHERE ORDER_ID=? OR ORDER_ID=?;`
    const orderDetailQuery = `INSERT OR REPLACE INTO s_order_detail(ID, ORDER_ID, PRODUCT_ID, PRICE, QTY) VALUES (?, ?, ?, ?, ?);`
    const updateTableQuery = `UPDATE m_merchant_table set NUM_OF_GUEST="", BUSY="", ENTRY_TIME="", ORDINAL="", IS_SYNC=0 WHERE ID=?`
    console.log('Prepare Order insert', [orderId, orderCode, tableId, tableDisplayName, clientOrderId, 0, paymentMethod, type, totalAmount, discountAmount, paidAmount, note, status, createAt, lastModifiedAt])
    const resultSaveOrder = executeSql(orderQuery, [orderId, orderCode, tableId, tableDisplayName, clientOrderId, 0, paymentMethod, type, totalAmount, discountAmount, paidAmount, note, status, createAt, lastModifiedAt])
    executeSql(deleteOrderDetailQuery, [orderId, clientOrderId])
    for (let i = 0; i < items.length; i++) {
        const orderDetailUid = items[i].id || shortid.generate()
        console.log('Prepare order detail', [orderDetailUid, orderId, items[i].productId, items[i].price, items[i].qty])
        executeSql(orderDetailQuery, [orderDetailUid, orderId, items[i].productId, items[i].price, items[i].qty])
    }
    executeSql(updateTableQuery, [tableId])
    return ''
}

export const getActiveTableOrder = async (tableId) => {
    const orderQuery = `SELECT ID as id, ORDER_CODE as orderCode, STATUS as status, 
        TYPE as type, NOTE as note, TABLE_ID as tableId, TABLE_DISPLAY_NAME as tableDisplayName, 
        PAID_AMOUNT as paidAmount, TOTAL_AMOUNT as totalAmount, DISCOUNT_AMOUNT as discountAmount, 
        CREATED_AT as createdAt, LAST_MODIFIED_AT as lastModifiedAt, CREATED_BY as createBy, 
        LAST_MODIFIED_BY as lastModifiedBy, REF_PAYMENT_CODE as refPaymentCode, VOUCHER_CODE as voucherCode,
        BUYER_COMPANY_NAME as buyerCompanyName, BUYER_TAX_CODE as buyerTaxCode, BUYER_COMPANY_ADDRESS as buyerCompanyAddress, 
        RECEIVER_NAME as receiverName, RECEIVER_PHONE as receiverPhone, RECEIVER_PROVINCE as receiverProvince, 
        RECEIVER_DISTRICT as receiverDistrict, RECEIVER_WARD as receiverWard, RECEIVER_ADDRESS as receiverAddress, RECEIVER_NOTE as receiverNote,
        SHIPPING_FEE as shippingFee, CLIENT_ORDER_ID as clientOrderId, IS_SYNC as isSync
        FROM s_order 
        WHERE STATUS=${ORDER_STATUS.DRAFT} AND TABLE_ID=? AND IS_DELETED IS NULL`

    const orderResult = await executeSql(orderQuery, [tableId])
    const orderList = orderResult.rows.raw()
    console.log('Table Order List', orderList)
    const orderIdList = orderList.map(item => getStringSQL(item.id))
    const orderDetailQuery = `SELECT od.ID as id, od.ORDER_ID as orderId,
        od.PRODUCT_ID as productId,
        od.PRICE as price, od.PRODUCT_VARIANT_ID as productVariantId, od.QTY as qty,
        p.NAME as productName, p.AVATAR as productAvatar 
        FROM s_order_detail od
        INNER JOIN s_product p
        ON od.PRODUCT_ID = p.ID
        WHERE ORDER_ID IN (${orderIdList.join(',')});`
    const orderListResult = []
    const orderDetailResult = await executeSql(orderDetailQuery, [])
    const orderDetailList = orderDetailResult.rows.raw()
    console.log('Table Order Detail', orderDetailList)
    for (let i = 0; i < orderList.length; i++) {
        const listOrderDetailTmp = []
        for (let j = 0; j < orderDetailList.length; j++) {
            if (orderDetailList[j].orderId == orderList[i].id) {
                listOrderDetailTmp.push(orderDetailList[j])
            }
        }
        orderListResult.push({
            order: orderList[i],
            listOrderDetail: listOrderDetailTmp
        })
    }
    return orderListResult[0]
}

export const getNumberUnsyncTableOrder = async (tableId) => {
    // const orderNumberQuery = `SELECT COUNT(*) as numberRecord FROM s_order WHERE IS_SYNC=0 AND TABLE_ID=?`
    // const orderNumberResult = await executeSql(orderNumberQuery, [tableId])
    const orderNumberQuery = `SELECT COUNT(*) as numberRecord FROM s_order WHERE IS_SYNC=0 AND TABLE_ID IS NOT NULL;`
    const orderNumberResult = await executeSql(orderNumberQuery, [])
    return orderNumberResult.rows.raw()[0]['numberRecord']
}

export const getNumberUnsyncOrder = async () => {
    const orderNumberQuery = `SELECT COUNT(*) as numberRecord FROM s_order WHERE IS_SYNC=0`
    const orderNumberResult = await executeSql(orderNumberQuery, [])
    console.log('orderNumberResult', orderNumberResult)
    return orderNumberResult.rows.raw()[0]['numberRecord']
}

export const completeTableOrder = async (orderId, paymentMethod, tableId) => {
    console.log('completeTableOrder', orderId, paymentMethod, tableId)
    const orderQuery = `UPDATE s_order SET "STATUS"=${ORDER_STATUS.COMPLETED}, IS_SYNC=0, PAYMENT_METHOD=? WHERE ID=?`
    const updateTableQuery = `UPDATE m_merchant_table set NUM_OF_GUEST="", BUSY="", ENTRY_TIME="", ORDINAL="", IS_SYNC=0 WHERE ID=?`
    const orderResult = await executeSql(orderQuery, [paymentMethod, orderId])
    const updateTableResult = await executeSql(updateTableQuery, [tableId])
    console.log('orderResult, updateTableResult', orderResult, updateTableResult)
    return [orderResult, updateTableResult]
}

export const getUnsyncOrder = async () => {
    const orderQuery = `SELECT ID as orderId, ORDER_CODE as orderCode, DISCOUNT_AMOUNT as discountAmount, CLIENT_ORDER_ID as clientOrderId, STATUS as orderStatus, 
        TYPE as type, IFNULL(NOTE, '') as note, IFNULL(TABLE_ID, '') as tableId, IS_DELETED as deleteOrder,
        PAYMENT_METHOD as paymentMethod
        FROM s_order 
        WHERE IS_SYNC = 0
        LIMIT 10;`

    const orderResult = await executeSql(orderQuery, [])
    const orderList = orderResult.rows.raw()
    // console.log('Order List', orderList)
    const orderIdList = orderList.map(item => getStringSQL(item.orderId))
    const orderDetailQuery = `SELECT ORDER_ID as orderId, PRODUCT_ID as productId,
        PRICE as price, QTY as qty
        FROM s_order_detail
        WHERE ORDER_ID IN (${orderIdList.join(',')});`
    // console.log('orderDetailQuery', orderDetailQuery)
    const orderListResult = []
    const orderDetailResult = await executeSql(orderDetailQuery, [])
    const orderDetailList = orderDetailResult.rows.raw()
    for (let i = 0; i < orderList.length; i++) {
        const listOrderDetailTmp = []
        for (let j = 0; j < orderDetailList.length; j++) {
            if (orderDetailList[j].orderId == orderList[i].orderId) {
                listOrderDetailTmp.push(orderDetailList[j])
            }
        }
        orderListResult.push({
            ...orderList[i],
            deleteOrder: orderList[i].deleteOrder ? true : false,
            orderId: orderList[i].orderId, //(orderList[i].orderId != orderList[i].clientOrderId) ? orderList[i].orderId : '',
            items: listOrderDetailTmp
        })
    }
    return orderListResult
}

export const updateStatusSyncOk = (orderIdList) => {
    const updateOrderQuery = `UPDATE s_order SET IS_SYNC=1 WHERE CLIENT_ORDER_ID IN (${orderIdList.map(item => getStringSQL(item)).join(',')})`;
    console.log('updateOrderQuery', updateOrderQuery)
    return new Promise((resolve, reject) => {
        DBManager.getInstance()
            .then(db => {
                db.transaction(tx => {
                    tx.executeSql(updateOrderQuery, [])
                }, (err) => {
                    reject(err)
                }, () => {
                    resolve('')
                })
            })
    })
}

export const deleteOrder = async (orderId) => {
    const currentOrderQuery = `SELECT ID as id, ORDER_CODE as orderCode, STATUS as status, 
        TYPE as type, NOTE as note, TABLE_ID as tableId, TABLE_DISPLAY_NAME as tableDisplayName, 
        IS_SYNC as isSync FROM s_order WHERE ID=?`
    const currentOrderResult = await executeSql(currentOrderQuery, [orderId])
    const currentOrder = currentOrderResult.rows.raw()[0]
    if (!currentOrder) return ''
    if (currentOrder.tableId) {
        const cleanTableQuery = `UPDATE m_merchant_table
            SET NUM_OF_GUEST =?, ENTRY_TIME =?, BUSY =?, IS_SYNC = 0
            WHERE ID =?;
        `
        const cleanTableResult = await executeSql(cleanTableQuery, ['', '', '', currentOrder.tableId])
    }
    if (!currentOrder.isSync) {
        const deleteOrderQuery = `DELETE FROM s_order where ID=?`
        const deleteOrderResult = await executeSql(deleteOrderQuery, [orderId])
    } else {
        const updateOrderQuery = `UPDATE s_order SET IS_DELETED=1, IS_SYNC=0 WHERE ID=?`;
        const updateOrderResult = await executeSql(updateOrderQuery, [orderId])
    }
    return ''
}