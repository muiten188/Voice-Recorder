const initialState = {
    ENABLE_PRINT: false
}
export default setting = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'setting/setEnablePrint': {
            return {
                ...state,
                ENABLE_PRINT: payload
            }
        }
        case 'setting/saveSettingObject': {
            return payload
        }
        case 'app/logout': {
            return initialState
        }

        default:
            return state
    }
}