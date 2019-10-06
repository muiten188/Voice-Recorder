import * as ACTION_TYPES from '~/src/store/types'
const initialState = {
}
export default auth = (state = initialState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.USER_SET_LIST: {
            console.log('Payload set list user', payload)

            const userResponse = payload
            const page = userResponse && userResponse.args && userResponse.args[0] ? userResponse.args[0] : 1
            if (page == 1) {
                return userResponse
            }
            const currentData = chainParse(state, ['data']) || []
            const responseData = userResponse.data
            const newData = [...currentData, ...responseData]
            return {
                ...state,
                data: newData
            }
        }

        case ACTION_TYPES.AUTH_LOGOUT: {
            return initialState
        }

        default:
            return state
    }
}