import * as ACTION_TYPES from '~/src/store/types'
import { LOCAL_RECORD_STATUS } from '~/src/constants'

const initialState = {}
export default meeting = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ACTION_TYPES.MEETING_SET: {
            const meetingListResponse = payload
            console.log('meeting list response', meetingListResponse)
            if (meetingListResponse.next_page == 2) {
                return meetingListResponse
            }
            return {
                ...meetingListResponse,
                data: [...state.data, ...meetingListResponse.data]
            }

        }

        case ACTION_TYPES.AUTH_LOGOUT: {
            return initialState
        }

        default:
            return state
    }
}