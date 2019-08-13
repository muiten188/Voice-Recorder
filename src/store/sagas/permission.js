import { takeEvery, all } from 'redux-saga/effects'

import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { chainParse } from '~/src/utils'
import { setPermissionDef, setPermission } from '~/src/store/actions/permission'

export const requestGetPermissionDef = createRequestSaga({
    request: api.permission.getPermissionDef,
    key: 'permission/getPermissionDef',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result'])
            if (Array.isArray(result)) {
                return setPermissionDef(result)
            }
            return noop('')
        }
    ]
})

export const requestAddPermission = createRequestSaga({
    request: api.permission.addPermission,
    key: 'permission/addPermission'
})

export const requestGetPermission = createRequestSaga({
    request: api.permission.getPermission,
    key: 'permission/getPermission',
    success: [
        (data) => {
            const result = chainParse(data, ['updated', 'result']) || []
            const statusCode = chainParse(data, ['httpHeaders', 'status'])
            if (statusCode == 200) {
                return setPermission({
                    userId: data.args[1], // userId
                    listPermission: result
                })
            }
            return noop('')
        }
    ]
})

export const requestRemovePermission = createRequestSaga({
    request: api.permission.removePermission,
    key: 'permission/removePermission'
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('permission/getPermissionDef', requestGetPermissionDef),
        takeEvery('permission/addPermission', requestAddPermission),
        takeEvery('permission/getPermission', requestGetPermission),
        takeEvery('permission/removePermission', requestRemovePermission),
    ])
}


