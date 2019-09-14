import * as ACTION_TYPES from '~/src/store/types'

const initialState = {}
export default transcription = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ACTION_TYPES.MEETING_SET: {
            const transcriptionListResponse = payload
            return transcriptionListResponse
        }

        default:
            return state
    }
}