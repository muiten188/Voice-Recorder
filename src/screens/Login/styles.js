import { COLORS, DEVICE_WIDTH, SURFACE_STYLES, DEVICE_HEIGHT } from "~/src/themes/common";

export default {
    container: {
        ...SURFACE_STYLES.columnCenter
    },
    btnHotline: {
        backgroundColor: 'rgb(210,235,255)',
        marginTop: 11,
        marginLeft: 12,
        width: 189,
        height: 40,
        borderRadius: 6,
        alignItems: 'center',
        flexDirection: 'row',
    },
    btnUnderStand: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.PRIMARY,
        width: 134,
        height: 48,
        borderRadius: 6
    },
    imgCall: {
        width: 24,
        height: 24,
        marginLeft: 30
    },
    labelCall: {
        color: COLORS.PRIMARY,
        marginLeft: 11,
        fontSize: 14,
        fontWeight: 'bold'
    },
    labelUnderstand: {
        fontSize: 14,
        color: COLORS.WHITE,
        fontWeight: 'bold'

    },
    lineHorizontal: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginTop: 15.5
    },
    textHeader: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.FEATURE_BACKGROUND
    },
    txtTitlePopup: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.BLACK,
        marginTop: 16
    },
    viewRegister: {
        width: "100%",
        paddingHorizontal: 56,
        alignItems: "center",
        marginTop: -108,
    },
    viewPopupContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT,
        paddingHorizontal: 24,
    },
    viewPopup: {
        width: "100%",
        borderRadius: 6,
        backgroundColor: COLORS.WHITE,
        paddingBottom: 48
        // alignItems: 'center',
    },
    viewBoss: {
        borderLeftWidth: 4,
        borderColor: "rgba(0,0,0,0.1)",
        marginHorizontal: 32,
        marginTop: 39.5
    },
    viewStaff: {
        borderLeftWidth: 4,
        borderColor: "rgba(0,0,0,0.1)",
        marginHorizontal: 32,
        marginTop: 24
    },
    txtDetail: {
        fontSize: 14,
        color: COLORS.BLACK,
        marginLeft: 12
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        bottom: 80,
        position: 'absolute'
    }
};
