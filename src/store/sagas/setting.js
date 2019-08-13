import { takeEvery, all, call } from 'redux-saga/effects';

import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { chainParse } from '~/src/utils'
import { saveSettingObject } from '~/src/store/actions/setting'

export const requestGetSetting = createRequestSaga({
    request: api.setting.getSetting,
    key: 'setting/getSetting',
    success: [
        data => {
            const result = chainParse(data, ['updated', 'result'])
            if (result && result.length > 0) {
                const settingObj = {}
                for (let i = 0; i < result.length; i++) {
                    settingObj[result[i]['name']] = (result[i]['value'] == 'true' ? true : false)
                }
                return saveSettingObject(settingObj)
            }
            console.log('get setting', data)
            return noop('')
        }

    ]
})

export const requestUpdateSetting = createRequestSaga({
    request: api.setting.updateSetting,
    key: 'merchant/updateSetting'
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('setting/getSetting', requestGetSetting),
        takeEvery('setting/updateSetting', requestUpdateSetting),
    ])
}


