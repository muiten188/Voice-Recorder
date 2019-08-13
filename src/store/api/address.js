import { get, post } from './common'
export default {
    getListProvince: () => {
        return get('/address/get-list-province')
    },
    getListDistrict: (provinceId) => {
        return get('/address/get-list-district', { provinceId })
    },
    getListWard: (districtId) => {
        return get('/address/get-list-ward', { districtId })
    }
}