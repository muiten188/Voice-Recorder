import { chainParse } from '~/src/utils'
export const localRecordSelector = state => chainParse(state, ['localRecord'])