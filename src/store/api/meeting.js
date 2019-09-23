import { get, post, deleteMethod } from './common'
import { PAGE_SIZE } from '~/src/constants'

export default {
    createMeetingUploadUrl: () => {
        return get('/api/v2/meeting-upload-url')
    },
    createMeeting: (audio_path, name, status) => {
        return post('/api/v2/meeting', { audio_path, name, status })
    },
    getMeeting: (id = '', page = 1, name__contains = '', status__in = '', max_result = PAGE_SIZE, order_direction = -1, order_by = 'create_time') => {

        const paramObj = {page, max_result, order_direction, order_by}
        if (id){
            paramObj['id'] = id
        }
        if (name__contains){
            paramObj['name__contains'] = name__contains
        }
        if (status__in){
            paramObj['status__in'] = status__in
        }
        return get('/api/v2/meeting', paramObj)
    },
    deleteMeeting: (id) => {
        return deleteMethod('/api/v2/meeting', { id })
    }
}