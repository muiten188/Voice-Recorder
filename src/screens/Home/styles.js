import { DEVICE_WIDTH, SURFACE_STYLES, COLORS } from "~/src/themesnew/common";

import { toElevation, getFontStyle } from "~/src/utils";
import { POINT as point } from "~/src/constants"
// const point = POINT
export default {
    container: {
        flex: 1
    },
    containerHeader: {
        height: 302,
        overflow: "hidden",
        backgroundColor: COLORS.PRIMARY,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6

    },
    viewButton: {
        backgroundColor: COLORS.BABY_BLUE,
        borderRadius: 6,
        alignItems: 'center',
        height: 64,
        flexDirection: 'row',
        width: point * 153
    },
    viewButtonFull: {
        backgroundColor: COLORS.BABY_BLUE,
        borderRadius: 6,
        alignItems: 'center',
        height: 64,
        flexDirection: 'row',
    },
    iconButton: {
        width: 32,
        height: 32,
        marginLeft: point * 8
    },
    viewOption: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: point * 24,
        borderRadius: 6,
        marginTop: -40,
        height: 80,
        justifyContent: 'center',
        width: 327 * point,
        zIndex: 1000
        // paddingHorizontal: 8*point
    },
    txtlableButton: {
        fontSize: 12,
        color: COLORS.CERULEAN,
        fontWeight: 'bold',
        marginLeft: point * 8,
        flex: 1,
        marginRight: 8
    },
    imgArrowRight: {
        width: 6,
        height: 10,
        marginLeft: 'auto',
        marginRight: point * 6,
    },
    functionContainer: {
        ...SURFACE_STYLES.rowCenter,
        marginHorizontal: 16,
        borderRadius: 10,
        height: 80,
        backgroundColor: COLORS.WHITE,
        paddingVertical: 8,
        top: -25,
        ...toElevation(5)
    },
    funcionItem: {
        ...SURFACE_STYLES.rowCenter,
        width: DEVICE_WIDTH / 2 - 16,
        height: "100%",
        padding: 10
    },
    functionText: {
        color: COLORS.BLUE,
        fontSize: 13,
        fontWeight: "bold",
        flex: 1
    },
    infoItem: {
        ...SURFACE_STYLES.rowSpacebetween,
        paddingHorizontal: 16,
        minHeight: 58,
        borderRadius: 10,
        backgroundColor: COLORS.WHITE,
        marginBottom: 10
    },
    infoLabel: {
        color: "rgba(0, 0, 0, 0.85)",
        fontSize: 13,
        ...getFontStyle("light")
    },
    infoValue: {
        color: "rgba(0, 0, 0, 0.85)",
        fontSize: 17,
        fontWeight: "bold"
    },
    showCaseTitle: {
        color: "rgba(0, 0, 0, 0.85)",
        fontSize: 13,
        ...getFontStyle("medium")
    },
    text: {
        color: "rgba(0, 0, 0, 0.85)",
        fontSize: 13
    },
    viewAll: {
        color: COLORS.BLUE,
        fontSize: 13,
        ...getFontStyle("light")
    },
    borderBottom: {
        borderBottomWidth: 0.5,
        borderBottomColor: "rgba(0, 0, 0, 0.1)"
    },
    borderRight: {
        borderRightWidth: 0.5,
        borderRightColor: "rgba(0, 0, 0, 0.1)"
    },
    iconDescriptionContainer: {
        paddingRight: 13
    },
    dealTitleContainer: {
        position: "absolute",
        bottom: 0,
        paddingHorizontal: 8,
        paddingVertical: 16,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        // backgroundColor: COLORS.WHITE
        backgroundColor: "transparent"
    },
    actionIcon: {
        fontSize: 30,
        color: COLORS.BLUE
    },
    badgeView: {
        paddingHorizontal: 3,
        paddingVertical: 1,
        borderRadius: 8,
        backgroundColor: COLORS.ORANGE,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1000
    },
    titleActivities: {
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 18,
        color: COLORS.TEXT_GRAY
    },
    txtSeeAll: {
        color: COLORS.TEXT_GRAY,
        fontSize: 12,


    }
}
