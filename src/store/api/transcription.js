import { get, post } from './common'
import { PAGE_SIZE } from '~/src/constants'

export default {
    getTranscription: (meeting_id, page = 1, max_result = PAGE_SIZE) => {
        const paramObj = meeting_id ? { meeting_id, page, max_result } : { page, max_result }
        return get('/api/v2/fulltranscription', paramObj)
    }
}