import * as ACTION_TYPES from '~/src/store/types'
import { LOCAL_RECORD_STATUS } from '~/src/constants'

const initialState = {}
export default meeting = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ACTION_TYPES.MEETING_SET: {
            const meetingListResponse = payload
            return meetingListResponse
        }

        case ACTION_TYPES.AUTH_LOGOUT: {
            return initialState
        }
        
        default:
            return state
    }
}