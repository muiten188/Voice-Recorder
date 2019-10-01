import * as ACTION_TYPES from '~/src/store/types'

export const updateSetting = (data) => ({
    type: ACTION_TYPES.SETTING_UPDATE,
    payload: data
})
