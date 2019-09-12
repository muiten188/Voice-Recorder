import * as ACTION_TYPES from '~/src/store/types'
import { LOCAL_RECORD_STATUS } from '~/src/constants'

const initialState = []
export default localRecord = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ACTION_TYPES.RECORD_ADD: {
            const filePath = payload
            console.log('Payload add record', payload)
            const newState = [...state]
            newState.push({
                localPath: filePath,
                status: LOCAL_RECORD_STATUS.INITIAL
            })
            return newState
        }

        case ACTION_TYPES.RECORD_UPDATE: {
            const recordMeetingInfo = payload
            if (!recordMeetingInfo.localPath) return state
            console.log('recordMeetingInfo', recordMeetingInfo)
            const newState = [...state]
            const localRecordIndex = newState.findIndex(item => item.localPath == recordMeetingInfo.localPath)
            if (localRecordIndex < 0) return state
            newState[localRecordIndex] = recordMeetingInfo
            return newState
        }

        default:
            return state
    }
}