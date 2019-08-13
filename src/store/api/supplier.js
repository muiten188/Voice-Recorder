import { get, post } from './common'
import { PAGE_SIZE } from '~/src/constants'
export default {
    saveSupplier: (requestObj) => {
        return post('/supplier/create-supplier', requestObj)
    },
    getListSupplier: (page = 1) => {
        return get('/supplier/get-supplier-list', { page, pageSize: PAGE_SIZE })
    },
    deleteSupplier: (supplierId) => {
        return post('/supplier/delete-supplier', { supplierId })
    },
    searchSupplier:(keyword,pageSize,page)=>{
        return get('/supplier/search-supplier',{keyword,pageSize,page})
    }
}