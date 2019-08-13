import { chainParse } from '~/src/utils'
const initialState = {
    listMerchant: [],
    deliveryMethod: [],
    category: [],
    staffList: [],
    selectedMerchantId: '',
    menu: [],
    floorTable: []
}
export const merchant = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'merchant/setListMerchant': {
            const listMerchant = payload
            const indexOfSelectedMerchant = state.selectedMerchantId ?
                listMerchant.findIndex(item => chainParse(item, ['merchant', 'id']) == state.selectedMerchantId) : -1
            return {
                ...state,
                listMerchant: payload,
                selectedMerchantId: indexOfSelectedMerchant >= 0 ? state.selectedMerchantId : payload[0].merchant.id
            }
        }
        case 'merchant/setDeliveryMethod': {
            return {
                ...state,
                deliveryMethod: payload
            }
        }
        case 'merchant/setCategory': {
            return {
                ...state,
                category: payload
            }
        }
        case 'merchant/setStaffList': {
            return {
                ...state,
                staffList: payload
            }
        }
        case 'merchant/setSelectMerchant':
            return {
                ...state,
                selectedMerchantId: payload
            }
        case 'merchant/setFloorTable': {
            return {
                ...state,
                floorTable: payload
            }
        }
        case 'app/logout': {
            return initialState
        }
        default:
            return state
    }
}