import { takeEvery, all, select, call, put } from 'redux-saga/effects'
import { Platform } from 'react-native'
import api from '~/src/store/api'
import { createRequestSaga, handleCommonError } from '~/src/store/sagas/common'
import * as ACTION_TYPES from '~/src/store/types'
import { localRecordSelector } from '~/src/store/selectors/localRecord'
import { isUploadingMeetingSelector } from '~/src/store/selectors/meeting'
import { appStateSelector } from '~/src/store/selectors/info'
import { noop } from '~/src/store/actions/common'
import { updateRecord, deleteRecord } from '~/src/store/actions/localRecord'
import { setMetting, getMeeting, setUploading, uploadMeetingRecord } from '~/src/store/actions/meeting'
import { LOCAL_RECORD_STATUS, FOREGROUND_NOTIFICATION_ID } from '~/src/constants'
import RNFetchBlob from 'rn-fetch-blob'
import { getUploadKey, getFileName, replacePatternString,
    chainParse, startForegroundService, stopForegroundService
} from '~/src/utils'
import { store } from '~/src/store/configStore'
import PushNotification from 'react-native-push-notification'
import I18n from '~/src/I18n'

const requestCreateMeetingUploadUrl = createRequestSaga({
    request: api.meeting.createMeetingUploadUrl,
    key: ACTION_TYPES.MEETING_CREATE_UPLOAD_URL,
})

const requestCreateMeeting = createRequestSaga({
    request: api.meeting.createMeeting,
    key: ACTION_TYPES.MEETING_CREATE,
})

const requestGetMeeting = createRequestSaga({
    request: api.meeting.getMeeting,
    key: ACTION_TYPES.MEETING_GET,
    success: [
        (data) => {
            const statusCode = chainParse(data, ['httpHeaders', 'status'])
            if (statusCode == 200) {
                return setMetting(data)
            }
            return noop('')
        }
    ]
})

const requestDeleteMeeting = createRequestSaga({
    request: api.meeting.deleteMeeting,
    key: ACTION_TYPES.MEETING_DELETE,
})

const _createMeetingUploadUrl = function* (record) {
    try {
        if (record.status != LOCAL_RECORD_STATUS.INITIAL) return record
        const createMeetingUploadUrlResponse = yield call(api.meeting.createMeetingUploadUrl)
        console.log('createMeetingUploadUrlResponse', createMeetingUploadUrlResponse)
        const hasError = yield call(handleCommonError, createMeetingUploadUrlResponse)
        console.log('Has Error createMeetingUploadUrlResponse', hasError)
        if (hasError) return record
        const result = createMeetingUploadUrlResponse.result
        if (!result || !result[0] || !result[1]) return record
        const meetingRecordInfo = {
            localPath: record.localPath,
            status: LOCAL_RECORD_STATUS.CREATED_MEETING_URL,
            uploadUrl: result[0],
            uploadField: {
                ...result[1]
            }
        }
        yield put(updateRecord(meetingRecordInfo))
        return {
            ...record,
            ...meetingRecordInfo
        }
    } catch (err) {
        console.log('_createMeetingUploadUrl err', err)
        return record
    }
}

const _upload = function (record) {
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
                console.log('uploaded progress', written, total, written / total)
                const progress = written / total * 100
                store.dispatch(updateRecord({
                    localPath: record.localPath,
                    progress
                }))
            })
            .then((resp) => {
                console.log('Upload Resp', resp)
                resolve(resp.respInfo)
            }).catch((err) => {
                console.log('Upload err', err)
                reject(false)
            })
    })
}

const _uploadRercordFile = function* (record) {
    console.log('Already create upload url')
    if (record.status != LOCAL_RECORD_STATUS.CREATED_MEETING_URL) return record
    try {
        const isExists = yield call(RNFetchBlob.fs.exists, record.localPath)
        console.log('isExists', isExists)
        if (!isExists) {
            yield put(deleteRecord(record.localPath))
            return false
        }
        const fileName = getFileName(record.localPath)
        yield call(startForegroundService, FOREGROUND_NOTIFICATION_ID.UPLOAD, replacePatternString(I18n.t('uploading_noti'), fileName))
        const uploadResponseHeader = yield call(_upload, record)
        console.log('respHeader', uploadResponseHeader)
        // Upload success
        if (uploadResponseHeader.status >= 200 && uploadResponseHeader.status < 300) {
            const meetingRecordInfo = {
                localPath: record.localPath,
                status: LOCAL_RECORD_STATUS.UPLOADED,
            }
            yield put(updateRecord(meetingRecordInfo))
            yield call(stopForegroundService)
            return {
                ...record,
                ...meetingRecordInfo
            }
        }
        yield call(stopForegroundService)
        return record
    } catch (error) {
        yield call(stopForegroundService)
        console.log('_uploadRercordFile catch', error, record)
        return record
    }
}

const _createMeeting = function* (record) {
    try {
        if (record.status != LOCAL_RECORD_STATUS.UPLOADED) return false
        const { uploadField, localPath } = record
        const originalUploadKey = uploadField.key
        const uplodaKey = getUploadKey(originalUploadKey, localPath)
        const name = getFileName(localPath)
        const createMeetingResponse = yield call(api.meeting.createMeeting, uplodaKey, name, 2)
        console.log('createMeetingResponse response', createMeetingResponse)
        const hasError = yield call(handleCommonError, createMeetingResponse)
        console.log('Has Error createMeetingResponse', hasError)
        if (hasError) return false
        // Create meeting success
        if (chainParse(createMeetingResponse, ['httpHeaders', 'status']) == 200) {
            yield put(deleteRecord(record.localPath))
            yield put(getMeeting())
            return true
        } else {
            yield put(updateRecord({
                localPath: record.localPath,
                status: LOCAL_RECORD_STATUS.INITIAL
            }))
            return false
        }
    } catch (err) {
        console.log('_createMeeting', err)
        return false
    }
}

const requestUploadMeetingRecord = function* () {
    const isUploading = yield select(isUploadingMeetingSelector)
    console.log('isUploading', isUploading)
    if (isUploading) return
    const localRecord = yield select(localRecordSelector)
    console.log('localRecord sagas', localRecord)
    if (!localRecord || localRecord.length == 0) return
    yield put(setUploading(true))
    for (let i = 0; i < localRecord.length; i++) {
        let record = localRecord[i]
        // only record not became to a meeting
        if (record.status == LOCAL_RECORD_STATUS.MEETING_CREATED) continue
        record = yield call(_createMeetingUploadUrl, record)
        if (!record) continue
        record = yield call(_uploadRercordFile, record)
        if (!record) continue
        const isCreateMeetingSuccess = yield call(_createMeeting, record)
        const appState = yield select(appStateSelector)
        if (isCreateMeetingSuccess && appState != 'active') {
            PushNotification.localNotification({
                title: I18n.t('notification'),
                message: replacePatternString(I18n.t('noti_upload_success'), record.name), // (required)
            })
        }

    }
    yield put(setUploading(false))
    const reCheckLocalRecord = yield select(localRecordSelector)
    console.log('reCheckLocalRecord', reCheckLocalRecord)
    if (reCheckLocalRecord && reCheckLocalRecord.length > 0) {
        yield put(uploadMeetingRecord())
    }
}

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery(ACTION_TYPES.MEETING_CREATE_UPLOAD_URL, requestCreateMeetingUploadUrl),
        takeEvery(ACTION_TYPES.MEETING_CREATE, requestCreateMeeting),
        takeEvery(ACTION_TYPES.MEETING_GET, requestGetMeeting),
        takeEvery(ACTION_TYPES.MEETING_UPLOAD_RECORD, requestUploadMeetingRecord),
        takeEvery(ACTION_TYPES.MEETING_DELETE, requestDeleteMeeting)
    ])
}


