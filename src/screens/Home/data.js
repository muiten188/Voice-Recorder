import { VOICE_STATUS } from '~/src/constants'
export default [
    {
        id: 1,
        name: 'Phỏng vấn Bộ Trưởng Bộ CA',
        status: VOICE_STATUS.DONE,
        time: 1568035346
    },
    {
        id: 2,
        name: 'Phỏng vấn Hiệu trưởng trường AMS',
        status: VOICE_STATUS.PROCESSING,
        time: 1567935346
    },
    {
        id: 3,
        name: 'Phỏng vấn Mr Đàm',
        status: VOICE_STATUS.QUEUING,
        time: 1568025346
    },
    {
        id: 4,
        name: 'Phỏng vấn cầu thủ Đoàn Văn Hậu',
        status: VOICE_STATUS.FAILED,
        time: 1568040346
    },
    {
        id: 5,
        name: 'Phỏng vấn giám đốc nhà máy Rạng Đông',
        status: VOICE_STATUS.INITIAL,
        time: 1568040346
    }
]