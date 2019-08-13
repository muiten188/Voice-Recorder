import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { getElevation } from '~/src/utils'

export default {
    textLabel: {
        color: 'rgba(0, 0, 0, 0.54)',
    },
    textValue: {
        color: 'rgba(0,0,0,0.9)',
        fontWeight: 'bold',
        fontSize: 14
    },
    item: {
        paddingVertical: 10,
        width: '100%'
    },
    infoContainer: {
        borderRadius: 2,
        // borderColor: COLORS.RIPPLE, 
        // borderWidth: 1, 
        backgroundColor: COLORS.WHITE,
        padding: 20,
        marginBottom: 40,
        ...getElevation(2),
        ...SURFACE_STYLES.columnStart,
        ...SURFACE_STYLES.fullWidth
    }

}