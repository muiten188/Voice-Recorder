import { chainParse } from '~/src/utils'
import lodash from 'lodash'

const emptyArray = []
const emptyObj = {}

export const productCategorySelector = (state) => chainParse(state, ['product', 'category']) || emptyArray

export const productListSelector = (state) => chainParse(state, ['product', 'productList']) || emptyObj

export const discountProductListSelector = (state) => chainParse(state, ['product', 'discountProductList']) || emptyObj

export const saleCampainSelector = (state) => chainParse(state, ['product', 'saleCampain']) || []

export const allProductSelector = (state) => chainParse(state, ['product', 'productList', 'content']) || emptyArray