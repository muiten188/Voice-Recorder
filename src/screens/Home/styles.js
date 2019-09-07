import { COLORS } from "~/src/themes/common"
import { getElevation } from '~/src/utils'

export default {
    floatingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column'
    },
    mainFloatingButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    actionContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
}
