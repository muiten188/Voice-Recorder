import { COLORS } from '~/src/themesnew/common'
import { Platform } from 'react-native'
export default {
    container: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        zIndex: 1000,
        backgroundColor: COLORS.LIGHT_RED,
        paddingTop: Platform.OS == 'ios' ? 20 : 0,
    },
    errorIcon: {
        width: 24,
        height: 24,
        marginRight: 12
    },
    closeIcon: {
        width: 20,
        height: 20,
        marginLeft: 16
    },
}