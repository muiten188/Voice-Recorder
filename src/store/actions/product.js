export const getCategory = (...args) => ({
    type: 'product/getCategory',
    args
})

export const setCategory = (data) => ({
    type: 'product/setCategory',
    payload: data
})

export const getAttribute = (...args) => ({
    type: 'product/getAttribute',
    args
})

export const generateProductId = (...args) => ({
    type: 'product/generateProductId',
    args
})

export const getProductList = (...args) => ({
    type: 'product/getProductList',
    args
})

export const setProductList = (data) => ({
    type: 'product/setProductList',
    payload: data
})

export const setProductListFromDB = (data) => ({
    type: 'product/setProductListFromDB',
    payload: data
})

export const syncProductListFromDBToRedux = (...args) => ({
    type: 'product/syncProductListFromDBToRedux',
    args
})

export const syncProductFromNetwork = (resync = false) => ({ type: 'product/syncProductFromNetwork' })

export const createProduct = (...args) => ({
    type: 'product/createProduct',
    args
})

export const updateProduct = (...args) => ({
    type: 'product/updateProduct',
    args
})

export const removeProduct = (...args) => ({
    type: 'product/removeProduct',
    args
})

export const createSaleCampain = (...args) => ({
    type: 'product/createSaleCampain',
    args
})

export const deleteSaleCampain = (...args) => ({
    type: 'product/deleteSaleCampain',
    args
})

export const getProductListDiscount = (...args) => ({
    type: 'product/getProductListDiscount',
    args
})

export const setProductListDiscount = (data) => ({
    type: 'product/setProductListDiscount',
    payload: data
})

export const getSaleCampain = (...args) => ({
    type: 'product/getSaleCampain',
    args
})

export const setSaleCampain = (data) => ({
    type: 'product/setSaleCampain',
    payload: data
})


export const getProductDetail = (...args) => ({
    type: 'product/getProductDetail',
    args
})

export const addProductToMenu = (...args) => ({
    type: 'product/addProductToMenu',
    args
})

export const removeProductFromMenu = (...args) => ({
    type: 'product/removeProductFromMenu',
    args
})

export const getProductByMenu = (...args) => ({
    type: 'product/getProductByMenu',
    args
})

export const setProductByMenu = (data) => ({
    type: 'product/setProductByMenu',
    payload: data
})

export const getProductByBarcode = (...args) => ({
    type: 'product/getProductByBarcode',
    args
})

export const searchProduct = (...args) => ({
    type: 'product/searchProduct',
    args
})

export const generateProductCode = (...args) => ({
    type: 'product/generateProductCode',
    args
})