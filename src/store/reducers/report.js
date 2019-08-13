import { chainParse } from '~/src/utils'
const initialState = {
    topProduct: {}
}

export default report = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'report/setProductReport': {
            const pageNumber = +chainParse(payload, ['pagingInfo', 'pageNumber'])
            if (pageNumber <= 1) {
                return {
                    ...state,
                    topProduct: payload
                }
            }
            const payloadContent = chainParse(payload, ['content']) || []
            const stateContent = chainParse(state, ['topProduct', 'content']) || []
            return {
                ...state,
                topProduct: {
                    ...payload,
                    content: [...stateContent, ...payloadContent]
                }
            }
        }
        case 'app/logout': {
            return initialState
        }
        default:
            return state
    }
}