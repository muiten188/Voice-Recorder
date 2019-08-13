import DBManager from '~/src/db/DBManager'
import { getStringSQL, getIntSQL, executeSql } from '~/src/utils'
import { ORDER_STATUS } from '~/src/constants'
import uuidv1 from 'uuid/v1'

const addNotification = async (subId, type) => {
    const query = `INSERT OR REPLACE INTO local_notification(ID, SUB_ID, TYPE) VALUES (?, ?, ?)`
    const notificationId = uuidv1().replace(/-/g, '')
    const result = await executeSql(query, [notificationId, subId, type])
    console.log('Result row', result.rows.raw())
    return result.rows.raw()
}

const getAllNotification = async () => {
    const query = `SELECT ID as id, SUB_ID as subId, TYPE as type from local_notification`
    const result = await executeSql(query, [])
    console.log('Result row', result.rows.raw())
    return result.rows.raw()
}

const deleteOrderScheduleNotification = async (orderId) => {
    const query = `DELETE FROM local_notification WHERE ID=?`
    const result = await executeSql(query, [orderId])
    return result
}

const clearNotification = async () => {
    const query = `DELETE FROM local_notification`
    const result = await executeSql(query, [])
    return result
}

export default {
    addNotification,
    deleteOrderScheduleNotification,
    clearNotification,
    getAllNotification
}