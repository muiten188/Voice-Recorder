import DBManager from '~/src/db/DBManager'
import { getIntSQL, getStringSQL, executeSql } from '~/src/utils'

const saveMenuProduct = async (menuProduct) => {
    // Menu empty now
    const deleteMenuQuery = 'DELETE FROM m_merchant_menu'
    const deleteMenuMappingQuery = 'DELETE FROM s_product_menu_mapping'
    if (!menuProduct || menuProduct.length == 0) {
        const deleteMenuResult = await executeSql(deleteMenuQuery, [])
        const deleteMenuMappingResult = await executeSql(deleteMenuMappingQuery, [])
        return [deleteMenuResult, deleteMenuMappingResult]
    }
    menuProduct = menuProduct.filter(item => !!item.merchantMenu)
    const menuArr = []
    const menuProductMappingArr = []
    for (let i = 0; i < menuProduct.length; i++) {
        const currentMenu = menuProduct[i].merchantMenu
        const currentMenuProduct = menuProduct[i].listSaleProductDiscountDto
        menuArr.push(currentMenu)
        for (let j = 0; j < currentMenuProduct.length; j++) {
            menuProductMappingArr.push({
                menuId: currentMenu.id,
                productId: currentMenuProduct[j].id
            })
        }
    }
    const menuQuery = `INSERT OR REPLACE INTO m_merchant_menu(ID, NAME, MERCHANT_ID, ORDINAL) VALUES
            ${menuArr.map(item => (
        `(${getStringSQL(item.id)},` +
        `${getStringSQL(item.name)},` +
        `${getStringSQL(item.merchantId)},` +
        `${getIntSQL(item.ordinal)})`
    )).join(',')}`;
    // console.log('menuQuery', menuQuery)
    const menuMappingQuery = `INSERT OR REPLACE INTO s_product_menu_mapping(MENU_ID, PRODUCT_ID) VALUES
            ${menuProductMappingArr.map(item => (
        `(${getStringSQL(item.menuId)},` +
        `${getStringSQL(item.productId)})`
    )).join(',')}`;
    // console.log('menuMappingQuery', menuMappingQuery)

    const deleteMenuResult = await executeSql(deleteMenuQuery, [])
    const deleteMenuMappingResult = await executeSql(deleteMenuMappingQuery, [])
    const saveMenuResult = await executeSql(menuQuery, [])
    let saveMenuMappingResult = ''
    if (menuProductMappingArr && menuProductMappingArr.length > 0) {
        saveMenuMappingResult = await executeSql(menuMappingQuery, [])
    }
    return [deleteMenuResult, deleteMenuMappingResult, saveMenuResult, saveMenuMappingResult]
}

const getMenuProduct = async () => {
    const menuQuery = 'SELECT ID as id, NAME as name FROM m_merchant_menu'
    const menuResult = await executeSql(menuQuery, [])
    const menuList = menuResult.rows.raw()
    if (!menuList || menuList.length == 0) return []
    const menuIdList = menuList.map(item => getStringSQL(item.id))

    const productQuery = `SELECT mm.MENU_ID as menuId, mm.PRODUCT_ID as id,
        p.NAME as productName, p.PRODUCT_CODE as productCode, p.NAME_WITHOUT_ACCENT as productNameWithoutAccent,
        p.ORIGINAL_PRICE as orinalPrice, p.PRICE as price,
        p.AVATAR as productAvatar, p.CATEGORY as productCategory, p.QUANTITY as quantity, p.UNIT as unit,
        p.PROMOTION_PRICE as promotionPrice, p.PROMOTION_TITLE as promotionTitle,
        p.STATUS as status
        FROM s_product_menu_mapping mm
        INNER JOIN s_product p
        ON mm.PRODUCT_ID=p.ID
        WHERE mm.MENU_ID IN (${menuIdList.join(',')})
    `
    const productResult = await executeSql(productQuery, [])
    const productList = productResult.rows.raw()
    if (!productList || productList.length == 0) {
        return menuList.map(item => ({
            ...item,
            productList: []
        }))
    }

    const productIdList = productList.map(item => getStringSQL(item.id))
    // console.log('productIdList', productIdList)
    const productMediaQuery = productIdList && productIdList.length > 0 ?
        `SELECT ID as id, PRODUCT_ID as productId,
            URL as url, PRODUCT_VARIANT_ID as productVariantId, THUMBNAIL_URL as thumbnailUrl,
            TYPE as type, ORDINAL as ordinal, UPLOAD_IMAGE_ID as uploadImageId
            FROM s_product_media WHERE PRODUCT_ID IN (${productIdList.join(',')});` : ''
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
    for (let i = 0; i < menuList.length; i++) {
        const tempProductList = []
        for (let j = 0; j < productList.length; j++) {
            if (productList[j].menuId == menuList[i].id) {
                tempProductList.push(productList[j])
            }
        }
        menuList[i] = {
            ...menuList[i],
            productList: tempProductList
        }
    }
    return menuList
}

const clearMenu = async () => {
    const deleteMenuQuery = 'DELETE FROM m_merchant_menu'
    const deleteMenuMappingQuery = 'DELETE FROM s_product_menu_mapping'
    const deleteMenuResult = await executeSql(deleteMenuQuery, [])
    const deleteMenuMappingResult = await executeSql(deleteMenuMappingQuery, [])
    return [deleteMenuResult, deleteMenuMappingResult]
}

export default {
    saveMenuProduct,
    getMenuProduct,
    clearMenu
}  