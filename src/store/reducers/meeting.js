import * as ACTION_TYPES from '~/src/store/types'
import { LOCAL_RECORD_STATUS } from '~/src/constants'
import { chainParse } from '~/src/utils'
const initialState = {
    uploading: false,
    meetingData: {},
    category: {}
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

        case ACTION_TYPES.MEETING_SET_CATEGORY: {
            const categoryListResponse = payload
            console.log('meeting list response', categoryListResponse)
            const page = categoryListResponse && categoryListResponse.args && categoryListResponse.args[1] ? categoryListResponse.args[1] : 1
            if (page == 1) {
                return {
                    ...state,
                    category: categoryListResponse
                }
            }
            const currentData = chainParse(state, ['category', 'data']) || []
            const responseData = categoryListResponse.data
            const newData = [...currentData, ...responseData]
            return {
                ...state,
                category: {
                    ...categoryListResponse,
                    data: newData
                }
            }

        }

        case ACTION_TYPES.AUTH_LOGOUT: {
            return initialState
        }

        default:
            return state
    }
}