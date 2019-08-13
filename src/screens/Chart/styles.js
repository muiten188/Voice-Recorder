import { SURFACE_STYLES, LINE_HEIGHT } from '~/src/themes/common'
import { COLORS } from '~/src/themesnew/common'

export default {
    block: {
        paddingHorizontal: 8,
        marginBottom: 8
    },
    label: {
        lineHeight: 30,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 13
    },
    paymentMethodItem: {
        ...SURFACE_STYLES.rowStart,
        ...SURFACE_STYLES.borderBottom,
        minHeight: 60,
        paddingHorizontal: 8
    },
    paymentMethodItemLeft: {
        ...SURFACE_STYLES.rowStart,
        flex: 1
    },
    payMethodText: {
        color: COLORS.TEXT_BLACK,
        fontSize: 16,
        marginLeft: 10
    },
    paymentMethodMoney: {
        color: COLORS.BLUE,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10
    },
    header: {
        color: COLORS.TEXT_BLACK,
    },
    headerContainer: {
        ...SURFACE_STYLES.rowStart,
        borderBottomWidth: LINE_HEIGHT,
        borderBottomColor: COLORS.RIPPLE,
        borderTopWidth: LINE_HEIGHT,
        borderTopColor: COLORS.RIPPLE,
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    periodContainer: {
        ...SURFACE_STYLES.rowSpacebetween,
        paddingVertical: 12,
        paddingHorizontal: 8
    },
    dropdownText: {
        color: COLORS.TEXT_BLACK,
        fontSize: 14,
    },
    forwardArrow: {
        width: 6,
        height: 10,
        backgroundColor: COLORS.WHITE,
        marginLeft: 6
    }
}