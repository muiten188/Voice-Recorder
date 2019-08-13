import lodash from 'lodash'
import moment from 'moment'
import { chainParse } from '~/src/utils'
import I18n from '~/src/I18n'

export const getOrderForSectionList = lodash.memoize((orderList) => {
    const orderListObj = {}
    for (let i = 0; i < orderList.length; i++) {
        const key = moment(chainParse(orderList[i], ['order', 'createdAt']) * 1000).format(I18n.t('date_format'))
        if (!orderListObj[key]) {
            orderListObj[key] = [orderList[i]]
        } else {
            orderListObj[key].push(orderList[i])
        }
    }
    const orderObjKeys = Object.keys(orderListObj)
    const todayStr = moment().format(I18n.t('date_format'))
    const orderSectionList = orderObjKeys.map(item => ({
        title: item == todayStr ? I18n.t('today') : item,
        data: orderListObj[item]
    }))
    return orderSectionList
})