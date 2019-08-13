export const getListSupplier = (...args) => ({
    type: 'supplier/getListSupplier',
    args
})

export const setListSupplier = (data) => ({
    type: 'supplier/setListSupplier',
    payload: data
})

export const saveSupplier = (...args) => ({
    type: 'supplier/saveSupplier',
    args
})

export const deleteSupplier = (...args) => ({
    type: 'supplier/deleteSupplier',
    args
})
export const searchSupplier = (...args)=>({
    type:'supplier/searchSupplier',
    args
})