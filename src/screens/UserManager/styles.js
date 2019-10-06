import { DEVICE_WIDTH, COLORS } from '~/src/themes/common'
const FLOATING_WIDTH = 80

export default {
    floatingButton: {
        width: FLOATING_WIDTH,
        height: FLOATING_WIDTH,
        borderRadius: FLOATING_WIDTH / 2,
    },
    floatingButtonTouchable: {
        position: 'absolute',
        bottom: 10,
        left: (DEVICE_WIDTH - FLOATING_WIDTH) / 2,
        zIndex: 1000
    }, 
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 12
    },
    moreIcon: {
        width: 5,
        height: 19,
        marginHorizontal: 16
    }
}
