import { chainParse } from '~/src/utils'
import { MASTER_ROLE, ROLES } from '~/src/constants'
const emptyArray = []

export const permissionDefSelector = (state) => chainParse(state, ['permission', 'permissionDef']) || emptyArray

export const permissionSelector = (state, userId) => chainParse(state, ['permission', 'permission', userId]) || emptyArray

export const currentUserPermissionSelector = (state) => {
    const userId = chainParse(state, ['auth', 'userId'])
    if (!userId) return emptyArray
    return chainParse(state, ['permission', 'permission', userId]) || emptyArray
}

export const isPermissionSelector = (state) => {
    const userId = chainParse(state, ['auth', 'userId'])
    if (!userId) return false
    const permissions = chainParse(state, ['permission', 'permission', userId])
    if (!permissions || permissions.length == 0) return false
    return !!permissions.find(item => item.permissionId == MASTER_ROLE)
}

export const isEmployeeSelector = (state) => {
    const userId = chainParse(state, ['auth', 'userId'])
    if (!userId) return false
    const permissions = chainParse(state, ['permission', 'permission', userId])
    if (!permissions || permissions.length == 0) return false
    return permissions[0].permissionId == ROLES.SALE
}

export const currentUserPermissionIdSelector = (state) => {
    const userId = chainParse(state, ['auth', 'userId'])
    if (!userId) return false
    const permissions = chainParse(state, ['permission', 'permission', userId])
    if (!permissions || permissions.length == 0) return false
    return permissions[0].permissionId
}