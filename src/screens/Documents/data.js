import { MEETING_STATUS } from '~/src/constants'
export default [
    {
        id: 1,
        name: 'Phỏng vấn Bộ Trưởng Bộ CA',
        status: MEETING_STATUS.DONE,
        time: 1568035346,
        editBy: 'Hai Vu'
    },
    {
        id: 2,
        name: 'Phỏng vấn Hiệu trưởng trường AMS',
        status: MEETING_STATUS.PROCESSING,
        time: 1567935346,
        editBy: 'Nam Vu'
    },
    {
        id: 3,
        name: 'Phỏng vấn Mr Đàm',
        status: MEETING_STATUS.QUEUING,
        time: 1568025346,
        editBy: 'Huong Tran'
    },
    {
        id: 4,
        name: 'Phỏng vấn cầu thủ Đoàn Văn Hậu',
        status: MEETING_STATUS.FAILED,
        time: 1568040346,
        editBy: 'Khac De'
    },
    {
        id: 5,
        name: 'Phỏng vấn giám đốc nhà máy Rạng Đông',
        status: MEETING_STATUS.INITIAL,
        time: 1568040346,
        editBy: 'No Body'
    }
]