import { get, post } from './common'
export default {
    getSetting: () => {
        return get('/setting/get-merchant-setting')
    },
    updateSetting: (settings) => {
        return post('/setting/update-merchant-setting', { settings })
    }
}