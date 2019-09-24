import * as ACTION_TYPES from '~/src/store/types'

const initialState = {
    transcript: {},
    transcriptSentence: {}
}
export default transcription = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ACTION_TYPES.TRANSCRIPTION_SET: {
            const { meetingId, data } = payload
            if (!meetingId || !data) return state
            const newTranscript = {...state.transcript}
            newTranscript[meetingId] = data
            return {
                ...state,
                transcript: newTranscript
            }
        }

        case ACTION_TYPES.TRANSCRIPTION_SENTENCE_SET: {
            const { meetingId, data } = payload
            if (!meetingId || !data) return state
            const newTranscriptSentence = {...state.transcriptSentence}
            newTranscriptSentence[meetingId] = data
            return {
                ...state,
                transcriptSentence: newTranscriptSentence
            }
        }

        case ACTION_TYPES.AUTH_LOGOUT: {
            return initialState
        }

        default:
            return state
    }
}