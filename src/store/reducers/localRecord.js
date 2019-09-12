import * as ACTION_TYPES from '~/src/store/types'
const initialState = []
export default localRecord = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ACTION_TYPES.RECORD_ADD: {
            const filePath = payload
            console.log('Payload add record', payload)
            const newState = [...state]
            newState.push({
                localPath: filePath
            })
            return newState
        }

        case ACTION_TYPES.RECORD_UPDATE: {
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