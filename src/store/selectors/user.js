import { chainParse } from '~/src/utils'
const emptyObj = {}

export const userListSelector = (state) => {
    return chainParse(state, ['user']) || emptyObj
}