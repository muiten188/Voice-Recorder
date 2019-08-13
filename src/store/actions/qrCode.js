export const importQRCode = (...args) => ({
    type: 'qr/importQRCode',
    args
})

export const generateQRCode = (...args) => ({
    type: 'qr/generateQRCode',
    args
})

export const deleteQRCode = (...args) => ({
    type: 'qr/deleteQRCode',
    args
})