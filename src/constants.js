
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
export const LANGUAGES = {
    VI: 'VI',
    EN: 'EN'
}
export const PASSWORD_LENGTH = 6

export const MIN_LENGTH = 6
export const OTP_LENGTH = 4
export const MAX_LENGTH_TENANTCODE = 32
export const MAX_LENGTH_NAME = 80
export const MAX_LENGTH_NOTE_COST = 512
export const MAX_LENGTH_TOTAL_AMOUNT = 19
export const MAX_LENGTH_EMAIL = 320

export const MIN_USERNAME_LENGTH = 6
export const MAX_USERNAME_LENGTH = 32
export const GOOGLE_API_KEY = 'AIzaSyBecXHQELHHMalRRsYO6EZX0k2IQ0rMdc4'
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

export const ORDER_STATUS = {
    DRAFT: 0,
    CREATED: 1,
    WAIT_CONFIRM: 2,
    CONFIRMED: 3,
    WAIT_PAYMENT: 4,
    PAY_SUCCESS: 5,
    IN_TRANSIT: 6,
    DELIVERED: 7,
    COMPLETED: 8,
    REFUND: 9,
    UNKNOW: -1,
    CANCELLED: -2,
    FAIL: -3,
    PAYMENT_FAIL: -4
}

export const ORDER_TAB = {
    ORDER_CREATED: 1,
    ORDER_CONFIRMED: 2,
    ORDER_IN_TRANSIT: 3,
    ORDER_CANCELLED: 4,
    ORDER_COMPLETED: 5,
    ORDER_OFFLINE_WAIT_FOR_PAY: 6,
    ORDER_OFFLINE_PAID: 7,
}

export const ORDER_TYPE = {
    CREATE_QR: 1,
    SCAN_QR: 2,
    MERCHANT: 3,
    ONLINE_BY_USER: 4,
}

export const ORDER_TAB_STATUS_MAPPING = {
    6: [
        ORDER_STATUS.DRAFT,
        ORDER_STATUS.CREATED,
    ],
    7: [
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.PAY_SUCCESS
    ],
}

export const DISCOUNT_TYPE = {
    AMOUNT: 1,
    PERCENTAGE: 2
}

export const FORM_MODE = {
    VIEW: 'VIEW',
    ADD: 'ADD',
    EDIT: 'EDIT'
}

export const DISCOUNT_METHOD = [
    {
        id: DISCOUNT_TYPE.AMOUNT,
        title: I18n.t('by_amount')
    },
    {
        id: DISCOUNT_TYPE.PERCENTAGE,
        title: I18n.t('by_percent')
    }
]

export const PAY_GUID = 'MSHOP'

export const MAX_PRODUCT_VARIANT = 2

export const DEFAULT_VARIANT_DEFS = [
    {
        id: '',
        name: 'Màu sắc',
        values: [
            {
                id: '',
                value: 'Trắng'
            },
            {
                id: '',
                value: 'Đen'
            }
        ]
    },
    {
        id: '',
        name: 'Kích cỡ',
        values: [
            {
                id: '',
                value: 'S'
            },
            {
                id: '',
                value: 'M'
            },
            {
                id: '',
                value: 'L'
            },
        ]
    }
]

export const PAYMENT_METHOD = {
    CASH: 1,
    VNPAY_QR: 2,
    CARD: 3,
    MB_QR: 4
}

export const PAY_METHOD_DISPAY = [
    {
        name: I18n.t('pay_by_cash'),
        icon: 'cash',
        type: PAYMENT_METHOD.CASH
    },
    {
        name: I18n.t('pay_by_atm'),
        icon: 'credit-card',
        type: PAYMENT_METHOD.CARD
    },
    {
        name: I18n.t('pay_by_vnpay_qr'),
        icon: 'qrcode',
        type: PAYMENT_METHOD.VNPAY_QR
    },
    {
        name: I18n.t('pay_by_mb_qr'),
        icon: 'qrcode',
        type: PAYMENT_METHOD.MB_QR
    },
]

export const PAY_FROM = {
    SALE: 'SALE',
    TABLE: 'TABLE'
}

export const TABLE_SELECTOR_MODE = {
    CHANGE: 'CHAGE',
    MERGE: 'MERGE'
}
export const POINT = Dimensions.get("window").width / 375

export const MASTER_ROLE = 1

export const STORE_SALT = 'M/sho?P_2o19'

export const PAGE_SIZE = 30
export const SYNC_ORDER_PERIOD = 180000

export const ADMIN_TAB = 'HOME,SALE,TABLE,REPORT,SETTING'
export const NON_ADMIN_TAB = 'HOME,SALE,TABLE'

export const BLE_ERR = {
    DISCONNECTED: 'DISCONNECTED',
    CHARACTERISTIC_NOT_FOUND: 'CHARACTERISTIC_NOT_FOUND'
}

export const NOTIFICATION_TYPE = {
    WAITING_ORDER: 1,
    // SINGLE_WAITING_ORDER: 1,
    // MULTIPLE_WAITING_ORDER: 2,
    // END_OF_DAY_WAITING_ORDER: 3
}

export const WAITING_ORDER_NOTIFY_PERIOD = 20

export const READ_STATUS = {
    READ: 1,
    NOT_READ: 0
}

export const PRODUCT_STATUS = [
    {
        name: I18n.t('in_sale'),
        value: 0
    },
    {
        name: I18n.t('stop_sale'),
        value: -2
    },
]

export const PRODUCT_STATUS_VALUES = {
    IN_SALE: 0,
    STOP_SALE: -2
}

export const ROLES = {
    OWNER: 1,
    SALE: 4,
    MANAGER: 6
}

export const DB_VERSION = 3

export const VOICE_STATUS = {

    WAITING: 1,
    QUEUING: 2,
    PROCESSING: 3,
    DONE: 4,
    FAILED: 5,
    INITIAL: 6,
}

export const VOICE_STATUS_LIST = [
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