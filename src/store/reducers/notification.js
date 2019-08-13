import { chainParse } from '~/src/utils'
import { READ_STATUS } from '~/src/constants'
const initialState = {
    numberUnread: 0,
    notificationData: {}
}
export const notification = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'notification/setNumberUnreadNotification': {
            return {
                ...state,
                numberUnread: payload
            }
        }
        case 'notification/setNotification': {
            const pageNumber = +chainParse(payload, ['pagingInfo', 'pageNumber'])
            let notificationData;
            if (pageNumber <= 1) {
                notificationData = payload
            } else {
                const currentContent = notificationData.content || []
                notificationData = {
                    ...state.notificationData,
                    content: [...currentContent, payload.content]
                }
            }
            return {
                ...state,
                notificationData
            }
        }
        case 'notification/markReadNotificationOffline': {
            const notificationId = payload
            const notificationList = chainParse(state, ['notificationData', 'content']) || []
            if (!notificationList || notificationList.length == 0) return state
            const notiIndex = notificationList.findIndex(item => item.id == notificationId)
            if (notiIndex < 0) return state
            // notification already read
            if (notificationList[notiIndex].status == READ_STATUS.READ) return state
            const numberUnread = state.numberUnread
            const newNumberUnread = numberUnread > 0 ? numberUnread - 1 : numberUnread
            notificationList[notiIndex] = {
                ...notificationList[notiIndex],
                status: READ_STATUS.READ
            }
            return {
                ...state,
                notificationData: {
                    ...state.notificationData,
                    content: [...notificationList],
                },
                numberUnread: newNumberUnread
            }
        }
        case 'app/logout': {
            return initialState
        }
        default:
            return state
    }
}