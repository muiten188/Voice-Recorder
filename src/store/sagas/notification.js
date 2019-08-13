import { takeEvery, all } from 'redux-saga/effects'

import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { setNumberUnreadNotification, setNotification } from '~/src/store/actions/notification'
import { chainParse } from '~/src/utils'


export const requestGetNotification = createRequestSaga({
    request: api.notification.getNotification,
    key: 'notification/getNotification',
    success: [
        (data) => {
            if (data && data.content) {
                return setNotification(data)
            }
            return noop('')
        }
    ]
})

export const requestMarkReadNotification = createRequestSaga({
    request: api.notification.markReadNotification,
    key: 'notification/markReadNotification',
})

export const requestGetNumberUnreadNotification = createRequestSaga({
    request: api.notification.getNumberUnreadNotification,
    key: 'notification/getNumberUnreadNotification',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result'])
            if (typeof (result) != 'undefined') {
                return setNumberUnreadNotification(result)
            }
            return noop('')
        }
    ]
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('notification/getNotification', requestGetNotification),
        takeEvery('notification/markReadNotification', requestMarkReadNotification),
        takeEvery('notification/getNumberUnreadNotification', requestGetNumberUnreadNotification),
    ])
}


