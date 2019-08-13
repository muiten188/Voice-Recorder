import { get, post } from './common'
export default {
    getCategory: (categoryId = 0) => {
        return get('/category/get-sub-category', { categoryId })
    },
    getAttribute: (categoryId) => {
        return get('/category/get-attribute-def', { categoryId })
    },
    generateProductId: () => {
        return get('/product/generate-product-id')
    },
    createProduct: (requestObj) => {
        return post('/product/create-product', requestObj)
    },
    updateProduct: (requestObj) => {
        return post('/product/update-product', requestObj)
    },
    removeProduct: (productId) => {
        return post('/product/delete-product', { productId })
    },
    getProductList: (merchantId, page = 0) => {
        return get('/product/get-product-list', { merchantId, page })
    },
    getProductListV2: (merchantId, page = 0) => {
        return get('/v2/product/get-product-list', { merchantId, page })
    },
    createSaleCampain: (requestObj) => {
        return post('/product/create-sale-discount', requestObj)
    },
    deleteSaleCampain: (discountId) => {
        return post('/product/delete-sale-discount', { discountId })
    },
    getProductListDiscount: (merchantId, page = 1) => {
        return get('/product/get-product-discount-list', { merchantId, page })
    },
    getSaleCampain: (merchantId) => {
        return get('/product/get-list-campaign', { merchantId })
    },
    getProductDetail: (productId) => {
        return get('/product/get-product', { productId })
    },
    addProductToMenu: (merchantId, menuId, menuName, productIdList) => {
        return post('/product/add-product-to-menu', { merchantId, menuId, menuName, productIdList })
    },
    removeProductFromMenu: (merchantId, menuId, productId) => {
        return post('/product/remove-product-from-menu', { merchantId, menuId, productId })
    },
    getProductByMenu: (merchantId, menuId, page = 1, totalPage = 1) => {
        return get('/product/get-product-by-menu', { merchantId, menuId, page, totalPage })
    },
    getProductByBarcode: (merchantId, barCode) => {
        return get('/product/get-product-by-barcode', { merchantId, barCode })
    },
    searchProduct: (merchantId, keyword) => {
        return get('/search', { merchantId, keyword })
    },
    generateProductCode: (productName) => {
        return get('/product/generate-product-code', { productName })
    }
}