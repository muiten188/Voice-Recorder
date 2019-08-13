import { COLORS, SURFACE_STYLES } from '~/src/themesnew/common'
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

    leftView: {
        width: 118,
        paddingLeft: 24,
        paddingRight: 14,
    },
    leftViewLarge: {
        width: 118,
        paddingLeft: 24,
        paddingRight: 14,
        // height: 89,
    },
    textInput: {
        fontSize: 14,
        flex: 1,
        height: 16,
        paddingTop: 0,
        paddingBottom: 0
    },
    textInputDescription: {
        fontSize: 14,
        color: COLORS.TEXT_BLACK,
        flex: 1,
        height: 46,
        paddingTop: 0,
        paddingBottom: 0,
        textAlignVertical: 'top'
    },
    textInputAddress: {
        fontSize: 14,
        color: COLORS.TEXT_BLACK,
        flex: 1,
        height: 32,
        paddingTop: 0,
        paddingBottom: 0,
        textAlignVertical: 'top'
    }
}