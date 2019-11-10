import { COLORS, DEVICE_HEIGHT } from "~/src/themes/common"

export default {
    actionBlock: {
        width: '100%',
        padding: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconContainerCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    fileNameInput: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER_COLOR,
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 8,
        paddingBottom: 8
    },

    // popup save
    backdrop: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.BACKDROP
    },
    popupOuter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 6,
        marginHorizontal: 24,
        flex: 1,
        maxHeight: DEVICE_HEIGHT - 100
    },
    header: {
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER_COLOR
    },
    warningIcon: {
        width: 21,
        height: 18,
        marginRight: 8
    },
    buttonBlock: {
        marginTop: 8,
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonLeft: {
        flex: 1,
        marginRight: 8
    },
    buttonRight: {
        flex: 1,
    },
    popupContent: {
        paddingHorizontal: 24
    }
}
