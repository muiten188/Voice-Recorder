const initialState = {
    showingForceUpdate: false,
    toastVisible: false,
    toastText: '',
    isConnected: true
}
export const info = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'app/setConnection': {
            return {
                ...state,
                isConnected: payload
            }
        }

        case 'app/setShowForceUpdate': {
            return {
                ...state,
                showingForceUpdate: payload
            }
        }

        case 'toast/show': {
            return {
                ...state,
                toastVisible: true,
                toastText: payload
            }
        }

        case 'toast/hide': {
            return {
                ...state,
                toastVisible: false,
                toastText: ''
            }
        }

        case 'app/logout': {
            return initialState
        }

        default:
            return state
    }
}