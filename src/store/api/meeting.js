import { get, post } from './common'
import { PAGE_SIZE } from '~/src/constants'

export default {
    createMeetingUploadUrl: () => {
        return get('/api/v2/meeting-upload-url')
    },
    createMeeting: (audio_path, name, status) => {
        return post('/api/v2/meeting', { audio_path, name, status })
    },
    getMeeting: (id = '', page = 1, max_result = PAGE_SIZE, direction = -1, order_bt = 'create_time') => {
        const paramObj = id ? { id, page, max_result, direction, order_bt } : { page, max_result, direction, order_bt }
        return get('/api/v2/meeting', paramObj)
    },
}