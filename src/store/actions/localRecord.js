import * as ACTION_TYPES from '~/src/store/types'
export const addRecord = (filePath, categoryId = '') => ({
    type: ACTION_TYPES.RECORD_ADD,
    payload: { filePath, categoryId }
})


export const updateRecord = (recordMeeting) => ({
    type: ACTION_TYPES.RECORD_UPDATE,
    payload: recordMeeting
})

export const deleteRecord = (filePath) => ({
    type: ACTION_TYPES.RECORD_DELETE,
    payload: filePath
})
