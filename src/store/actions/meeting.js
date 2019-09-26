import * as ACTION_TYPES from '~/src/store/types'

export const createMeetingUploadUrl = (...args) => ({
    type: ACTION_TYPES.MEETING_CREATE_UPLOAD_URL,
    args
})

export const createMeeting = (...args) => ({
    type: ACTION_TYPES.MEETING_CREATE,
    args
})

export const getMeeting = (...args) => ({
    type: ACTION_TYPES.MEETING_GET,
    args
})

export const deleteMeeting = (...args) => ({
    type: ACTION_TYPES.MEETING_DELETE,
    args
})

export const setMetting = (data) => ({
    type: ACTION_TYPES.MEETING_SET,
    payload: data
})

export const uploadMeetingRecord = () => ({
    type: ACTION_TYPES.MEETING_UPLOAD_RECORD
})

export const startCheckUploadLocalRecord = () => ({
    type: ACTION_TYPES.MEETING_START_CHECK_LOCAL_RECORD
})

export const stopCheckUploadLocalRecord = () => ({
    type: ACTION_TYPES.MEETING_STOP_CHECK_LOCAL_RECORD
})

export const setUploading = (data) => ({
    type: ACTION_TYPES.MEETING_SET_UPLOADING,
    payload: data
})