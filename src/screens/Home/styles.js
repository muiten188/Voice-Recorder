import { COLORS } from "~/src/themes/common"

export default {
    actionBlock: {
        width: '100%',
        padding: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconContainerCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: COLORS.BORDER_COLOR2
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: COLORS.BORDER_COLOR2
    }
}
