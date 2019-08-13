import { takeEvery, all, call, take, put } from 'redux-saga/effects';
import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { setMerchantMenu, syncMenuFromDBToRedux } from '~/src/store/actions/menu'
import { chainParse } from '~/src/utils'
import menuModel from '~/src/db/menu'


/* Menu */
export const requestGetMerchantMenu = createRequestSaga({
    request: api.merchant.getMerchantMenu,
    key: 'menu/getMerchantMenu',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result'])
            if (result) {
                return setMerchantMenu(result)
            }
            return noop('')
        }
    ]
})

export const requestCreateMerchantMenu = createRequestSaga({
    request: api.merchant.createMerchantMenu,
    key: 'menu/createMerchantMenu'
})

export const requestRemoveMerchantMenu = createRequestSaga({
    request: api.merchant.removeMerchantMenu,
    key: 'menu/removeMerchantMenu'
})

const requestGetMenuProduct = createRequestSaga({
    request: api.merchant.getMerchantMenuProduct,
    key: 'menu/getMerchantMenuProduct'
})

const requestSyncMenuFromNetwork = function* () {
    try {
        const menuProductResponse = yield call(requestGetMenuProduct, { type: 'menu/getMerchantMenuProduct' })
        console.log('menuProductResponse', menuProductResponse)
        const menuResult = chainParse(menuProductResponse, ['updated', 'result'])
        console.log('menuResult', menuResult)
        const httpStatus = chainParse(menuProductResponse, ['httpHeaders', 'status'])
        if (httpStatus != 200) return
        yield call(menuModel.saveMenuProduct, menuResult)
        yield put(syncMenuFromDBToRedux())
    } catch (e) {
        console.log('requestSyncMenuFromNetwork err', e)
    }
}

const requestSyncMenuFromDBToRedux = function* () {
    try {
        console.log('requestSyncMenuFromDBToRedux')
        const menuProductDB = yield call(menuModel.getMenuProduct)
        console.log('menuProductDB', menuProductDB)
        yield put(setMerchantMenu(menuProductDB))
    } catch (e) {
        console.log('requestSyncMenuFromDBToRedux err', e)
    }
}

const requestUpdateOrdinalProductMenu = createRequestSaga({
    request: api.merchant.updateOrdinalProductMenu,
    key: 'menu/updateOrdinalProductMenu'
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('menu/createMerchantMenu', requestCreateMerchantMenu),
        takeEvery('menu/removeMerchantMenu', requestRemoveMerchantMenu),
        takeEvery('menu/syncMenuFromNetwork', requestSyncMenuFromNetwork),
        takeEvery('menu/getMerchantMenu', requestGetMerchantMenu),
        takeEvery('menu/syncMenuFromDBToRedux', requestSyncMenuFromDBToRedux),
        takeEvery('menu/updateOrdinalProductMenu', requestUpdateOrdinalProductMenu)
    ])
}


