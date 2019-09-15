import * as ACTION_TYPES from '~/src/store/types'

const initialState = {}
export default transcription = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ACTION_TYPES.TRANSCRIPTION_SET: {
            const { meetingId, data } = payload
            if (!meetingId || !data) return state
            const newState = {...state}
            newState[meetingId] = data
            return newState
        }

        case ACTION_TYPES.AUTH_LOGOUT: {
            return initialState
        }

        default:
            return state
    }
}