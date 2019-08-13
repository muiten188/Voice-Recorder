import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
export default {
    keyText: {
        color: COLORS.TEXT_BLACK, 
        fontSize: 18
    },
    valueText: {
        color: COLORS.TEXT_BLACK, 
        fontSize: 24
    },
    valueTextContainer: {
        ...SURFACE_STYLES.rowCenter, 
        height: 44, 
        paddingHorizontal: 50, 
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.RIPPLE
    },
    valueTextOuter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 50, 
    }
}