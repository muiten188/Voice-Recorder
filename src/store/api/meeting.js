import { get, post } from './common'
export default {
    createMeetingUploadUrl: () => {
        return get('/api/v2/meeting-upload-url')
    },
    createMeeting: (audio_path, name, status) => {
        return post('/api/v2/meeting', { audio_path, name, status })
    },
    getMeeting: (id = '') => {
        const paramObj = id ? { id } : {}
        return get('/api/v2/meeting', paramObj)
    }
}