// Update
export const createFloor = (...args) => ({
    type: 'table/createFloor',
    args
})

// export const getFloor = (...args) => ({
//     type: 'table/getFloor',
//     args
// })

export const setFloor = (data) => ({
    type: 'table/setFloor',
    payload: data
})

export const removeFloor = (...args) => ({
    type: 'table/removeFloor',
    args
})

export const createTable = (...args) => ({
    type: 'table/createTable',
    args
})

// export const getTable = (...args) => ({
//     type: 'table/getTable',
//     args
// })

export const setTable = (data) => ({
    type: 'table/setTable',
    payload: data
})

export const removeTable = (...args) => ({
    type: 'table/removeTable',
    args
})


export const addTableProduct = (data) => ({
    type: 'table/addTableProduct',
    payload: data
})

export const getTableProduct = (...args) => ({
    type: 'table/getTableProduct',
    args
})

export const setTableProduct = (data) => ({
    type: 'table/setTableProduct',
    payload: data
})


export const cleanTable = (data) => ({
    type: 'table/cleanTable',
    payload: data
})

export const changeTable = (...args) => ({
    type: 'table/changeTable',
    args
})

export const mergeTable = (...args) => ({
    type: 'table/mergeTable',
    args
})

export const setTableNote = (data) => ({
    type: 'table/setTableNote',
    payload: data
})

export const setTableDiscount = (data) => ({
    type: 'table/setTableDiscount',
    payload: data
})

export const updateNumberProductTable = (data) => ({
    type: 'table/updateNumberProductTable',
    payload: data // {tableId, id, number}
})

export const updateNumberGuestTable = (...args) => ({
    type: 'table/updateNumberGuestTable',
    args
})

export const updateNumberGuestTableOffline = (data) => ({
    type: 'table/updateNumberGuestTableOffline',
    payload: data
})

export const getFloorTable = (...args) => ({
    type: 'table/getFloorTable',
    args
})

export const setFloorTable = (data) => ({
    type: 'table/setFloorTable',
    payload: data
})

export const getOrderByTable = (...args) => ({
    type: 'table/getOrderByTable',
    args
})

export const setOrderTable = (data) => ({
    type: 'table/setOrderTable',
    payload: data
})

export const cleanOrderTable = (data) => ({
    type: 'table/cleanOrderTable',
    payload: data
})

export const setPayableTable = (data) => ({
    type: 'table/setPayableTable',
    payload: data
})

export const syncFloorTableFromNetwork = (...args) => ({
    type: 'table/syncFloorTableFromNetwork',
    args
})

export const saveFloorTableToDB = (data) => ({
    type: 'table/saveFloorTableToDB',
    payload: data
})

export const syncFloorTableFromDBToRedux = () => ({
    type: 'table/syncFloorTableFromDBToRedux'
})

export const openTable = (data) => ({
    type: 'table/openTable',
    payload: data
})

export const syncTable = (...args) => ({
    type: 'table/syncTable',
    args
})

export const updateOrdinalFloor = (...args) => ({
    type: 'table/updateOrdinalFloor',
    args
})