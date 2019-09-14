import * as ACTION_TYPES from '~/src/store/types'

export const getTranscription = (...args) => ({
    type: ACTION_TYPES.TRANSCRIPTION_GET,
    args
})

export const setTranscription = (data) => ({
    type: ACTION_TYPES.TRANSCRIPTION_SET,
    payload: data
})