import * as ACTION_TYPES from '~/src/store/types'
import { LOCAL_RECORD_STATUS } from '~/src/constants'

const initialState = {
    uploading: false,
    meetingData: {}
}
export default meeting = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ACTION_TYPES.MEETING_SET: {
            const meetingListResponse = payload
            console.log('meeting list response', meetingListResponse)
            const page = meetingListResponse && meetingListResponse.args && meetingListResponse.args[1] ? meetingListResponse.args[1] : 1
            if (page == 1) {
                return {
                    ...state,
                    meetingData: meetingListResponse
                }
            }
            const currentData = chainParse(state, ['meetingData', 'data']) || []
            const responseData = meetingListResponse.data
            const newData = [...currentData, ...responseData]
            return {
                ...state,
                meetingData: {
                    ...meetingListResponse,
                    data: newData
                }
            }

        }

        case ACTION_TYPES.MEETING_SET_UPLOADING: {
            return {
                ...state,
                uploading: payload
            }
        }

        case ACTION_TYPES.AUTH_LOGOUT: {
            return initialState
        }

        default:
            return state
    }
}