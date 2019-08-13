import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import { toElevation } from '~/src/utils'

export default {
    rippleContainer: {
        marginBottom: 10
    },
    menu: {
        maxWidth: 150, 
        marginRight: 10, 
        marginTop: 5
    },
    menuItem: {
        ...SURFACE_STYLES.rowStart,
        paddingHorizontal: 8,
        paddingVertical: 16,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: COLORS.RIPPLE
    },
    menuName: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.9)',
    },

    menuItemActive: {
        ...SURFACE_STYLES.rowStart,
        paddingHorizontal: 8,
        paddingVertical: 16,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: COLORS.BLUE,
        backgroundColor: COLORS.BLUE
    },
    menuNameActive: {
        fontSize: 16,
        color: COLORS.WHITE,
    },
    productItemContainer: {
        ...SURFACE_STYLES.columnStart,
        marginTop: 5,
        padding: 10,
        borderRadius: 5,
        width: 200,
        backgroundColor: COLORS.WHITE,
        ...toElevation(5)
    },
    productImage: {
        width: 80,
        height: 80,
        marginBottom: 10
    },
    productItemTouchable: {
        marginRight: 10,
        marginBottom: 10,
    }
}