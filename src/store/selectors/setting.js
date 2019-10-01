import { chainParse } from '~/src/utils'
const emptyObj = {}

export const settingSelector = state => chainParse(state, ['setting']) || emptyObj