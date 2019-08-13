import lodash from 'lodash'
import I18n from '~/src/I18n'
const emptyArray = []
const emptyObj = {}
import { chainParse } from '~/src/utils'
import { PRODUCT_STATUS_VALUES } from '~/src/constants'

export const merchantMenuSelector = (state) => chainParse(state, ['menu', 'menu']) || emptyArray

const getProductMenu = (menuList, menuId) => {
    const currentMenu = menuList.find(item => item.id == menuId)
    if (!currentMenu || !currentMenu.productList) return emptyArray
    return currentMenu.productList
}

export const productMenuSelector = (state, menuId) => {
    const menuList = chainParse(state, ['menu', 'menu']) || emptyArray
    if (!menuList || menuList.length == 0) return emptyArray
    return getProductMenu(menuList, menuId)
}

const getMenuWithMenuAll = lodash.memoize((menu) => {
    return [
        {
            id: '',
            name: I18n.t('all')
        },
        ...menu
    ]
})


export const merchantMenuSelectorWithMenuAll = (state) => {
    const originMenu = chainParse(state, ['menu', 'menu']) || emptyArray
    return getMenuWithMenuAll(originMenu)
}

export const allProductMenuSelector = (state) => chainParse(state, ['menu', 'menu']) || emptyArray

const memoizeActiveProductMenu = lodash.memoize((productMenu) => {
    if (!productMenu || productMenu.length == 0) return emptyArray
    return productMenu.map(item => ({
        ...item,
        productList: item && item.productList ?
            item.productList.filter(item => item.status == PRODUCT_STATUS_VALUES.IN_SALE) : [],
        data: item && item.productList ?
            item.productList.filter(item => item.status == PRODUCT_STATUS_VALUES.IN_SALE) : []
    }))
})

export const activeProductMenuSelector = (state) => {
    const productMenu = chainParse(state, ['menu', 'menu']) || emptyArray
    return memoizeActiveProductMenu(productMenu)
}


export const productMenuSelectorWithoutOther = (state) => {
    const allMenu = chainParse(state, ['menu', 'menu'])
    if (!allMenu || allMenu.length == 0) return emptyArray
    return allMenu.filter(item => !!item.id)
}


const memoizeProductMenu = lodash.memoize((productMenu, allProduct) => {
    const productMenuUpdate = productMenu.map(item => ({ ...item, data: item.productList }))
    const allActiveProduct = allProduct.filter(item => item.status == PRODUCT_STATUS_VALUES.IN_SALE)
    const productMenuActive = productMenuUpdate.map(item => ({
        ...item,
        productList: item && item.productList ?
            item.productList.filter(item => item.status == PRODUCT_STATUS_VALUES.IN_SALE) : [],
        data: item && item.productList ?
            item.productList.filter(item => item.status == PRODUCT_STATUS_VALUES.IN_SALE) : []
    }))

    return [
        {
            id: 1,
            name: I18n.t('all'),
            data: allActiveProduct
        },
        ...productMenuActive
    ]
})

export const productMenuSelectorForSectionList = (state) => {
    const rawMenu = chainParse(state, ['menu', 'menu'])
    const allProduct = chainParse(state, ['product', 'productList', 'content']) || emptyArray
    return memoizeProductMenu(rawMenu, allProduct)
}


const memoizeProductMeneWithoutOther = lodash.memoize((menu) => {
    const indexOfOtherMenu = menu.findIndex(item => !item.id)
    if (indexOfOtherMenu < 0) return menu
    let newMenu = [...menu]
    newMenu.splice(indexOfOtherMenu, 1)
    newMenu = newMenu.filter(item => !!item.name)
    return newMenu
})

export const menuSelectorWithoutOther = (state) => {
    const rawMenu = chainParse(state, ['menu', 'menu'])
    if (!rawMenu || rawMenu.length == 0) return emptyArray
    return memoizeProductMeneWithoutOther(rawMenu)
}

export const singleMenuSelector = (state, menuId) => {
    const menuList = chainParse(state, ['menu', 'menu']) || emptyArray
    if (!menuList || menuList.length == 0) return emptyObj
    const currentMenu = menuList.find(item => item.id == menuId)
    return currentMenu
}

export const tempMenuProductSelector = (state) => chainParse(state, ['menu', 'tempMenuProduct']) || emptyArray