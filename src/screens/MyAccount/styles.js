import { STATUSBAR_HEIGHT } from '~/src/themes/common'
import { COLORS } from '~/src/themes/common'
export default {
    floatingButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: COLORS.WHITE,
        borderWidth: 2,
        marginBottom: 12
    },
    moreIcon: {
        width: 5,
        height: 19,
        marginHorizontal: 16
    },
    gradientContainer: {
        height: 166 + STATUSBAR_HEIGHT
    },
    backIconTouchable: {
        position: 'absolute',
        top: 12 + STATUSBAR_HEIGHT,
        left: 12,
        zIndex: 100,
    },
    backIcon: {

        width: 24,
        height: 24
    },
    actionIcon: {
        width: 64,
        height: 64,
        borderRadius: 32
    },
    actionContainer: {
        top: -30,
        zIndex: 1000
    },
    fieldIcon: {
        width: 23,
        height: 18,
        marginRight: 24
    },
    fieldIcon2: {
        width: 20,
        height: 23,
        marginRight: 24
    },
    infoBlock: {
        top: -40
    },
    dropdown: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#ededed',
        paddingBottom: 6

    }
}
