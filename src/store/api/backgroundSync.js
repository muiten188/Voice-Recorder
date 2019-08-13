import { get, post } from './common'
export default {
    getDataVersion: () => {
        return get('/merchant/get-data-version')
    }
}