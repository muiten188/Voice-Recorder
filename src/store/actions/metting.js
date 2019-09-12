import * as ACTION_TYPES from '~/src/store/types'

export const createMeetingUploadUrl = (...args) => ({
    type: ACTION_TYPES.MEETING_CREATE_UPLOAD_URL,
    args
})

export const createMeeting = (...args) => ({
    type: ACTION_TYPES.MEETING_CREATE,
    args
})