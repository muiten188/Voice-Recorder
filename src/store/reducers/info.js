import * as ACTION_TYPES from '~/src/store/types'
const initialState = {
    showingForceUpdate: false,
    toastVisible: false,
    toastText: '',
    isConnected: true,
    appState: 'active'
}
export const info = (state = initialState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.INFO_SET_CONNECTION: {
            return {
                ...state,
                isConnected: payload
            }
        }

        case ACTION_TYPES.INFO_SET_APPSTATE: {
            return {
                ...state,
                appState: payload
            }
        }

        case ACTION_TYPES.AUTH_LOGOUT: {
            return initialState
        }

        default:
            return state
    }
}