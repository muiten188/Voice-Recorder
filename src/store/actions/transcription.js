import * as ACTION_TYPES from '~/src/store/types'

export const getTranscription = (...args) => ({
    type: ACTION_TYPES.TRANSCRIPTION_GET,
    args
})

export const setTranscription = (data) => ({
    type: ACTION_TYPES.TRANSCRIPTION_SET,
    payload: data
})

export const getExportToken = (...args) => ({
    type: ACTION_TYPES.TRANSCRIPTION_GET_EXPORT_TOKEN,
    args
})

export const exportTranscript = (...args) => ({
    type: ACTION_TYPES.TRANSCRIPTION_EXPORT,
    args
})

export const getTranscriptionSentence = (...args) => ({
    type: ACTION_TYPES.TRANSCRIPTION_SENTENCE_GET,
    args
})

export const setTranscriptionSentence = (data) => ({
    type: ACTION_TYPES.TRANSCRIPTION_SENTENCE_SET,
    payload: data
})