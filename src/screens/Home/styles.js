import { COLORS, DEVICE_WIDTH } from "~/src/themes/common"
import { getElevation } from '~/src/utils'
const MAIN_FLOATING_WIDTH = 80

export default {
    floatingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column'
    },
    mainFloatingButton: {
        width: MAIN_FLOATING_WIDTH,
        height: MAIN_FLOATING_WIDTH,
        borderRadius: MAIN_FLOATING_WIDTH/2,
    },
    actionContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.WHITE
    },

    mainFloatingButtonTouchable: {
        position: 'absolute',
        bottom: 10,
        left: ( DEVICE_WIDTH - MAIN_FLOATING_WIDTH ) / 2,
        zIndex: 1000
    }
}
