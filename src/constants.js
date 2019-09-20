export const BUILD_INFO = {
    'X-DATA-VERSION': 1,
    'X-VERSION': 1,
}
import { Dimensions } from 'react-native';
export const TIMEOUT_TIME = 45000
export const NETWORD_ERROR_EXCEPTION = 'TypeError: Network request failed'
export const OTP_COUNTDOWN_TIME = 60
export const TIMEOUT = 'REQUEST_TIME_OUT'
export const LANGUAGES = {
    VI: 'VI',
    EN: 'EN'
}
export const PASSWORD_LENGTH = 6
export const MAX_LENGTH_NAME = 80
export const MIN_USERNAME_LENGTH = 6
export const MAX_USERNAME_LENGTH = 32

export const PERMISSION_RESPONSE = {
    DENIED: 'denied',
    UNDEFINED: 'undefined',
    AUTHORIZED: 'authorized',
    RESTRICTED: 'restricted',
    UNDETERMINED: 'undetermined'
}

export const CURSOR_TYPE = {
    VERTICAL: 'VERTICAL',
    HORIZONTAL: 'HORIZONTAL'
}

export const POINT = Dimensions.get("window").width / 375

export const PAGE_SIZE = 30



export const READ_STATUS = {
    READ: 1,
    NOT_READ: 0
}

export const MEETING_STATUS = {
    INITIAL: 1,
    WAITING: 2,
    QUEUING: 3,
    PROCESSING: 4,
    DONE: 5,
    FAILED: 6
}

export const MEETING_STATUS_LIST = [
    {
        id: 1,
        name: 'Uploading'
    },
    {
        id: 2,
        name: 'Process'
    },
    {
        id: 3,
        name: 'Done'
    },
    {
        id: 4,
        name: 'Failed'
    },
]

export const LOCAL_RECORD_STATUS = {
    INITIAL: 1,
    CREATED_MEETING_URL: 2,
    UPLOADED: 3,
    MEETING_CREATED: 4
}

export const CHECK_LOCAL_RECORD_PERIOD = 60000
export const RELOAD_PROGRESS_PERIOD = 10000

export const FILE_TYPES = {
    DOCX: 'docx',
    PDF: 'pdf'
}