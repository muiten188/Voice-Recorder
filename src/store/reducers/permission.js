const initialState = {
    permissionDef: [],
    permission: {}
}
export const permission = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'permission/setPermissionDef': {
            return {
                ...state,
                permissionDef: payload
            }
        }
        case 'permission/setPermission': {
            const { userId, listPermission } = payload
            const permission = { ...state.permission }
            permission[userId] = listPermission
            return {
                ...state,
                permission
            }
        }
        case 'app/logout': {
            return initialState
        }
        default:
            return state
    }
}