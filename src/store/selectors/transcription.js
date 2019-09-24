import { chainParse } from '~/src/utils'
import lodash from 'lodash'

const emptyArray = []
const emptyObj = {}

export const transcriptionListSelector = (state) => chainParse(state, ['transcription']) || emptyObj

export const transcriptionSelector = (state, meetingId) => chainParse(state, ['transcription', 'transcript', meetingId]) || emptyObj
export const transcriptionSentenceSelector = (state, meetingId) => chainParse(state, ['transcription', 'transcriptSentence', meetingId]) || emptyArray