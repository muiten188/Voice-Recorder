import { takeEvery, all, takeLatest, put, call, select } from 'redux-saga/effects'

import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { chainParse } from '~/src/utils'
import { setProductReport } from '~/src/store/actions/report'

export const requestGetTransactionReport = createRequestSaga({
    request: api.report.getTransactionReport,
    key: 'report/getTransactionReport',
})

export const requestGetProductReport = createRequestSaga({
    request: api.report.getProductReport,
    key: 'report/getProductReport',
    success: [
        (data) => {
            console.log('Data requestGetProductReport', data)
            if (data && typeof (data.content) != 'undefined') {
                return setProductReport(data)
            }
            return noop('')
        }
    ]
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('report/getTransactionReport', requestGetTransactionReport),
        takeEvery('report/getProductReport', requestGetProductReport),

    ])
}


