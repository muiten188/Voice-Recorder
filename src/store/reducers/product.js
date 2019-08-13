import { chainParse } from '~/src/utils'
const initialState = {
    category: [],
    productList: {

    },
    discountProductList: {

    },
    saleCampain: [],
    productMenu: {}
}
export const product = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'product/setCategory':
            {
                return {
                    ...state,
                    category: payload
                }
            }
        // case 'product/setProductList':
        //     {
        //         const pageNumber = +chainParse(payload, ['pagingInfo', 'pageNumber'])
        //         if (pageNumber <= 1) {
        //             return {
        //                 ...state,
        //                 productList: payload
        //             }
        //         }
        //         const payloadContent = chainParse(payload, ['content']) || []
        //         const stateContent = chainParse(state, ['productList', 'content']) || []
        //         return {
        //             ...state,
        //             productList: {
        //                 ...payload,
        //                 content: [...stateContent, ...payloadContent]
        //             }
        //         }
        //     }

        case 'product/setProductListFromDB': {
            const pageNumber = +chainParse(payload, ['pagingInfo', 'pageNumber'])
            if (pageNumber <= 1) {
                return {
                    ...state,
                    productList: payload
                }
            }
            const payloadContent = chainParse(payload, ['content']) || []
            const stateContent = chainParse(state, ['productList', 'content']) || []
            return {
                ...state,
                productList: {
                    ...payload,
                    content: [...stateContent, ...payloadContent]
                }
            }
        }

        case 'product/setProductListDiscount':
            {
                const pageNumber = +chainParse(payload, ['pagingInfo', 'pageNumber'])
                if (pageNumber <= 1) {
                    return {
                        ...state,
                        discountProductList: payload
                    }
                }
                const payloadContent = chainParse(payload, ['content']) || []
                const stateContent = chainParse(state, ['discountProductList', 'content']) || []
                return {
                    ...state,
                    discountProductList: {
                        ...state.discountProductList,
                        content: [...stateContent, ...payloadContent]
                    }
                }
            }

        case 'product/setSaleCampain':
            {
                return {
                    ...state,
                    saleCampain: payload
                }
            }
        case 'product/setProductByMenu': {
            const productMenu = { ...state.productMenu }
            const { menuInfo, menuId } = payload
            const pageNumber = +chainParse(menuInfo, ['pagingInfo', 'pageNumber'])
            if (pageNumber <= 1) {
                productMenu[menuId] = menuInfo
            } else {
                const currentContent = productMenu && productMenu[menuId] && productMenu[menuId].content ? productMenu[menuId].content : []
                productMenu[menuId] = {
                    ...menuInfo,
                    content: [...currentContent, menuInfo.content]
                }
            }
            return {
                ...state,
                productMenu
            }
        }
        case 'app/logout':
            {
                return initialState
            }
        default:
            return state
    }
}