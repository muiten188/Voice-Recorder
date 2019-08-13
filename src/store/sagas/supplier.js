import { takeEvery, all, put, call, select } from 'redux-saga/effects'
import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { setListSupplier } from '~/src/store/actions/supplier'
import { chainParse } from '~/src/utils'

export const requestGetListSupplier = createRequestSaga({
    request: api.supplier.getListSupplier,
    key: 'supplier/getListSupplier',
    success: [
        (data) => {
            const content = chainParse(data, ['content'])
            if (content) {
                return setListSupplier(data)
            }
            return noop('')
        }
    ]
})

export const requestSaveSupplier = createRequestSaga({
    request: api.supplier.saveSupplier,
    key: 'supplier/saveSupplier',
})

export const requestDeleteSupplier = createRequestSaga({
    request: api.supplier.deleteSupplier,
    key: 'supplier/deleteSupplier'
})
export const requestSearchSupplier = createRequestSaga({
    request:api.supplier.searchSupplier,
    key:'supplier/searchSupplier',
    success: [
        (data) => {
            const content = chainParse(data, ['content'])
            if (content) {
                return setListSupplier(data)
            }
            return noop('')
        }
    ]
})
// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('supplier/getListSupplier', requestGetListSupplier),
        takeEvery('supplier/saveSupplier', requestSaveSupplier),
        takeEvery('supplier/deleteSupplier', requestDeleteSupplier),
        takeEvery('supplier/searchSupplier',requestSearchSupplier)
    ])
}


