import { takeLatest, takeEvery, all, call, put } from 'redux-saga/effects'

import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { chainParse, showToast } from '~/src/utils'
import {
    setFloor, setTable, setTableProduct,
    setFloorTable, setOrderTable, getFloorTable,
    saveFloorTableToDB, cleanOrderTable
} from '~/src/store/actions/table'
import tableModel from '~/src/db/table'
import lodash from 'lodash'
import NavigationUtils from '~/src/utils/NavigationUtils'
import { getActiveTableOrder, saveOrder, getNumberUnsyncTableOrder } from '~/src/db/order'
import I18n from '~/src/I18n'
import { syncOrderData } from '~/src/store/actions/backgroundSync'

// Update
export const requestCreateFloor = createRequestSaga({
    request: api.table.createFloor,
    key: 'table/createFloor',
})

export const requestGetFloor = createRequestSaga({
    request: api.table.getFloor,
    key: 'table/getFloor',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result'])
            if (result && Array.isArray(result)) {
                return setFloor(result)
            }
            return noop('')
        }
    ]
})

export const requestRemoveFloor = createRequestSaga({
    request: api.table.removeFloor,
    key: 'table/removeFloor',
})


export const requestCreateTable = createRequestSaga({
    request: api.table.createTable,
    key: 'table/createTable',
})

export const requestGetTable = createRequestSaga({
    request: api.table.getTable,
    key: 'table/getTable',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result'])
            console.log('Result get Table')
            if (result && Array.isArray(result)) {
                return setTable(result)
            }
            return noop('')
        }
    ]
})

export const requestRemoveTable = createRequestSaga({
    request: api.table.removeTable,
    key: 'table/removeTable',
})


export const requestGetTableProduct = createRequestSaga({
    request: api.table.getProduct,
    key: 'table/getTableProduct',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result']) || []
            const statusCode = chainParse(data, ['httpHeaders', 'status'])
            if (statusCode == 200) {
                const tableId = data.args[1]
                return setTableProduct({
                    tableId,
                    productInfo: result
                })
            }
            return noop('')
        }
    ]
})

// export const requestChangeTable = createRequestSaga({
//     request: api.table.change,
//     key: 'table/changeTable',
// })

// export const requestMergeTable = createRequestSaga({
//     request: api.table.merge,
//     key: 'table/mergeTable',
// })

export const requestUpdateNumberGuestTable = createRequestSaga({
    request: api.table.updateNumberGuest,
    key: 'table/updateNumberGuestTable',
})

export const requestGetFloorTable = createRequestSaga({
    request: api.table.getFloorTable,
    key: 'table/getFloorTable',
})


export const requestSyncFloorTableFromNetwork = function* (action) {
    try {
        const unsyncTables = yield call(tableModel.getUnsyncTable)
        console.log('unsync tables', unsyncTables)
        if (unsyncTables && unsyncTables.length > 0) return
        console.log('requestSyncFloorTableFromNetwork', action)
        const floorTableResponse = yield call(requestGetFloorTable, { type: 'table/getFloorTable' })
        console.log('floorTableResponse', floorTableResponse)
        const httpStatus = chainParse(floorTableResponse, ['httpHeaders', 'status'])
        if (httpStatus != 200) return
        const result = chainParse(floorTableResponse, ['content']) || []
        const saveFloorTableDBResult = yield call(tableModel.saveListFloorTable, result)
        yield call(requestSyncFloorTableFromDBToRedux)
    } catch (err) {
        console.log('requestSyncFloorTableFromNetwork err', err)
    }

}

const requestSaveFloorTableToDB = function* (action) {
    try {
        const saveFloorTableDBResult = yield call(tableModel.saveListFloorTable, action.payload)
        yield call(requestSyncFloorTableFromDBToRedux)
    } catch (err) {
        console.log('requestSaveFloorTableToDB err', err)
    }
}

const requestSyncFloorTableFromDBToRedux = function* () {
    const floorTable = yield call(tableModel.getListFloorTable)
    console.log('Floor Table', floorTable)
    yield put(setFloorTable(floorTable))
}

const requestOpenTable = function* (action) {
    console.log('requestOpenTable', action)
    const { payload: { numberGuest = 0, tableId } } = action
    try {
        const openTableResult = yield call(tableModel.openTable, tableId, numberGuest)
        console.log('openTableResult', openTableResult)
        yield call(requestSyncFloorTableFromDBToRedux)
        // NavigationUtils.navigate('TableOrderDetail', {
        //     floorInfo,
        //     tableInfo
        // })
        // yield put(syncOrderData())
    } catch (err) {
        console.log('openTable err', err)
    }

}


export const requestGetOrderByTableFromNetwork = createRequestSaga({
    request: api.table.getOrderByTable,
    key: 'table/getOrderByTableFromNetwork',
})

const requestGetOrderByTable = function* (action) {
    console.log('requestGetOrderByTable', action)
    const tableId = action.args[0]
    try {
        console.log('Table Id', tableId)
        const tableOrderDB = yield call(getActiveTableOrder, tableId)
        console.log('tableOrderDB', tableOrderDB)
        if (tableOrderDB) {
            yield put(setOrderTable({
                tableId,
                orderInfo: tableOrderDB
            }))
        } else {
            yield put(setOrderTable({
                tableId,
                orderInfo: {}
            }))
        }
        const numberUnsyncOrder = yield call(getNumberUnsyncTableOrder, tableId)
        console.log('Number Unsync Order', numberUnsyncOrder)
        if (numberUnsyncOrder > 0) return
        const tableOrderNetworkResponse = yield call(requestGetOrderByTableFromNetwork, { type: 'table/getOrderByTableFromNetwork', args: [tableId] })
        if (!tableOrderNetworkResponse) return
        console.log('tableOrderNetworkResponse', tableOrderNetworkResponse)
        const tableOrderNetwork = chainParse(tableOrderNetworkResponse, ['updated', 'result'])
        if (!tableOrderNetwork || typeof (tableOrderNetwork.order) == 'undefined') return
        console.log('tableOrderNetwork', tableOrderNetwork)
        const saveOrderDBResult = yield call(saveOrder, tableOrderNetwork)
        console.log('saveOrderDBResult', saveOrderDBResult)
        yield put(setOrderTable({ tableId, orderInfo: tableOrderNetwork }))
    } catch (err) {
        console.log('requestGetOrderByTable err', err)
    }
}

const requestSyncTableToNetwork = createRequestSaga({
    request: api.table.syncTable,
    key: 'table/requestSyncTableToNetwork'
})

const requestSyncTable = function* () {
    try {
        const unsyncTables = yield call(tableModel.getUnsyncTable)
        console.log('unsync tables', JSON.stringify(unsyncTables))
        if (!unsyncTables || unsyncTables.length == 0) return
        const syncTableResult = yield call(requestSyncTableToNetwork, { type: 'table/requestSyncTableToNetwork', args: [unsyncTables] })
        // console.log('syncTableResult', syncTableResult, ['httpHeaders', 'status'])
        const statusCode = chainParse(syncTableResult, ['httpHeaders', 'status'])
        if (statusCode != 200) return
        const tableIds = unsyncTables.map(item => item.tableId)
        const updateStatusResult = yield call(tableModel.updateStatusTableSyncOk, tableIds)
        console.log('updateStatusResult', updateStatusResult)
    } catch (err) {
        console.log('requestSyncTable err', err)
    }
}

const requestChangeTable = function* (action) {
    try {
        console.log('Change table action', action)
        const srcTableId = action.args[0]
        const dstTableId = action.args[1]
        const changeTableResult = yield call(tableModel.changeTable, srcTableId, dstTableId)
        console.log('Change Table Result', changeTableResult)
        yield call(requestSyncFloorTableFromDBToRedux)
        const dstTableOrder = yield call(getActiveTableOrder, dstTableId)
        yield put(cleanOrderTable(srcTableId))
        yield put(setOrderTable({ tableId: dstTableId, orderInfo: dstTableOrder }))
        showToast(I18n.t('change_table_success'))
        NavigationUtils.navigate('Table')
        yield put(syncOrderData())
    } catch (err) {
        console.log('requestChangeTable err', err)
    }
}

export const requestMergeTable = function* (action) {
    try {
        console.log('Change table action', action)
        const srcTableId = action.args[0]
        const dstTableId = action.args[1]
        const mergeTableResult = yield call(tableModel.mergeTable, srcTableId, dstTableId)
        console.log('Merge Table Result', mergeTableResult)
        yield call(requestSyncFloorTableFromDBToRedux)
        const dstTableOrder = yield call(getActiveTableOrder, dstTableId)
        yield put(cleanOrderTable(srcTableId))
        yield put(setOrderTable({ tableId: dstTableId, orderInfo: dstTableOrder }))
        showToast(I18n.t('merge_table_success'))
        NavigationUtils.navigate('Table')
        yield put(syncOrderData())
    } catch (err) {
        console.log('requestMergeTable err', err)
    }
}

export const requestUpdateOrdinalFloor = createRequestSaga({
    request: api.table.updateOrdinalFloor,
    key: 'table/updateOrdinalFloor',
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('table/getTableProduct', requestGetTableProduct),
        takeEvery('table/createFloor', requestCreateFloor),
        takeEvery('table/removeFloor', requestRemoveFloor),
        takeEvery('table/createTable', requestCreateTable),
        takeEvery('table/removeTable', requestRemoveTable),
        takeEvery('table/updateNumberGuestTable', requestUpdateNumberGuestTable),

        takeEvery('table/getFloorTable', requestGetFloorTable),
        takeEvery('table/syncFloorTableFromNetwork', requestSyncFloorTableFromNetwork),
        takeEvery('table/saveFloorTableToDB', requestSaveFloorTableToDB),
        takeEvery('table/syncFloorTableFromDBToRedux', requestSyncFloorTableFromDBToRedux),
        takeEvery('table/openTable', requestOpenTable),
        takeEvery('table/getOrderByTable', requestGetOrderByTable),
        takeEvery('table/syncTable', requestSyncTable),
        takeEvery('table/changeTable', requestChangeTable),
        takeEvery('table/mergeTable', requestMergeTable),
        takeEvery('table/updateOrdinalFloor', requestUpdateOrdinalFloor)
    ])
}


