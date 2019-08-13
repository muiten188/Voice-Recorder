// Merchant Menu

export const getMerchantMenu = (...args) => ({
    type: 'menu/getMerchantMenu',
    args
})

export const setMerchantMenu = (data) => ({
    type: 'menu/setMerchantMenu',
    payload: data
})

export const createMerchantMenu = (...args) => ({
    type: 'menu/createMerchantMenu',
    args
})

export const removeMerchantMenu = (...args) => ({
    type: 'menu/removeMerchantMenu',
    args
})

export const syncMenuFromNetwork = () => ({
    type: 'menu/syncMenuFromNetwork',
})

export const syncMenuFromDBToRedux = () => ({
    type: 'menu/syncMenuFromDBToRedux'
})

export const setTempMenuProduct = (data) => ({
    type: 'menu/setTempMenuProduct',
    payload: data
})

export const updateOrdinalProductMenu = (...args) => ({
    type: 'menu/updateOrdinalProductMenu',
    args
})