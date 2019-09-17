import { get, post } from './common'
import { PAGE_SIZE } from '~/src/constants'

export default {
    createMeetingUploadUrl: () => {
        return get('/api/v2/meeting-upload-url')
    },
    createMeeting: (audio_path, name, status) => {
        return post('/api/v2/meeting', { audio_path, name, status })
    },
    getMeeting: (id = '', page = 1, max_result = 100) => {
        const paramObj = id ? { id, page, max_result } : { page, max_result }
        return get('/api/v2/meeting', paramObj)
    },
}