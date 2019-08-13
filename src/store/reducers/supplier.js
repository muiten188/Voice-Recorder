import { chainParse } from '~/src/utils'
const initialState = {
    supplierList: []
}

export default supplier = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'supplier/setListSupplier': {
            console.log('setListSupplier payload', payload)
            const pageNumber = +chainParse(payload, ['pagingInfo', 'pageNumber'])
            if (pageNumber <= 1) {
                return {
                    ...state,
                    supplierList: payload
                }
            }
            const payloadContent = chainParse(payload, ['content']) || []
            const stateContent = chainParse(state, ['supplierList', 'content']) || []
            return {
                ...state,
                supplierList: {
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