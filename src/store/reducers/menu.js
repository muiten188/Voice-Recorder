import { chainParse } from '~/src/utils'
const initialState = {
    menu: [],
    tempMenuProduct: [],
}

export const menu = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'menu/setMerchantMenu':
            return {
                ...state,
                menu: payload
            }
        case 'menu/setTempMenuProduct': {
            console.log('menu/setTempMenuProduct', payload)
            return {
                ...state,
                tempMenuProduct: payload
            }
        }
        case 'app/logout': {
            return initialState
        }
        default:
            return state
    }
}