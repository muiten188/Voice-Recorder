import DBManager from '~/src/db/DBManager'
import { getIntSQL, getStringSQL, executeSql } from '~/src/utils'
import lodash from 'lodash'
import { PAGE_SIZE } from '~/src/constants'
import { toNormalCharacter } from '~/src/utils'

export const saveListProduct = async (productList) => {
    console.log('ProductList', productList)
    if (!productList) return Promise.resolve('empty')
    const deleteProductQuery = 'DELETE FROM s_product'
    const deleteProductMediaQuery = 'DELETE FROM s_product_media'
    if (productList.length == 0) {
        const deleteProductResult = await executeSql(deleteProductQuery, [])
        return [deleteProductResult]
    }

    const productQuery = `INSERT OR REPLACE INTO s_product(
        ID, NAME, NAME_WITHOUT_ACCENT, PRODUCT_CODE,ORIGINAL_PRICE, PRICE, AVATAR, CATEGORY, QUANTITY, UNIT, PROMOTION_PRICE, STATUS, PROMOTION_TITLE) VALUES 
        ${productList.map(item => (
        `(${getStringSQL(item.id)},` +
        `${getStringSQL(item.productName)},` +
        `${getStringSQL(toNormalCharacter(item.productName.toString().toLowerCase()))},` +
        `${getStringSQL(item.productCode)},` +
        `${getIntSQL(item.originPrice)},` +
        `${getIntSQL(item.price)},` +
        `${getStringSQL(item.productAvatar)},` +
        `${getIntSQL(item.productCategory)},` +
        `${getIntSQL(item.quantity)},` +
        `${getIntSQL(item.unit)},` +
        `${getIntSQL(item.promotionPrice)},` +
        `${getIntSQL(item.status)},` +
        `${getStringSQL(item.promotionTitle)})`
    )).join(',')};`
    // console.log('Product Query', productQuery)
    const productMediaList = productList.map(item => item.listProductMedia || []).reduce((a, b) => [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])], [])
    console.log('productMediaList', productMediaList)
    const productMediaQuery = (productMediaList && productMediaList.length > 0) ?
        `INSERT OR REPLACE INTO s_product_media(
            ID, PRODUCT_ID, UPLOAD_IMAGE_ID, URL, THUMBNAIL_URL, TYPE, ORDINAL, PRODUCT_VARIANT_ID) VALUES 
            ${productMediaList.map(item => (
            `(${getStringSQL(item.id)},` +
            `${getStringSQL(item.productId)},` +
            `${getStringSQL(item.uploadImageId)},` +
            `${getStringSQL(item.url)},` +
            `${getStringSQL(item.thumbnailUrl)},` +
            `${getIntSQL(item.type)},` +
            `${getIntSQL(item.ordinal)},` +
            `${getStringSQL(item.productVariantId)})`
        )).join(',')};`
        : ''
    console.log('productMediaQuery', productMediaQuery)
    const deleteProductResult = await executeSql(deleteProductQuery, [])
    const deleteProductMediaResult = await executeSql(deleteProductMediaQuery, [])
    const productResult = await executeSql(productQuery, [])
    let productMediaResult = ''
    if (productMediaList && productMediaList.length > 0) {
        await executeSql(productMediaQuery, [])
    }
    return [deleteProductResult, deleteProductMediaResult, productResult, productMediaResult]
}

export const getListProduct = async (page = 1, pageSize = PAGE_SIZE) => {
    const offset = (page - 1) * pageSize
    const countProductQuery = `SELECT COUNT(*) as totalElements FROM s_product`
    const productQuery = `SELECT 
    p.ID as id, p.NAME as productName, p.PRODUCT_CODE as productCode, p.NAME_WITHOUT_ACCENT as productNameWithoutAccent,
    p.ORIGINAL_PRICE as orinalPrice, p.PRICE as price,
    p.AVATAR as productAvatar, p.CATEGORY as productCategory, p.QUANTITY as quantity, p.UNIT as unit,
    p.PROMOTION_PRICE as promotionPrice, p.PROMOTION_TITLE as promotionTitle, p.STATUS as status
    FROM s_product p WHERE p.STATUS != -1;`
    // LIMIT ${offset},${pageSize}
    // console.log('productQuery ', productQuery)
    const countProductResult = await executeSql(countProductQuery, [])
    const totalElements = countProductResult.rows.raw()[0]['totalElements']
    const totalPages = Math.ceil(totalElements / pageSize)
    const productResult = await executeSql(productQuery, [])
    const productList = productResult.rows.raw()
    const productIdList = productList.map(item => getStringSQL(item.id))
    const productMediaQuery = `SELECT ID as id, PRODUCT_ID as productId,
                            URL as url, PRODUCT_VARIANT_ID as productVariantId, THUMBNAIL_URL as thumbnailUrl,
                            TYPE as type, ORDINAL as ordinal, UPLOAD_IMAGE_ID as uploadImageId
                            FROM s_product_media WHERE PRODUCT_ID IN (${productIdList.join(',')});`
    const productMediaResult = await executeSql(productMediaQuery, [])
    const productMediaList = productMediaResult.rows.raw()
    for (let i = 0; i < productList.length; i++) {
        const listProductMediaTmp = []
        for (let j = 0; j < productMediaList.length; j++) {
            if (productMediaList[j].productId == productList[i].id) {
                listProductMediaTmp.push(productMediaList[j])
            }
        }
        productList[i].listProductMedia = listProductMediaTmp
    }
    return {
        content: productList,
        pagingInfo: { pageSize: PAGE_SIZE, pageNumber: page },
        totalElements,
        totalPages,
    }
}

export const search = async (keyword) => {
    const normalizeKeyword = toNormalCharacter(keyword.toLowerCase())
    const productQuery = `SELECT 
    p.ID as id, p.NAME as productName, p.PRODUCT_CODE as productCode, p.NAME_WITHOUT_ACCENT as productNameWithoutAccent,
    p.ORIGINAL_PRICE as orinalPrice, p.PRICE as price,
    p.AVATAR as productAvatar, p.CATEGORY as productCategory, p.QUANTITY as quantity, p.UNIT as unit,
    p.PROMOTION_PRICE as promotionPrice, p.PROMOTION_TITLE as promotionTitle
    FROM s_product p 
    WHERE p.STATUS != -1 AND ( p.NAME_WITHOUT_ACCENT LIKE ? OR p.PRODUCT_CODE LIKE ? )`
    // console.log('productQuery ', productQuery)
    const productResult = await executeSql(productQuery, [`%${normalizeKeyword}%`, `%${normalizeKeyword}%`])
    const productList = productResult.rows.raw()
    const productIdList = productList.map(item => getStringSQL(item.id))
    const productMediaQuery = `SELECT ID as id, PRODUCT_ID as productId,
                            URL as url, PRODUCT_VARIANT_ID as productVariantId, THUMBNAIL_URL as thumbnailUrl,
                            TYPE as type, ORDINAL as ordinal, UPLOAD_IMAGE_ID as uploadImageId
                            FROM s_product_media WHERE PRODUCT_ID IN (${productIdList.join(',')});`
    const productMediaResult = await executeSql(productMediaQuery, [])

    const productMediaList = productMediaResult.rows.raw()
    for (let i = 0; i < productList.length; i++) {
        const listProductMediaTmp = []
        for (let j = 0; j < productMediaList.length; j++) {
            if (productMediaList[j].productId == productList[i].id) {
                listProductMediaTmp.push(productMediaList[j])
            }
        }
        productList[i].listProductMedia = listProductMediaTmp
    }
    return productList
}

export const searchActive = async (keyword) => {
    const normalizeKeyword = toNormalCharacter(keyword.toLowerCase())
    const productQuery = `SELECT 
    p.ID as id, p.NAME as productName, p.PRODUCT_CODE as productCode, p.NAME_WITHOUT_ACCENT as productNameWithoutAccent,
    p.ORIGINAL_PRICE as orinalPrice, p.PRICE as price,
    p.AVATAR as productAvatar, p.CATEGORY as productCategory, p.QUANTITY as quantity, p.UNIT as unit,
    p.PROMOTION_PRICE as promotionPrice, p.PROMOTION_TITLE as promotionTitle
    FROM s_product p 
    WHERE p.STATUS == 0 AND ( p.NAME_WITHOUT_ACCENT LIKE ? OR p.PRODUCT_CODE LIKE ? )`
    // console.log('productQuery ', productQuery)
    const productResult = await executeSql(productQuery, [`%${normalizeKeyword}%`, `%${normalizeKeyword}%`])
    const productList = productResult.rows.raw()
    const productIdList = productList.map(item => getStringSQL(item.id))
    const productMediaQuery = `SELECT ID as id, PRODUCT_ID as productId,
                            URL as url, PRODUCT_VARIANT_ID as productVariantId, THUMBNAIL_URL as thumbnailUrl,
                            TYPE as type, ORDINAL as ordinal, UPLOAD_IMAGE_ID as uploadImageId
                            FROM s_product_media WHERE PRODUCT_ID IN (${productIdList.join(',')});`
    const productMediaResult = await executeSql(productMediaQuery, [])

    const productMediaList = productMediaResult.rows.raw()
    for (let i = 0; i < productList.length; i++) {
        const listProductMediaTmp = []
        for (let j = 0; j < productMediaList.length; j++) {
            if (productMediaList[j].productId == productList[i].id) {
                listProductMediaTmp.push(productMediaList[j])
            }
        }
        productList[i].listProductMedia = listProductMediaTmp
    }
    return productList
}


export const clearProduct = async () => {
    const deleteProductQuery = 'DELETE FROM s_product;'
    const deleteProductMediaQuery = 'DELETE FROM s_product_media;'
    const deleteProductResult = await executeSql(deleteProductQuery, [])
    const deleteProductMediaResult = await executeSql(deleteProductMediaQuery, [])
    return [deleteProductResult, deleteProductMediaResult]
}

export default {
    saveListProduct,
    getListProduct,
    clearProduct,
    search,
    searchActive
}