import { chainParse } from '~/src/utils'
import lodash from 'lodash'

const emptyArray = []
const emptyObj = {}

export const orderListSelector = (state) => chainParse(state, ['order', 'orderList'])

export const orderTabSelector = (state) => chainParse(state, ['order', 'orderTab'])

export const orderOnlineTabSelector = (state) => chainParse(state, ['order', 'orderOnlineTab'])

export const orderOfflineTabSelector = (state) => chainParse(state, ['order', 'orderOfflineTab'])



export const orderCartSelector = (state) => {
    const orderCart = chainParse(state, ['order', 'orderInfo', 'orderCart'])
    if (!orderCart || orderCart.length == 0) return emptyArray
    return orderCart.filter(product => +product.qty > 0)
}

export const orderCartInfoSelector = (state) => {
    return chainParse(state, ['order', 'orderInfo']) || emptyObj
}

export const orderCartDiscountSelector = (state) => +chainParse(state, ['order', 'orderInfo', 'discountAmount'])

export const totalCartProductNumberSelector = (state) => {
    const orderCart = chainParse(state, ['order', 'orderInfo', 'orderCart'])
    if (!orderCart || orderCart.length == 0) return 0
    return orderCart.map(item => item.qty).reduce((a, b) => a + b, 0)
}

export const cartNoteSelector = (state) => chainParse(state, ['order', 'orderInfo', 'cartNote']) || ''

export const waitingOrderSelector = (state) => chainParse(state, ['order', 'waitingOrderList']) || emptyObj

export const waitingOrderSearchParamSelector = (state) => chainParse(state, ['order', 'waitingOrderSearchParam']) || emptyObj

export const waitingOrderSearchResultSelector = (state) => chainParse(state, ['order', 'waitingOrderSearchResult']) || emptyObj

export const paidOrderSelector = (state) => chainParse(state, ['order', 'paidOrderList']) || emptyObj

export const paidOrderSearchParamSelector = (state) => chainParse(state, ['order', 'paidOrderSearchParam']) || emptyObj

export const paidOrderSearchResultSelector = (state) => chainParse(state, ['order', 'paidOrderSearchResult']) || emptyObj