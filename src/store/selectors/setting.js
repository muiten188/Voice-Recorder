import { chainParse } from '~/src/utils'

export const enablePrintSelector = state => chainParse(state, ['setting', 'ENABLE_PRINT'])