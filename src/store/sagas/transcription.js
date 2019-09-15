import { takeLatest, takeEvery, all, select, call, put } from 'redux-saga/effects'
import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import * as ACTION_TYPES from '~/src/store/types'
import { setTranscription } from '~/src/store/actions/transcription'
import { chainParse } from '~/src/utils'

const requestGetTranscription = createRequestSaga({
    request: api.transcription.getTranscription,
    key: ACTION_TYPES.TRANSCRIPTION_GET,
    success: [
        (data) => {
            const statusCode = chainParse(data, ['httpHeaders', 'status'])
            if (statusCode == 200) {
                const meetingId = data.args[0]
                // Load single meeting transcription
                if (meetingId) {
                    return setTranscription({
                        meetingId,
                        data: data.data && data.data[0] ? data.data[0] : false
                    })
                }
                return noop

            }
            return noop('')
        }
    ]
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery(ACTION_TYPES.TRANSCRIPTION_GET, requestGetTranscription)
    ])
}


