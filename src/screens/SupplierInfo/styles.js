import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { getElevation } from '~/src/utils'
export default {
    iconContainer: {
        paddingRight: 10,
    },
    textLabel: {
        color: 'rgba(0, 0, 0, 0.54)',
    },
    textValue: {
        color: 'rgba(0,0,0,0.9)',
        fontWeight: 'bold',
        fontSize: 14
    },
    viewSave: {
        // backgroundColor: "red",
        width: "100%",
        // backgroundColor:COLORS.PRIMARY,
        alignItems: "center",
        justifyContent: "center",
        height: 46,
        marginTop: 'auto',
    },
    item: {
        paddingVertical: 10,
        ...SURFACE_STYLES.borderBottom
    },
    autoCompleteContainer: {
        ...getElevation(2),
        margin: 2,
        zIndex: 100,
        backgroundColor: COLORS.WHITE
    },
    autoCompleteItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.12)'
    },
    autoCompleteText: {
        color: 'rgba(0,0,0,0.9)'
    },
    btnCall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.BORDER_COLOR,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "center"
    },
    btnMess: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.BORDER_COLOR,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 24
    },
}