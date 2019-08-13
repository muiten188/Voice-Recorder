import { COLORS } from '~/src/themesnew/common'
import { getWidth } from '~/src/utils'

export default {
    saveBtn: {
        width: getWidth(178)
    },
    badgeView: {
        paddingHorizontal: 3,
        paddingVertical: 1,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
        backgroundColor: COLORS.CERULEAN
    },
    badgeText: {
        fontSize: 11,
        color: COLORS.WHITE
    },
}