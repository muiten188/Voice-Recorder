import { takeLatest, takeEvery, all } from 'redux-saga/effects'

import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { saveUserData } from '~/src/store/actions/auth'

export const requestGetListProvince = createRequestSaga({
    request: api.address.getListProvince,
    key: 'address/getListProvince',
})

export const requestGetListDistrict = createRequestSaga({
    request: api.address.getListDistrict,
    key: 'address/getListDistrict',
})

export const requestGetListWard = createRequestSaga({
    request: api.address.getListWard,
    key: 'address/getListWard',
})



// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('address/getListProvince', requestGetListProvince),
        takeEvery('address/getListDistrict', requestGetListDistrict),
        takeEvery('address/getListWard', requestGetListWard)
    ])
}


