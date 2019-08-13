import { chainParse } from '~/src/utils'
import lodash from 'lodash'
import I18n from '~/src/I18n'

const emptyArray = []
const emptyObj = {}

export const deliveryMethodSelector = (state) => chainParse(state, ['merchant', 'deliveryMethod'])

const getSelectedMerchant = (listMerchant, selectedMerchantId) => {
    if (!listMerchant || listMerchant.length == 0) return emptyObj
    if (!selectedMerchantId) return listMerchant[0]
    return listMerchant.find(item => item.merchant.id == selectedMerchantId)
}

export const merchantSelector = (state) => {
    const selectedMerchantId = chainParse(state, ['merchant', 'selectedMerchantId'])
    const listMerchant = chainParse(state, ['merchant', 'listMerchant'])
    return getSelectedMerchant(listMerchant, selectedMerchantId)
}

export const merchantListSelector = (state) => chainParse(state, ['merchant', 'listMerchant']) || emptyArray

export const categorySelector = (state) => chainParse(state, ['merchant', 'category'])

export const staffListSelector = (state) => chainParse(state, ['merchant', 'staffList'])

export const merchantIdSelector = (state) => chainParse(state, ['merchant', 'selectedMerchantId']) || ''

export const floorTableSelector = (state) => chainParse(state, ['merchant', 'floorTable']) || emptyArray

