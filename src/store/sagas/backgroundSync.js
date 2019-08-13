import { put, takeEvery, all, call, eventChannel } from 'redux-saga/effects'
import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { chainParse } from '~/src/utils'
import backgroundSyncModel from '~/src/db/backgroundSync'
import { syncProductFromNetwork } from '~/src/store/actions/product'
import { syncFloorTableFromNetwork, syncTable } from '~/src/store/actions/table'
import { syncMenuFromNetwork } from '~/src/store/actions/menu'
import { syncOrder } from '~/src/store/actions/order'
import { getSaleCampain } from '~/src/store/actions/product'
import { ACTION_TYPES, checkAndSyncMasterData } from '~/src/store/actions/backgroundSync'
import { Platform } from 'react-native'
import { SYNC_ORDER_PERIOD } from '~/src/constants'
import { store } from '~/src/store/configStore'
var syncOrderInterval

export const requestGetDataVersion = createRequestSaga({
    request: api.backgroundSync.getDataVersion,
    key: 'backgroundSync/getDataVersion',
})

const _getVersionObj = (versionArr) => {
    let newDiscountVersion = 0, newProductVersion = 0, newTableVersion = 0, newMenuVersion = 0
    for (let i = 0; i < versionArr.length; i++) {
        if (versionArr[i].category == 'PRODUCT') {
            newProductVersion = (+versionArr[i].version)
        } else if (versionArr[i].category == 'DISCOUNT') {
            newDiscountVersion = (+versionArr[i].version)
        } else if (versionArr[i].category == 'TABLE') {
            newTableVersion = (+versionArr[i].version)
        } else if (versionArr[i].category == 'MENU') {
            newMenuVersion = (+versionArr[i].version)
        }
    }
    return {
        discount: newDiscountVersion,
        product: newProductVersion,
        table: newTableVersion,
        menu: newMenuVersion
    }
}

export const requestCheckAndSyncData = function* () {
    try {
        const currentDataVersion = yield call(backgroundSyncModel.getVersion)
        const dataVersionRes = yield call(requestGetDataVersion, { type: 'backgroundSync/getDataVersionFromNetwork' })
        console.log('dataVersion', dataVersionRes)

        const fetchAll = function* () {
            yield put(syncProductFromNetwork())
            yield put(syncMenuFromNetwork())
            yield put(getSaleCampain())
            yield put(syncFloorTableFromNetwork())
        }

        if (dataVersionRes) {
            const versionArr = chainParse(dataVersionRes, ['updated', 'result'])
            if (!versionArr || versionArr.length == 0) {
                yield call(fetchAll)
                return
            }
            console.log('CurrentDataVersion', currentDataVersion)
            const newVersion = _getVersionObj(versionArr)
            console.log('NewDataVersion', newVersion)
            if (!currentDataVersion) {
                yield put(syncProductFromNetwork())
                yield put(syncFloorTableFromNetwork())
                yield put(syncMenuFromNetwork())
                yield put(getSaleCampain())
                yield call(backgroundSyncModel.saveVersion,
                    newVersion.product, newVersion.menu,
                    newVersion.table, newVersion.discount
                )
            } else {
                if (newVersion.product > currentDataVersion.product) {
                    yield put(syncProductFromNetwork())
                    yield put(syncMenuFromNetwork())
                } else if (newVersion.menu > currentDataVersion.menu) {
                    yield put(syncMenuFromNetwork())
                    yield put(syncProductFromNetwork())
                } else if (newVersion.discount > currentDataVersion.discount) {
                    yield put(getSaleCampain())
                    yield put(syncProductFromNetwork())
                    yield put(syncMenuFromNetwork())
                }
                yield put(syncFloorTableFromNetwork())
                yield call(backgroundSyncModel.saveVersion,
                    newVersion.product, newVersion.menu,
                    newVersion.table, newVersion.discount
                )
            }
        } else {
            yield call(fetchAll)
        }
    } catch (err) {
        console.log('requestCheckAndSyncData err', err)
    }
}

export const requestSyncProductAndMenu = function* () {
    try {
        yield put(syncProductFromNetwork())
        yield put(syncMenuFromNetwork())
        const dataVersionRes = yield call(requestGetDataVersion, { type: 'backgroundSync/getDataVersionFromNetwork' })
        const versionArr = chainParse(dataVersionRes, ['updated', 'result'])
        if (!versionArr || versionArr.length == 0) return
        const newVersion = _getVersionObj(versionArr)
        yield call(backgroundSyncModel.saveVersion,
            newVersion.product, newVersion.menu,
            newVersion.table, newVersion.discount
        )
    } catch (err) {
        console.log('requestSyncProductAndMenu err', err)
    }
}

const executeInterval = function () {
    console.log('executeInterval', new Date().getTime())
    store.dispatch(syncOrder())
    store.dispatch(syncTable())
    store.dispatch(checkAndSyncMasterData())
}

const requestStartCheckSyncOrder = function* () {
    syncOrderInterval = yield call(setInterval, executeInterval, SYNC_ORDER_PERIOD)
}

const requestStopCheckSyncOrder = function* () {
    clearInterval(syncOrderInterval)
}

const requestSyncOrderData = function* () {
    yield put(syncOrder())
    yield put(syncTable())

}

export default function* fetchWatcher() {
    yield all([
        takeEvery(ACTION_TYPES.GET_DATA_VERSION, requestGetDataVersion),
        takeEvery(ACTION_TYPES.CHECK_AND_SYNC_MASTER_DATA, requestCheckAndSyncData),
        takeEvery(ACTION_TYPES.START_CHECK_SYNC_ORDER, requestStartCheckSyncOrder),
        takeEvery(ACTION_TYPES.STOP_CHECK_SYNC_ORDER, requestStopCheckSyncOrder),
        takeEvery(ACTION_TYPES.SYNC_ORDER_DATA, requestSyncOrderData),
        takeEvery(ACTION_TYPES.SYNC_PRODUCT_AND_MENU, requestSyncProductAndMenu)
    ])
}