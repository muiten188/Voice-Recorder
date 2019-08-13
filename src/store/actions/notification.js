export const getNotification = (...args) => ({
    type: 'notification/getNotification',
    args
})

export const setNotification = (data) => ({
    type: 'notification/setNotification',
    payload: data
})



export const markReadNotification = (...args) => ({
    type: 'notification/markReadNotification',
    args
})

export const markReadNotificationOffline = (data) => ({
    type: 'notification/markReadNotificationOffline',
    payload: data
})

export const getNumberUnreadNotification = (...args) => ({
    type: 'notification/getNumberUnreadNotification',
    args
})

export const setNumberUnreadNotification = (data) => ({
    type: 'notification/setNumberUnreadNotification',
    payload: data
})