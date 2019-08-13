import { chainParse } from '~/src/utils'

const emptyArray = []
const emptyObj = {}

export const supplierListSelector = (state) => chainParse(state, ['supplier', 'supplierList']) || emptyObj