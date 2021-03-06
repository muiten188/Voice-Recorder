import * as ACTION_TYPES from '~/src/store/types'
import { LOCAL_RECORD_STATUS } from '~/src/constants'
import { getFileName } from '~/src/utils'

const initialState = []
export default localRecord = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ACTION_TYPES.RECORD_ADD: {
            console.log('Payload RECORD_ADD', payload)
            const { filePath, categoryId } = payload
            const newState = [...state]
            const indexOfFile = newState.findIndex(item => item.localPath == filePath)
            if (indexOfFile > 0) return state
            const now = new Date().getTime()
            newState.push({
                localPath: filePath,
                status: LOCAL_RECORD_STATUS.INITIAL,
                categoryId,
                create_time: Math.floor(now / 1000),
                id: Math.floor(now),
                name: getFileName(filePath),
                progress: 1
            })
            return newState
        }

        case ACTION_TYPES.RECORD_UPDATE: {
            const recordMeetingInfo = payload
            if (!recordMeetingInfo.localPath) return state
            const newState = [...state]
            const localRecordIndex = newState.findIndex(item => item.localPath == recordMeetingInfo.localPath)
            if (localRecordIndex < 0) return state
            newState[localRecordIndex] = {
                ...newState[localRecordIndex],
                ...recordMeetingInfo
            }
            return newState
        }

        case ACTION_TYPES.RECORD_DELETE: {
            const localPath = payload
            const newState = [...state]
            const localRecordIndex = newState.findIndex(item => item.localPath == localPath)
            if (localRecordIndex < 0) return state
            newState.splice(localRecordIndex, 1)
            return newState
        }

        case ACTION_TYPES.AUTH_LOGOUT: {
            return initialState
        }

        default:
            return state
    }
}