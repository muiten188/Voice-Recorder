export const getListMerchant = (...args) => ({
    type: 'merchant/getListMerchant',
    args
})

export const getDeliveryMethod = (...args) => ({
    type: 'merchant/getDeliveryMethod',
    args
})

export const generateMerchantId = (...args) => ({
    type: 'merchant/generateMerchantId',
    args
})

export const createMerchant = (...args) => ({
    type: 'merchant/createMerchant',
    args
})

export const removeMerchant = (...args) => ({
    type: 'merchant/removeMerchant',
    args
})


export const setListMerchant = (data) => ({
    type: 'merchant/setListMerchant',
    payload: data
})

export const setDeliveryMethod = (data) => ({
    type: 'merchant/setDeliveryMethod',
    payload: data
})

export const getCategory = (...args) => ({
    type: 'merchant/getCategory',
    args
})

export const setCategory = (data) => ({
    type: 'merchant/setCategory',
    payload: data
})

export const getStaffList = (...args) => ({
    type: 'merchant/getStaffList',
    args
})

export const setStaffList = (data) => ({
    type: 'merchant/setStaffList',
    payload: data
})

export const addStaff = (...args) => ({
    type: 'merchant/addStaff',
    args
})
export const updateStaff =(...args)=>({
    type:'merchant/update-staff',
    args
})
export const removeStaff = (...args) => ({
    type: 'merchant/removeStaff',
    args
})

export const setSelectMerchant = (data) => ({
    type: 'merchant/setSelectMerchant',
    payload: data
})

// Floor Table

export const getFloorTable = (...args) => ({
    type: 'merchant/getFloorTable',
    args
})

export const setFloorTable = (data) => ({
    type: 'merchant/setFloorTable',
    payload: data
})

export const createFloorTable = (...args) => ({
    type: 'merchant/createFloorTable',
    args
})

export const removeFloorTable = (...args) => ({
    type: 'merchant/removeFloorTable',
    args
})
