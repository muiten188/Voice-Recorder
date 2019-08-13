import { chainParse } from '~/src/utils'
import lodash from 'lodash'

const emptyArray = []
const emptyObj = {}

export const notificationDataSelector = (state) => chainParse(state, ['notification', 'notificationData'])

export const numberUnreadNotificationSelector = (state) => chainParse(state, ['notification', 'numberUnread'])