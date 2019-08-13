import { get, post } from './common'
export default {
    importQRCode: (body, type = 1) => {
        return post('/qr/import-qr-code', { body, type })
    },
    generateQRCode: (amount, billNumber) => {
        return get('/qr/generate-qr-code', { amount, billNumber })
    },
    deleteQRCode: () => {
        return post('/qr/delete', {})
    }
}