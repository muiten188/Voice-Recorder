import { chainParse } from '~/src/utils'
import lodash from 'lodash'

const emptyArray = []
const emptyObj = {}

export const topProductSelector = (state) => chainParse(state, ['report', 'topProduct']) || emptyObj

export const topProductListSelector = (state) => chainParse(state, ['report', 'topProduct', 'content']) || emptyArray