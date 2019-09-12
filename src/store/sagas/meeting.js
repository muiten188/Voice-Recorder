import { takeLatest, takeEvery, all, select, call, put } from 'redux-saga/effects'
import api from '~/src/store/api'
import { createRequestSaga, handleCommonError } from '~/src/store/sagas/common'
import * as ACTION_TYPES from '~/src/store/types'
import { localRecordSelector } from '~/src/store/selectors/localRecord'
import { updateRecord } from '~/src/store/actions/localRecord'
import { LOCAL_RECORD_STATUS } from '~/src/constants'
import RNFetchBlob from "rn-fetch-blob";
import { getUploadKey, getFileName } from '~/src/utils'

const requestCreateMeetingUploadUrl = createRequestSaga({
    request: api.meeting.createMeetingUploadUrl,
    key: ACTION_TYPES.MEETING_CREATE_UPLOAD_URL,
})

const requestCreateMeeting = createRequestSaga({
    request: api.meeting.createMeeting,
    key: ACTION_TYPES.MEETING_CREATE,
})

const uploadRecordFile = function (record) {
    return new Promise((resolve, reject) => {
        const { localPath, uploadUrl, uploadField } = record
        const originalUploadKey = uploadField.key
        const uplodaKey = getUploadKey(originalUploadKey, localPath)
        console.log('uplodaKey', uplodaKey)
        const fileName = getFileName(localPath)
        console.log('FileName', fileName)
        const uploadBody = [
            { name: 'bucket', data: uploadField['bucket'] },
            { name: 'policy', data: uploadField['policy'] },
            { name: 'x-amz-algorithm', data: uploadField['x-amz-algorithm'] },
            { name: 'x-amz-credential', data: uploadField['x-amz-credential'] },
            { name: 'x-amz-date', data: uploadField['x-amz-date'] },
            { name: 'x-amz-signature', data: uploadField['x-amz-signature'] },
            { name: 'key', data: uplodaKey },
            { name: 'file', filename: fileName, data: RNFetchBlob.wrap(localPath) },
        ]
        console.log('Upload Body', uploadBody)
        console.log('uploadUrl', uploadUrl)
        RNFetchBlob.fetch('POST', uploadUrl, {
            'Content-Type': 'multipart/form-data'
        }, uploadBody)
            .uploadProgress((written, total) => {
                console.log('uploaded progress', written / total)
            })
            .then((resp) => {
                console.log('Upload Resp', resp)
                const textData = resp.text()
                console.log('Text Data', textData)
                resolve(textData)
            }).catch((err) => {
                console.log('Upload err', err)
                reject(err)
            })
    })
}

const requestUploadMeetingRecord = function* () {
    const localRecord = yield select(localRecordSelector)
    console.log('localRecord sagas', localRecord)
    if (!localRecord || localRecord.length == 0) return
    if (localRecord[0].status == LOCAL_RECORD_STATUS.INITIAL) {
        const createMeetingUploadUrlResponse = yield call(api.meeting.createMeetingUploadUrl)
        console.log('createMeetingUploadUrlResponse', createMeetingUploadUrlResponse)
        const hasError = yield call(handleCommonError, createMeetingUploadUrlResponse)
        console.log('Has Error', hasError)
        if (hasError) return
        const result = createMeetingUploadUrlResponse.result
        if (!result || !result[0] || !result[1]) return
        const meetingRecordInfo = {
            localPath: localRecord[0].localPath,
            status: LOCAL_RECORD_STATUS.CREATED_MEETING_URL,
            uploadUrl: result[0],
            uploadField: {
                ...result[1]
            }
        }
        yield put(updateRecord(meetingRecordInfo))
    } else if (localRecord[0].status == LOCAL_RECORD_STATUS.CREATED_MEETING_URL) {
        console.log('Already create upload url')
        yield call(uploadRecordFile, localRecord[0])
    }

}

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery(ACTION_TYPES.MEETING_CREATE_UPLOAD_URL, requestCreateMeetingUploadUrl),
        takeEvery(ACTION_TYPES.MEETING_CREATE, requestCreateMeeting),
        takeLatest(ACTION_TYPES.MEETING_UPLOAD_RECORD, requestUploadMeetingRecord)
    ])
}


