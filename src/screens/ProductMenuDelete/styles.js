import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
export default {
    menuItem: {
        ...SURFACE_STYLES.rowStart,
        ...SURFACE_STYLES.borderBottom,
        paddingHorizontal: 8, 
        paddingVertical: 16
    },
    menuName: { 
        fontSize: 18, 
        color: 'rgba(0, 0, 0, 0.9)', 
        flex: 1, marginRight: 16 
    },
    iconRight: {
        color: 'rgba(0, 0, 0, 0.6)', 
        fontSize: 18
    }
}