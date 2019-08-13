import DBManager from '~/src/db/DBManager'
import { getStringSQL, getIntSQL, executeSql } from '~/src/utils'
import moment from 'moment'
import { getActiveTableOrder } from '~/src/db/order'
import { ORDER_STATUS } from '~/src/constants'

const saveListFloorTable = (floorTable) => {
    console.log('saveListFloorTable', floorTable)
    if (!floorTable) return
    const floor = floorTable.map(item => item.floor)
    const listTable = floorTable.map(item => item.listTable).reduce((a, b) => [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])], [])
    const deleteFloorQuery = 'DELETE FROM m_merchant_floor'
    const deleteTableQuery = 'DELETE FROM m_merchant_table'
    const saveFloorQuery = (floor && floor.length > 0) ?
        'INSERT OR REPLACE INTO m_merchant_floor(ID, FLOOR_NAME, MERCHANT_ID, ORDINAL) VALUES ' +
        `${floor.map(item => `("${item.id}", "${item.floorName}", "${item.merchantId}", ${item.ordinal})`).join(',')};`
        : ''

    const saveTableQuery = (listTable && listTable.length > 0) ?
        'INSERT OR REPLACE INTO m_merchant_table(ID, TABLE_NAME, FLOOR_ID, MERCHANT_ID, ORDINAL, NUM_OF_GUEST, BUSY, ENTRY_TIME, IS_SYNC) VALUES ' +
        `${listTable.map(item => `("${item.id}", "${item.tableName}", "${item.floorId}", "${item.merchantId}", ${item.ordinal}, ${item.numOfGuest}, ${item.busy}, ${item.entryTime}, 1)`).join(',')};`
        : ''

    // console.log('saveFloorQuery', saveFloorQuery)
    // console.log('saveTableQuery', saveTableQuery)
    // if (!saveFloorQuery && !saveTableQuery) return

    const batchSQL = [deleteFloorQuery, deleteTableQuery, saveFloorQuery, saveTableQuery].filter(item => !!item)
    return new Promise((resolve, reject) => {
        DBManager.getInstance()
            .then(db => {
                db.sqlBatch(batchSQL, (result) => {
                    resolve(result)
                }, (err) => {
                    reject(err)
                })
            })
            .catch(err => {
                reject(err)
            })
    })
}

const getListFloorTable = async () => {
    const floorQuery = `SELECT 
        ID as id, FLOOR_NAME as floorName, MERCHANT_ID as merchantId, ORDINAL as ordinal    
        FROM m_merchant_floor`

    const resultFloor = await executeSql(floorQuery, [])
    const floorData = resultFloor.rows.raw()
    if (!floorData || floorData.length == 0) Promise.resolve([])
    const floorIds = floorData.map(item => getStringSQL(item.id))
    const tableQuery = `SELECT ID as id, TABLE_NAME as tableName, FLOOR_ID as floorId,
        ORDINAL as ordinal, NUM_OF_GUEST as numOfGuest, BUSY as busy, ENTRY_TIME as entryTime
        FROM m_merchant_table
        WHERE FLOOR_ID IN (${floorIds.join(',')})`
    const resultTable = await executeSql(tableQuery, [])
    const tableData = resultTable.rows.raw()
    const result = []
    for (let i = 0; i < floorData.length; i++) {
        const tempListTable = []
        for (let j = 0; j < tableData.length; j++) {
            if (tableData[j].floorId == floorData[i].id) {
                tempListTable.push(tableData[j])
            }
        }
        result.push({
            floor: floorData[i],
            listTable: tempListTable
        })
    }
    return result
}

const openTable = (tableId, numOfGuest) => {
    const updateTableQuery = `UPDATE m_merchant_table set NUM_OF_GUEST =?, BUSY = 1, IS_SYNC = 0, ENTRY_TIME = ${moment().unix()} WHERE ID =? `
    const resultUpdate = executeSql(updateTableQuery, [numOfGuest, tableId])
    return resultUpdate
}

const getUnsyncTable = async () => {
    const unsyncTableQuery = `SELECT ID as tableId, IFNULL(NUM_OF_GUEST, '') as numOfGuest, IFNULL(BUSY, '') as busy, IFNULL(ENTRY_TIME, '') as entryTime FROM m_merchant_table WHERE IS_SYNC = 0`
    const unsyncTableQueryResult = await executeSql(unsyncTableQuery, [])
    return unsyncTableQueryResult.rows.raw()
}

const updateStatusTableSyncOk = async (tableIds) => {
    const updateTableQuery = `UPDATE m_merchant_table SET IS_SYNC = 1 WHERE ID IN(${tableIds.map(item => getStringSQL(item)).join(',')}); `;
    console.log('updateTableQuery', updateTableQuery)
    const updateTableResult = await executeSql(updateTableQuery, [])
    return updateTableResult
}

const cleanTable = () => {

}

const mergeTable = async (srcTableId, dstTableId) => {
    console.log('srcTableId, dstTableId', srcTableId, dstTableId)
    const tableQuery = `SELECT t.ID as id, t.TABLE_NAME as tableName,
        t.FLOOR_ID as floorId, t.ENTRY_TIME as entryTime, t.NUM_OF_GUEST as numOfGuest,
        t.BUSY as busy, t.ORDINAL as ordinal, t.MERCHANT_ID as merchantId, f.FLOOR_NAME as floorName
        FROM m_merchant_table t
        INNER JOIN m_merchant_floor f
        ON t.FLOOR_ID = f.ID
        WHERE t.ID =?; `
    const updateTableQuery = `UPDATE m_merchant_table
        SET NUM_OF_GUEST =?, ENTRY_TIME =?, BUSY =?, IS_SYNC = 0
        WHERE ID =?;
    `
    const orderTableQuery = `SELECT ID as id, ORDER_CODE as orderCode, STATUS as status,
        TYPE as type, NOTE as note, TABLE_ID as tableId, TABLE_DISPLAY_NAME as tableDisplayName,
        PAID_AMOUNT as paidAmount, TOTAL_AMOUNT as totalAmount, DISCOUNT_AMOUNT as discountAmount,
        CLIENT_ORDER_ID as clientOrderId, IS_SYNC as isSync
    FROM s_order
    WHERE IS_DELETED IS NULL AND STATUS = ${ORDER_STATUS.DRAFT} AND TABLE_ID =? `
    const orderDetailQuery = `SELECT ID as id, ORDER_ID as orderId, PRODUCT_ID as productId, PRICE as price, QTY as qty FROM s_order_detail WHERE ORDER_ID=?`
    const deleteOrderDetailQuery = `DELETE FROM s_order_detail WHERE ORDER_ID=?`
    const updateSrcOrderQuery = `UPDATE s_order SET IS_DELETED=1, IS_SYNC=0 WHERE ID=?`
    const updateDstOrderQuery = `UPDATE s_order SET IS_SYNC=0, DISCOUNT_AMOUNT=?, PAID_AMOUNT=?, TOTAL_AMOUNT=? WHERE ID=?`

    const srcTableResult = await executeSql(tableQuery, [srcTableId])
    const dstTableResult = await executeSql(tableQuery, [dstTableId])
    const srcTable = srcTableResult.rows.raw()[0]
    const dstTable = dstTableResult.rows.raw()[0]

    const srcTableOrderResult = await executeSql(orderTableQuery, [srcTableId])
    const dstTableOrderResult = await executeSql(orderTableQuery, [dstTableId])
    const srcTableOrder = srcTableOrderResult.rows.raw()[0]
    const dstTableOrder = dstTableOrderResult.rows.raw()[0]
    console.log('srcTableOrderResult.rows.raw()', srcTableOrderResult.rows.raw())
    console.log('dstTableOrderResult.rows.raw()', dstTableOrderResult.rows.raw())
    console.log('srcTableOrder', srcTableOrder)
    console.log('dstTableOrder', dstTableOrder)
    if (!srcTableOrder) {
        const updateSrcTableResult = await executeSql(updateTableQuery, ['', '', 0, srcTableId])
        const updateDstTableResult = await executeSql(updateTableQuery, [(+srcTable.numOfGuest) + (+dstTable.numOfGuest), dstTable.entryTime, dstTable.busy, dstTableId])
        console.log('updateSrcOrderResult', updateSrcOrderResult)
        console.log('updateDstOrderResult', updateDstOrderResult)
        return ''
    } else if (!dstTableOrder) {
        const updateSrcTableResult = await executeSql(updateTableQuery, ['', '', 0, srcTableId])
        const updateDstTableResult = await executeSql(updateTableQuery, [(+srcTable.numOfGuest) + (+dstTable.numOfGuest), dstTable.entryTime, dstTable.busy, dstTableId])
        console.log('updateSrcOrderResult', updateSrcOrderResult)
        console.log('updateDstOrderResult', updateDstOrderResult)
        const dstTableDisplayName = `${dstTable.floorName}: ${dstTable.tableName}`
        const srcOrderId = srcTableOrder.id
        const updateSrcOrderQuery = `UPDATE s_order SET TABLE_ID =?, TABLE_DISPLAY_NAME =?, IS_SYNC = 0 WHERE ID =? `
        const updateSrcOrderResult = await executeSql(updateSrcOrderQuery, [dstTableId, dstTableDisplayName, srcOrderId])
        return ''
    }

    const srcOrderId = srcTableOrder.id
    const dstOrderId = dstTableOrder.id
    const newDiscountAmount = +srcTableOrder.discountAmount + +dstTableOrder.discountAmount
    const newPaidAmount = +srcTableOrder.paidAmount + +dstTableOrder.paidAmount
    const newTotalAmount = +srcTableOrder.totalAmount + +dstTableOrder.totalAmount
    console.log('newDiscountAmount, newPaidAmount, newTotalAmount', { newDiscountAmount, newPaidAmount, newTotalAmount })
    const srcOrderDetailResult = await executeSql(orderDetailQuery, [srcOrderId])
    const dstOrderDetailResult = await executeSql(orderDetailQuery, [dstOrderId])
    const srcOrderDetail = srcOrderDetailResult.rows.raw()
    const dstOrderDetail = dstOrderDetailResult.rows.raw()
    console.log('srcOrderDetail', srcOrderDetail)
    console.log('dstOrderDetail', dstOrderDetail)
    const newDstOrderDetail = [...dstOrderDetail]

    for (let i = 0; i < srcOrderDetail.length; i++) {
        const index = newDstOrderDetail.findIndex(item => item.productId == srcOrderDetail[i].productId)
        if (index < 0) {
            newDstOrderDetail.push({
                ...srcOrderDetail[i],
                orderId: dstOrderId
            })
        } else {
            newDstOrderDetail[index] = {
                ...newDstOrderDetail[index],
                qty: newDstOrderDetail[index].qty + srcOrderDetail[i].qty
            }
        }
    }
    console.log('newDstOrderDetail', newDstOrderDetail)
    const deleteSrcOrderResult = await executeSql(deleteOrderDetailQuery, [srcOrderId])
    const deleteDstOrderResult = await executeSql(deleteOrderDetailQuery, [dstOrderId])
    console.log('deleteSrcOrderResult', deleteSrcOrderResult)
    console.log('deleteDstOrderResult', deleteDstOrderResult)
    const insertNewOrderaDetailQuery = `INSERT OR REPLACE INTO s_order_detail(
        ID, ORDER_ID, PRODUCT_ID, PRICE, QTY
        ) VALUES 
        ${newDstOrderDetail.map(item => (
        `(${getStringSQL(item.id)},` +
        `${getStringSQL(item.orderId)},` +
        `${getStringSQL(item.productId)},` +
        `${getIntSQL(item.price)},` +
        `${getIntSQL(item.qty)})`
    )).join(',')};`
    const newDstOrderDetailResult = await executeSql(insertNewOrderaDetailQuery, [])
    console.log('newDstOrderDetailResult', newDstOrderDetailResult)
    const updateSrcOrderResult = await executeSql(updateSrcOrderQuery, [srcOrderId])
    const updateDstOrderResult = await executeSql(updateDstOrderQuery, [newDiscountAmount, newPaidAmount, newTotalAmount, dstOrderId])
    const updateSrcTableResult = await executeSql(updateTableQuery, ['', '', 0, srcTableId])
    const updateDstTableResult = await executeSql(updateTableQuery, [(+srcTable.numOfGuest) + (+dstTable.numOfGuest), dstTable.entryTime, dstTable.busy, dstTableId])
    console.log('updateSrcOrderResult', updateSrcOrderResult)
    console.log('updateDstOrderResult', updateDstOrderResult)
    console.log('updateSrcTableResult', updateSrcTableResult)
    console.log('updateDstTableResult', updateDstTableResult)
    return ''
}

const changeTable = async (srcTableId, dstTableId) => {
    console.log('srcTableId, dstTableId', srcTableId, dstTableId)
    const tableQuery = `SELECT ID as id, TABLE_NAME as tableName,
        FLOOR_ID as floorId, ENTRY_TIME as entryTime, NUM_OF_GUEST as numOfGuest,
        BUSY as busy, ORDINAL as ordinal, MERCHANT_ID as merchantId
    FROM m_merchant_table WHERE ID =?; `
    const updateTableQuery = `UPDATE m_merchant_table
    SET NUM_OF_GUEST =?, ENTRY_TIME =?, BUSY =?, IS_SYNC = 0
    WHERE ID =?;
    `
    const orderTableQuery = `SELECT ID as id, ORDER_CODE as orderCode, STATUS as status,
        TYPE as type, NOTE as note, TABLE_ID as tableId, TABLE_DISPLAY_NAME as tableDisplayName,
        PAID_AMOUNT as paidAmount, TOTAL_AMOUNT as totalAmount, DISCOUNT_AMOUNT as discountAmount,
        CLIENT_ORDER_ID as clientOrderId, IS_SYNC as isSync
    FROM s_order
    WHERE IS_DELETED IS NULL AND STATUS = ${ORDER_STATUS.DRAFT} AND TABLE_ID =?`
    const tableFloorQuery = `SELECT
    t.ID as tableId, t.TABLE_NAME as tableName, f.ID as floorId, f.FLOOR_NAME as floorName
    FROM m_merchant_table t
    INNER JOIN m_merchant_floor f
    ON t.FLOOR_ID = f.ID
    WHERE t.ID = ? `

    const updateTableOrderQuery = `UPDATE s_order SET TABLE_ID =?, TABLE_DISPLAY_NAME =?, IS_SYNC = 0 WHERE ID =? `
    const srcTableResult = await executeSql(tableQuery, [srcTableId])
    const dstTableResult = await executeSql(tableFloorQuery, [dstTableId])
    const orderTableResult = await executeSql(orderTableQuery, [srcTableId])

    const srcOrderTable = orderTableResult.rows.raw()[0]
    const dstTable = dstTableResult.rows.raw()[0]
    const srcTable = srcTableResult.rows.raw()[0]

    console.log('src table', srcTable)
    console.log('srcOrderTable', srcOrderTable)
    console.log('dstTable', dstTable)
    if (!srcOrderTable || !dstTable || !srcTable) return
    const orderId = srcOrderTable.id
    const tableDisplayName = `${dstTable.floorName}: ${dstTable.tableName} `
    console.log('Param', orderId, dstTableId, tableDisplayName)
    const updateSrcTableResult = await executeSql(updateTableQuery, ['', '', '', srcTableId])
    const updateDstTableResult = await executeSql(updateTableQuery, [srcTable.numOfGuest, srcTable.entryTime, srcTable.busy, dstTableId])
    const updateTableResult = await executeSql(updateTableOrderQuery, [dstTableId, tableDisplayName, orderId])
    return [updateSrcTableResult, updateDstTableResult, updateTableResult]
}

const clearFloor = async () => {
    const deleteFloorQuery = 'DELETE FROM m_merchant_floor;'
    const deleteTableQuery = 'DELETE FROM m_merchant_table;'
    const floorResult = await executeSql(deleteFloorQuery, [])
    const tableResult = await executeSql(deleteTableQuery, [])
    return [floorResult, tableResult]
}

export default {
    saveListFloorTable,
    getListFloorTable,
    openTable, cleanTable,
    mergeTable, changeTable,
    clearFloor, getUnsyncTable,
    updateStatusTableSyncOk
}