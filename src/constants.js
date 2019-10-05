import I18n from '~/src/I18n'

export const BUILD_INFO = {
    'X-DATA-VERSION': 1,
    'X-VERSION': 1,
}
import { Dimensions } from 'react-native';
export const TIMEOUT_TIME = 45000
export const NETWORD_ERROR_EXCEPTION = 'TypeError: Network request failed'
export const OTP_COUNTDOWN_TIME = 60
export const TIMEOUT = 'REQUEST_TIME_OUT'
export const NETWORK_ERROR = 'NETWORK_ERROR'
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

export const MEETING_STATUS_INFO = {
    [-1]: {
        id: -1,
        name: I18n.t('all')
    },
    [MEETING_STATUS.WAITING]: {
        id: MEETING_STATUS.WAITING,
        name: I18n.t('process_waiting')
    },
    [MEETING_STATUS.QUEUING]: {
        id: MEETING_STATUS.QUEUING,
        name: I18n.t('process_queuing')
    },
    [MEETING_STATUS.PROCESSING]: {
        id: MEETING_STATUS.PROCESSING,
        name: I18n.t('processing')
    },
    [MEETING_STATUS.DONE]: {
        id: MEETING_STATUS.DONE,
        name: I18n.t('process_done')
    },
    [MEETING_STATUS.FAILED]: {
        id: MEETING_STATUS.FAILED,
        name: I18n.t('process_failed')
    },
}

export const MEETING_STATUS_LIST = [
    {
        id: -1,
        name: I18n.t('all')
    },
    {
        id: MEETING_STATUS.WAITING,
        name: I18n.t('process_waiting')
    },
    {
        id: MEETING_STATUS.QUEUING,
        name: I18n.t('process_queuing')
    },
    {
        id: MEETING_STATUS.PROCESSING,
        name: I18n.t('processing')
    },
    {
        id: MEETING_STATUS.DONE,
        name: I18n.t('process_done')
    },
    {
        id: MEETING_STATUS.FAILED,
        name: I18n.t('process_failed')
    },
]

export const LOCAL_RECORD_STATUS = {
    INITIAL: 1,
    CREATED_MEETING_URL: 2,
    UPLOADED: 3,
    MEETING_CREATED: 4,
    FAILED: 5
}

export const CHECK_LOCAL_RECORD_PERIOD = 60000
export const RELOAD_PROGRESS_PERIOD = 2000

export const FILE_TYPES = {
    DOCX: 'docx',
    PDF: 'pdf'
}

export const FOREGROUND_NOTIFICATION_ID = {
    RECORD: 6996,
    UPLOAD: 7997
}

export const NUMBER_TRY_UPLOAD = 3

export const ROLES = {
    admin: {
        id: 1,
        name: I18n.t('role_admin')
    },
    editor: {
        id: 2,
        name: I18n.t('role_editor')
    },
    manager: {
        id: 3,
        name: I18n.t('role_manager')
    },
    chairman: {
        id: 4,
        name: I18n.t('role_chairman')
    },
    deputy: {
        id: 5,
        name: I18n.t('role_deputy')
    },
    user: {
        id: 6,
        name: I18n.t('role_user')
    }
}

export const ROLES_LIST = [
    {
        value: 1,
        name: I18n.t('role_admin')
    },
    {
        value: 2,
        name: I18n.t('role_editor')
    },
    {
        value: 3,
        name: I18n.t('role_manager')
    },
    {
        value: 4,
        name: I18n.t('role_chairman')
    },
    {
        value: 5,
        name: I18n.t('role_deputy')
    },
    {
        value: 6,
        name: I18n.t('role_user')
    }
]

