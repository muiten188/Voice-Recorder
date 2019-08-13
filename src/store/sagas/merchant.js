import { takeEvery, all, call } from 'redux-saga/effects';

import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { setDeliveryMethod, setListMerchant, setCategory, setStaffList, setFloorTable } from '~/src/store/actions/merchant'
import { chainParse } from '~/src/utils'

export const requestGetListMerchant = createRequestSaga({
    request: api.merchant.getListMerchant,
    key: 'merchant/getListMerchant',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result'])
            if (result) {
                return setListMerchant(result)
            }
            return noop('')
        }
    ]
})

export const requestGetDeliveryMethod = createRequestSaga({
    request: api.merchant.getDeliveryMethod,
    key: 'merchant/getDeliveryMethod',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result'])
            if (result) {
                return setDeliveryMethod(result)
            }
            return noop('')
        }
    ]
})

export const requestGenerateMerchantId = createRequestSaga({
    request: api.merchant.generateMerchantId,
    key: 'merchant/generateMerchantId',
})

export const requestCreateMerchant = createRequestSaga({
    request: api.merchant.createMerchant,
    key: 'merchant/createMerchant',
})

export const requestRemoveMerchant = createRequestSaga({
    request: api.merchant.removeMerchant,
    key: 'merchant/removeMerchant',
})

export const requestGetCategory = createRequestSaga({
    request: api.merchant.getCategory,
    key: 'merchant/getCategory',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result'])
            if (result) {
                return setCategory(result)
            }
            return noop('')
        }
    ]
})

export const requestAddStaff = createRequestSaga({
    request: api.merchant.addStaff,
    key: 'merchant/addStaff',
})
export const requestUpdateStaff = createRequestSaga({
    request:api.merchant.updateStaff,
    key:'merchant/update-staff'
})

export const requestRemoveStaff = createRequestSaga({
    request: api.merchant.removeStaff,
    key: 'merchant/removeStaff',
})


export const requestGetStaffList = createRequestSaga({
    request: api.merchant.getStaffList,
    key: 'merchant/getStaffList',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result'])
            if (result) {
                return setStaffList(result)
            }
            return noop('')
        }
    ]
})

/* Floor Table */

export const requestGetFloorTable = createRequestSaga({
    request: api.merchant.getFloorTable,
    key: 'merchant/getFloorTable',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result'])
            if (result) {
                return setFloorTable(result)
            }
            return noop('')
        }
    ]
})

export const requestCreateFloorTable = createRequestSaga({
    request: api.merchant.createFloorTable,
    key: 'merchant/createFloorTable',
})

export const requestRemoveFloorTable = createRequestSaga({
    request: api.merchant.removeFloorTable,
    key: 'merchant/removeFloorTable'
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('merchant/getListMerchant', requestGetListMerchant),
        takeEvery('merchant/getDeliveryMethod', requestGetDeliveryMethod),
        takeEvery('merchant/generateMerchantId', requestGenerateMerchantId),
        takeEvery('merchant/createMerchant', requestCreateMerchant),
        takeEvery('merchant/removeMerchant', requestRemoveMerchant),
        takeEvery('merchant/getCategory', requestGetCategory),
        takeEvery('merchant/getStaffList', requestGetStaffList),
        takeEvery('merchant/addStaff', requestAddStaff),
        takeEvery('merchant/update-staff', requestUpdateStaff),
        takeEvery('merchant/removeStaff', requestRemoveStaff),
        takeEvery('merchant/getFloorTable', requestGetFloorTable),
        takeEvery('merchant/createFloorTable', requestCreateFloorTable),
        takeEvery('merchant/removeFloorTable', requestRemoveFloorTable),

    ])
}


