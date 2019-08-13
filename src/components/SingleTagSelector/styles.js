import { SURFACE_STYLES, DEVICE_WIDTH, COLORS } from '~/src/themes/common'
export default {
    tagSelected: {
        ...SURFACE_STYLES.rowStart,
        paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20,
        borderWidth: 0,
        borderColor: 'transparent',
        marginRight: 8,
        backgroundColor: COLORS.BLUE
    },
    textTagSelected: {
        color: COLORS.WHITE
    },
    tagUnselected: {
        ...SURFACE_STYLES.rowStart,
        paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20,
        borderWidth: 1, borderColor: COLORS.TEXT_GRAY,
        marginRight: 8,
        backgroundColor: COLORS.WHITE
    },
    textTagUnselected: {
        color: COLORS.TEXT_GRAY
    },
    iconContainer: {
        ...SURFACE_STYLES.rowCenter,
        marginRight: 5
    }
}