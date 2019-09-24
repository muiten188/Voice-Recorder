import { get, post } from './common'
import { PAGE_SIZE } from '~/src/constants'

export default {
    getTranscription: (meeting_id) => {
        return get('/api/v2/fulltranscription', { meeting_id })
    },
    getTranscriptionBySentence: (meeting_id) => {
        return get('/api/v2/transcription-from-full', { meeting_id })
    },
    getExportToken: (id) => {
        return post(`/api/v2/meeting/export?id=${id}`, {})
    },
    exportTranscript: (token) => {
        return get('/api/v2/meeting/export', { token })
    }
}