import { get, post } from './common'
export default {
    getStatistic: (merchantId) => {
        return get('/home/statistical', {merchantId})
    },
    getActivitiesRecent:(page=1)=>{
        return get('/trans-activity/get-trans-activity',{page})
    }
}