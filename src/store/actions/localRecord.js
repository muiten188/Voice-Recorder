import * as ACTION_TYPES from '~/src/store/types'
export const addRecord = (filePath) => ({
    type: ACTION_TYPES.RECORD_ADD,
    payload: filePath
})


export const updateRecord = (recordMeeting) => ({
    type: ACTION_TYPES.RECORD_UPDATE,
    payload: recordMeeting
})
