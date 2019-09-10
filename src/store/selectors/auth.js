import { chainParse } from '~/src/utils'
import lodash from 'lodash'

const emptyArray = []
const emptyObj = {}

export const userInfoSelector = lodash.memoize((state) => {
    return chainParse(state, ['auth']) || emptyObj
})

export const accessTokenSelector = (state) => chainParse(state, ['auth', 'accessToken'])