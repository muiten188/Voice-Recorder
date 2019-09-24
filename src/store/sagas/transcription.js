import { takeLatest, takeEvery, all, select, call, put } from 'redux-saga/effects'
import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import * as ACTION_TYPES from '~/src/store/types'
import { setTranscription, setTranscriptionSentence } from '~/src/store/actions/transcription'
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
                console.log('Transcription data', data)
                if (meetingId) {
                    return setTranscription({
                        meetingId,
                        data: data.data && data.data[0] ? data.data[0] : ''
                    })
                }
                return noop

            }
            return noop('')
        }
    ]
})


const requestGetExportToken = createRequestSaga({
    request: api.transcription.getExportToken,
    key: ACTION_TYPES.TRANSCRIPTION_GET_EXPORT_TOKEN,
})

const requestExportTranscript = createRequestSaga({
    request: api.transcription.exportTranscript,
    key: ACTION_TYPES.TRANSCRIPTION_EXPORT,
})

const requestGetTranscriptionSentence = createRequestSaga({
    request: api.transcription.getTranscriptionBySentence,
    key: ACTION_TYPES.TRANSCRIPTION_GET,
    success: [
        (data) => {
            const statusCode = chainParse(data, ['httpHeaders', 'status'])
            if (statusCode == 200) {
                const meetingId = data.args[0]
                // Load single meeting transcription
                console.log('Transcription Senten data', data)
                if (meetingId) {
                    return setTranscriptionSentence({
                        meetingId,
                        data: data.data
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
        takeEvery(ACTION_TYPES.TRANSCRIPTION_GET, requestGetTranscription),
        takeEvery(ACTION_TYPES.TRANSCRIPTION_GET_EXPORT_TOKEN, requestGetExportToken),
        takeEvery(ACTION_TYPES.TRANSCRIPTION_EXPORT, requestExportTranscript),
        takeEvery(ACTION_TYPES.TRANSCRIPTION_SENTENCE_GET, requestGetTranscriptionSentence),
    ])
}


