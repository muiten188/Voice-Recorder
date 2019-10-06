import { takeLatest, takeEvery, all } from 'redux-saga/effects'
import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { setListUser } from '~/src/store/actions/user'
import { chainParse } from '~/src/utils'
import { StackActions, NavigationActions } from 'react-navigation'
import NavigationUtils from '~/src/utils/NavigationUtils'
import * as ACTION_TYPES from '~/src/store/types'


const requestGetListUser = createRequestSaga({
    request: api.user.getListUser,
    key: ACTION_TYPES.USER_GET_LIST,
    success: [
        (data) => {
            if (data && data.data) {
                return setListUser(data)
            }
            return noop('')
        }
    ]
})

const requestUpdateOtherUserInfo = createRequestSaga({
    request: api.user.updateUser,
    key: ACTION_TYPES.USER_UPDATE_INFO,
})


// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery(ACTION_TYPES.USER_GET_LIST, requestGetListUser),
        takeEvery(ACTION_TYPES.USER_UPDATE_INFO, requestUpdateOtherUserInfo)
    ])
}


