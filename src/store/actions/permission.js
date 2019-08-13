export const getPermissionDef = (...args) => ({
    type: 'permission/getPermissionDef',
    args
})

export const setPermissionDef = (data) => ({
    type: 'permission/setPermissionDef',
    payload: data
})

export const addPermission = (...args) => ({
    type: 'permission/addPermission',
    args
})

export const setPermission = (data) => ({
    type: 'permission/setPermission',
    payload: data
})


export const getPermission = (...args) => ({
    type: 'permission/getPermission',
    args
})

export const removePermission = (...args) => ({
    type: 'permission/removePermission',
    args
})