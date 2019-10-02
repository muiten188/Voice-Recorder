// export const MODE = 'DEV' // DEV | BETA | PROD
// export const API_URL = (MODE == 'BETA') ? 'http://10.1.27.65:9000' : (MODE == 'PROD' ? 'http://171.244.49.184:9000' : 'http://171.244.49.184:9000')
export const SECRET_KEY = 'qwerc24214'
// export const IMAGE_UPLOAD_URL = 'http://171.244.49.186:8080'
// export const NEW_IMAGE_UPLOAD_URL = (MODE == 'BETA') ? 'http://10.1.27.64:8080' : (MODE == 'PROD' ? 'http://171.244.49.186:9090' : 'http://171.244.49.186:9090')

export const APP_MODE_DEF = {
    DEBUG: 'DEBUG',
    RELEASE: 'RELEASE'
}

export const APP_MODE = APP_MODE_DEF.DEBUG // DEBUG | RELEASE



export const API_ENDPOINT = {
    'DEV': {
        name: 'DEV',
        API_URL: 'http://118.70.205.25:8888',
        AUDIO_URL: 'http://118.70.205.25:9000/meeting/'
    },
    'PROD': {
        name: 'PROD',
        API_URL: 'http://10.0.0.1',
    }
}

export const PAGE_SIZE = 30

export const OFFLINE_ACTION_REQUESTER = {
    'home/getStatistic': true,
    'product/getProductListDiscount': true,
    'menu/getMerchantMenuProduct': true,
    'product/getSaleCampain': true,
    'permission/getPermission': true,
    'order/getOrderFromNetwork': true,
    'order/syncOrder': true,
    'table/syncTable': true,
    'order/getTotalPaidOrderByMethod': true,
    'order/getOrderStatistic': true,
    'table/getOrderByTableFromNetwork': true,
    'product/getProductDetail': true,
    'merchant/getListMerchant': true,
    'backgroundSync/getDataVersionFromNetwork': true,
    'order/getOrderDetail': true,
    'table/getFloorTable': true,
    'table/syncFloorTableFromNetwork': true,
    'product/getProductList': true,
    'table/requestSyncTableToNetwork': true,
    'order/syncOrderToNetwork': true,
    'notification/getNumberUnreadNotification': true,
    'user/getUserInfo': true,
    'auth/updateTokenInfo': true,
    'home/getActivitiesRecent': true
}