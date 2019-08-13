import { takeEvery, all, takeLatest, put, call, select } from 'redux-saga/effects'

import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { setCategory, setProductList, setProductListFromDB, setProductListDiscount, setSaleCampain, setProductByMenu } from '~/src/store/actions/product'
import { chainParse } from '~/src/utils'
import productModel from '~/src/db/product'
// { getProductSync, saveListProduct, getListProduct }
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import { getProductList, syncProductFromNetwork, syncProductListFromDBToRedux } from '~/src/store/actions/product'
import { PAGE_SIZE } from '~/src/constants'

export const requestGetCategory = createRequestSaga({
    request: api.product.getCategory,
    key: 'product/getCategory',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result'])
            if (result) {
                return setCategory(result)
            }
            return noop('')
        }
    ]
})


export const requestGetAttribute = createRequestSaga({
    request: api.product.getAttribute,
    key: 'product/getAttribute'
})

export const requestGenerateProductId = createRequestSaga({
    request: api.product.generateProductId,
    key: 'product/generateProductId'
})

export const requestCreateProduct = createRequestSaga({
    request: api.product.createProduct,
    key: 'product/createProduct'
})


export const requestUpdateProduct = createRequestSaga({
    request: api.product.updateProduct,
    key: 'product/updateProduct'
})

export const requestRemoveProduct = createRequestSaga({
    request: api.product.removeProduct,
    key: 'product/removeProduct'
})

export const requestCreateSaleCampain = createRequestSaga({
    request: api.product.createSaleCampain,
    key: 'product/createSaleCampain'
})

export const requestDeleteSaleCampain = createRequestSaga({
    request: api.product.deleteSaleCampain,
    key: 'product/deleteSaleCampain'
})

export const requestGetProductListDiscount = createRequestSaga({
    request: api.product.getProductListDiscount,
    key: 'product/getProductListDiscount',
    success: [
        (data) => {
            if (data && data.content) {
                return setProductListDiscount(data)
            }
            return noop('')
        }
    ]
})

export const requestGetSaleCampain = createRequestSaga({
    request: api.product.getSaleCampain,
    key: 'product/getSaleCampain',
    success: [
        (data) => {
            if (data && Array.isArray(data.result)) {
                return setSaleCampain(data.result)
            }
            return noop('')
        }
    ]
})

export const requestGetProductDetail = createRequestSaga({
    request: api.product.getProductDetail,
    key: 'product/getProductDetail',
})

export const requestAddProductToMenu = createRequestSaga({
    request: api.product.addProductToMenu,
    key: 'product/addProductToMenu',
})

export const requestRemoveProductFromMenu = createRequestSaga({
    request: api.product.removeProductFromMenu,
    key: 'product/removeProductFromMenu',
})

export const requestGetProductByMenu = createRequestSaga({
    request: api.product.getProductByMenu,
    key: 'product/getProductByMenu',
    success: [
        (data) => {
            if (data && Array.isArray(data.content)) {
                const menuId = data.args[1]
                const menuInfo = data
                return setProductByMenu({
                    menuId,
                    menuInfo
                })
            }
            return noop('')
        }
    ]
})

export const requestGetProductByBarcode = createRequestSaga({
    request: api.product.getProductByBarcode,
    key: 'product/getProductByBarcode',
})

export const requestSearchProduct = createRequestSaga({
    request: api.product.searchProduct,
    key: 'product/searchProduct',
})

export const requestGetProductList = createRequestSaga({
    request: api.product.getProductListV2,
    key: 'product/getProductList',
})

const requestSyncProductListFromDBToRedux = function* ({ type, args }) {
    console.log('requestSyncProductListFromDBToRedux', args)
    try {
        const page = args[0] || 1
        const productList = yield call(productModel.getListProduct, page, PAGE_SIZE)
        console.log('ProductList From DB', productList)
        yield put(setProductListFromDB(productList))
    } catch (err) {
        console.log('requestSyncProductListFromDBToRedux err', err)
    }

}

const requestSyncProductFromNetwork = function* ({ type, payload }) {
    try {
        const merchantId = yield select(merchantIdSelector)
        const productListResponse = yield call(requestGetProductList, { type: 'product/getProductList', args: [merchantId, 0] })
        console.log('productListResponse', productListResponse)
        const productListContent = chainParse(productListResponse, ['content'])
        if (!productListResponse) return
        yield call(productModel.saveListProduct, productListContent)
        yield call(requestSyncProductListFromDBToRedux, { type: 'product/syncProductListFromDBToRedux', args: [1] })
    } catch (err) {
        console.log('requestSyncProductFromNetwork err', err)
    }
}

export const requestGenerateProductCode = createRequestSaga({
    request: api.product.generateProductCode,
    key: 'product/generateProductCode'
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('product/getCategory', requestGetCategory),
        takeEvery('product/getAttribute', requestGetAttribute),
        takeEvery('product/generateProductId', requestGenerateProductId),
        takeEvery('product/createProduct', requestCreateProduct),
        takeEvery('product/updateProduct', requestUpdateProduct),
        takeEvery('product/removeProduct', requestRemoveProduct),
        takeEvery('product/createSaleCampain', requestCreateSaleCampain),
        takeEvery('product/deleteSaleCampain', requestDeleteSaleCampain),
        takeEvery('product/getProductListDiscount', requestGetProductListDiscount),
        takeEvery('product/getSaleCampain', requestGetSaleCampain),
        takeEvery('product/getProductDetail', requestGetProductDetail),
        takeEvery('product/addProductToMenu', requestAddProductToMenu),
        takeEvery('product/getProductByMenu', requestGetProductByMenu),
        takeEvery('product/removeProductFromMenu', requestRemoveProductFromMenu),
        takeEvery('product/getProductByBarcode', requestGetProductByBarcode),
        takeEvery('product/searchProduct', requestSearchProduct),
        takeEvery('product/generateProductCode', requestGenerateProductCode),

        /* Offline */
        takeEvery('product/getProductList', requestGetProductList),
        takeEvery('product/syncProductListFromDBToRedux', requestSyncProductListFromDBToRedux),
        takeEvery('product/syncProductFromNetwork', requestSyncProductFromNetwork)
    ])
}


