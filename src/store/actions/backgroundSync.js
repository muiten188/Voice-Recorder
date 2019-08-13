export const ACTION_TYPES = {
    GET_DATA_VERSION: 'backgroundSync/getDataVersion',
    CHECK_AND_SYNC_MASTER_DATA: 'backgroundSync/checkAndSyncMasterData',
    SYNC_PRODUCT_AND_MENU: 'backgroundSync/syncProductAndMenu',
    SYNC_ORDER_DATA: 'backgroundSync/syncOrderData',
    START_CHECK_SYNC_ORDER: 'backgroundSync/startCheckSyncOrder',
    STOP_CHECK_SYNC_ORDER: 'backgroundSync/stopCheckSyncOrder'
}

export const getDataVersion = (...args) => ({
    type: ACTION_TYPES.GET_DATA_VERSION,
    args
})

export const checkAndSyncMasterData = () => ({
    type: ACTION_TYPES.CHECK_AND_SYNC_MASTER_DATA
})

export const syncOrderData = () => ({
    type: ACTION_TYPES.SYNC_ORDER_DATA
})

export const startCheckSyncOrder = () => ({
    type: ACTION_TYPES.START_CHECK_SYNC_ORDER,
})

export const stopCheckSyncOrder = () => ({
    type: ACTION_TYPES.STOP_CHECK_SYNC_ORDER,
})

export const syncProductAndMenu = () => ({
    type: ACTION_TYPES.SYNC_PRODUCT_AND_MENU
})