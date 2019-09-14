import { chainParse } from '~/src/utils'
import lodash from 'lodash'

const emptyArray = []
const emptyObj = {}

export const transcriptionListSelector = (state) => chainParse(state, ['transcription']) || emptyObj