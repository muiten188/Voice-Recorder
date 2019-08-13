const initialState = {
    firebaseToken: '',
    tenantCode: "",
    userName: ""
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
        // case 'auth/genTenantCode':{
        //     return{
        //         ...state,
        //         tenantCode:payload.tenantCode
        //     }
        // }
        case 'auth/setFirebaseToken': {
            return {
                ...state,
                firebaseToken: payload
            }
        }
        case 'user/setUserInfo': {
            return {
                ...state,
                ...payload
            }
        }
        case 'auth/updateAccessToken': {
            return {
                ...state,
                accessToken: payload
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