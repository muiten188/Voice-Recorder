import { SURFACE_STYLES, COLORS } from '~/src/themes/common'

export default {
    menuName: {
        marginLeft: 10,
        color: COLORS.DARK_GRAY
    },
    menuNameActive: {
        marginLeft: 10,
        color: COLORS.WHITE
    },

    iconActive: {
        color: COLORS.WHITE
    },
    icon: {
        color: COLORS.DARK_GRAY
    },

    toggleItemActive: {
        ...SURFACE_STYLES.rowCenter, 
        width: 150, 
        height: 40, 
        backgroundColor: COLORS.BLUE, 
        borderWidth: 1, 
        borderColor: COLORS.BLUE
    },
    toggleItem: {
        ...SURFACE_STYLES.rowCenter, 
        width: 150, 
        height: 40, 
        backgroundColor: COLORS.WHITE, 
        borderWidth: 1, 
        borderColor: COLORS.RIPPLE
    },
    leftRadius: {
        borderTopLeftRadius: 10, 
        borderBottomLeftRadius: 10, 
    },
    rightRadius: {
        borderTopRightRadius: 10, 
        borderBottomRightRadius: 10, 
    }
}