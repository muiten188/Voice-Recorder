const initialState = {
    access_token: '',
    refresh_token: '',
}
export const auth = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'auth/saveUserData': {
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

        case 'app/logout': {
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