import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
export default {
    container: {
        ...SURFACE_STYLES.rowCenter,
    },
    otpItem: {
        width: 45,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.WHITE
    },
    otpItemLast: {
        width: 45,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.WHITE
    },
    otpText: {
        fontSize: 24,
        color: COLORS.WHITE
    }
}