import { Dimensions } from 'react-native'
import { DEVICE_WIDTH } from '~/src/themes/common'

export default {
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    modalContainer: {
        backgroundColor: 'white',
        width: DEVICE_WIDTH,
        bottom: 0
    }
}