import * as ACTION_TYPES from '~/src/store/types'
const initialState = {
    access_token: '',
    refresh_token: '',
}
export const auth = (state = initialState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.AUTH_SAVE_USER_DATA: {
            console.log('Payload Save user Data', payload)
            return {
                ...state,
                ...payload
            }
        }
        case 'user/setUserInfo': {
            return {
                ...state,
                ...payload
            }
        }

        case ACTION_TYPES.AUTH_LOGOUT: {
            const { firebaseToken } = state
            return {
                ...initialState,
                firebaseToken
            }
        }

        default:
            return state
    }
}