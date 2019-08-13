import { chainParse } from '~/src/utils'
import lodash from 'lodash'

const emptyArray = []
const emptyObj = {}

export const connectedBluetoothPrinterSelector = lodash.memoize((state) => {
    return chainParse(state, ['printer', 'bluetoothDevices']) || emptyObj
})