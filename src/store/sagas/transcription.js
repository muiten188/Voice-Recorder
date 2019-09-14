import { takeLatest, takeEvery, all, select, call, put } from 'redux-saga/effects'
import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import * as ACTION_TYPES from '~/src/store/types'
import { setTranscription } from '~/src/store/actions/transcription'
import { chainParse } from '~/src/utils'

const requestGetTranscription = createRequestSaga({
    request: api.transcription.getTranscription,
    key: ACTION_TYPES.TRANSCRIPTION_GET,
    // success: [
    //     (data) => {
    //         const statusCode = chainParse(data, ['httpHeaders', 'status'])
    //         if (statusCode == 200) {
    //             return setTranscription(data)
    //         }
    //         return noop('')
    //     }
    // ]
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery(ACTION_TYPES.TRANSCRIPTION_GET, requestGetTranscription)
    ])
}


