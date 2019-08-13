import { chainParse } from '~/src/utils'
import lodash from 'lodash'

const emptyArray = []
const emptyObj = {}

export const userInfoSelector = lodash.memoize((state) => {
    const auth = chainParse(state, ['auth'])
    if (!auth) return emptyObj
    const { 'access-token': accessTokenBody, accessToken, ...rest } = auth
    return rest
})

export const accessTokenSelector = (state) => chainParse(state, ['auth', 'accessToken'])