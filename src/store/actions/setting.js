export const getSetting = (...args) => ({
    type: 'setting/getSetting',
    args
})

export const updateSetting = (...args) => ({
    type: 'setting/updateSetting',
    args
})

export const setEnablePrint = (data) => ({
    type: 'setting/setEnablePrint',
    payload: data
})

export const saveSettingObject = (data) => ({
    type: 'setting/saveSettingObject',
    payload: data
})

