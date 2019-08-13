export const getListProvince = (...args) => ({
    type: 'address/getListProvince',
    args
})

export const setListProvince = (data) => ({
    type: 'address/setListProvince',
    payload: data
})

export const getListDistrict = (...args) => ({
    type: 'address/getListDistrict',
    args
})

export const getListWard = (...args) => ({
    type: 'address/getListWard',
    args
})