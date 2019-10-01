import * as ACTION_TYPES from '~/src/store/types'
import I18n from '~/src/I18n'

const initialState = {
    chanel: 1,
    sampleRate: 22050,
    defaultName: I18n.t('default_meeting_name'),
    bitRate: 128000
}
export default setting = (state = initialState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.SETTING_UPDATE: {
            return {
                ...state,
                ...payload
            }
        }
        case ACTION_TYPES.AUTH_LOGOUT: {
            return initialState
        }

        default:
            return state
    }
}