import { takeEvery, all, takeLatest, put, call, select } from 'redux-saga/effects'

import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { chainParse } from '~/src/utils'

export const requestImportQRCode = createRequestSaga({
    request: api.qrCode.importQRCode,
    key: 'qr/importQRCode',
})

export const requestGenerateQRCode = createRequestSaga({
    request: api.qrCode.generateQRCode,
    key: 'qr/generateQRCode',
})

export const requestDeleteQRCode = createRequestSaga({
    request: api.qrCode.deleteQRCode,
    key: 'qr/deleteQRCode',
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('qr/importQRCode', requestImportQRCode),
        takeEvery('qr/generateQRCode', requestGenerateQRCode),
        takeEvery('qr/deleteQRCode', requestDeleteQRCode)
    ])
}


