export const showToast = (data) => ({
    type: 'toast/show',
    payload: data
})

export const hideToast = (data) => ({
    type: 'toast/hide',
})