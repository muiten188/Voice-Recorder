import { SURFACE_STYLES, COLORS } from '~/src/themes/common'

export default {
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 2,
        // width: 90,
        height: 25,
        borderWidth: 1,
        borderColor: COLORS.BLUE
    },

    minusContainer: {
        ...SURFACE_STYLES.rowCenter,
        borderRightWidth: 1,
        borderRightColor: COLORS.BLUE,  
        height: 25,
        width: 30
    },
    plusContainer: {
        ...SURFACE_STYLES.rowCenter,
        borderLeftWidth: 1,
        borderLeftColor: COLORS.BLUE,
        height: 25,
        width: 30
    },
    textValue: {
        fontSize: 18,
        minWidth: 30,
        ...SURFACE_STYLES.rowCenter,
        textAlign: 'center',
        paddingHorizontal: 5
    }
}