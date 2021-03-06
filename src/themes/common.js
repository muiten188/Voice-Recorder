import { getFontStyle } from "~/src/utils";
import { Dimensions, PixelRatio, StatusBar, Platform } from "react-native";
import { isIphoneX } from 'react-native-iphone-x-helper'
const window = Dimensions.get("window");
export const LINE_HEIGHT = PixelRatio.roundToNearestPixel(0.5);
export const DEVICE_WIDTH = window.width;
export const DEVICE_HEIGHT = window.height;
export const STATUSBAR_HEIGHT = Platform.OS == 'android' ? StatusBar.currentHeight : (isIphoneX() ? 44 : 20)
export const TOOLBAR_HEIGHT = 44
export const Point = Dimensions.get("window").width/375

export const COLORS = {
    WHITE: '#ffffff',
    WHITE54: 'rgba(255, 255, 255, 0.54)',
    BORDER_COLOR: '#efefef', // dddddd
    BACKGROUND_INPUT_COLOR: '#f8f8f8',
    GREEN: '#00a859',
    LIGHT_GREEN: '#cceede',
    BLUE: '#3394ed',
    LIGHT_BLUE: '#c2dffa',
    PRIMARY: "rgb(4,124,215)",
    ERROR: "#ed3338",
    RED: '#ed3338',
    DARK_GRAY: '#aaaaaa',
    LIGHT_RED: '#fde1e1',
    ORANGE: '#f99928',
    BACKGROUND: '#f5f5f5', // rgb(246, 246, 246)
    BACKGROUND2: '#eaeaea',
    BACKGROUND3: 'rgba(0, 0, 0, 0.05)',
    BLACK: '#000000',

    // old
    CERULEAN: 'rgb(4, 124, 215)',
    TEXT_BLACK: 'rgba(0, 0, 0, 0.85)',
    TEXT_GRAY: 'rgba(0, 0, 0, 0.5)',
    BORDER_COLOR2: '#f2f2f2',
    DISABLE_BUTTON: 'rgb(220,220,220)',
    PLACEHOLDER_COLOR: 'rgba(0, 0, 0, 0.25)',
    TEXT_BLUE_WHITE: "rgb(156,212,255)",
    TEXT_RECEIVABLE:"rgb(68,218,182)",
    BACKDROP: 'rgba(0, 0, 0, 0.5)',
    GREENISHTEAL: 'rgb(52, 196, 124)',
    ERROR_RED: 'rgb(224, 32, 32)',
    LIGHT_RED: 'rgb(255, 233, 233)',
    BABY_BLUE: 'rgba(156, 212, 255, 0.1)',
    PALE_LILAC: 'rgb(234, 234, 235)',
    INDICATOR: "rgba(255,255,255,0.4)",
    LIGHT_WHITE: 'rgba(255, 255, 255, 0.85)',
    BLUE_SKIP: "rgb(52,153,229)",
    
};

export const SURFACE_STYLES = {
    screenContainerCommon: {
        flex: 1,
        backgroundColor: COLORS.FEATURE_BACKGROUND
    },
    full: {
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT
    },
    fullWidth: {
        width: "100%"
    },
    flex: {
        flex: 1
    },
    expand: {
        flex: 1
    },
    columnCenter: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    columnStart: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    columnAllStart: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    columnEnd: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    columnAlignEnd: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end"
    },
    columnAlignStart: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    rowCenter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    rowStart: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    rowAlignStart: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    rowAllStart: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    rowAlignEnd: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-end"
    },
    rowEnd: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    rowSpacebetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    rowSpacearound: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    rowSpacebetweenNotAlignItems: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    infoRow: {
        paddingVertical: 5
    },
    mb20: {
        marginBottom: 20
    },
    pd20: {
        padding: 20
    },
    pd8: {
        padding: 8
    },
    pd5: {
        padding: 5
    },
    pv20: {
        paddingVertical: 20
    },
    pv10: {
        paddingVertical: 10
    },
    pt10: {
        paddingTop: 10
    },
    pv16: {
        paddingVertical: 16
    },
    pv8: {
        paddingVertical: 8
    },
    ph8: {
        paddingHorizontal: 8
    },
    space8: {
        width: "100%",
        height: 8
    },
    space10: {
        width: "100%",
        height: 10
    },
    space12: {
        width: "100%",
        height: 12
    },
    space16: {
        width: "100%",
        height: 16
    },
    space18: {
        width: "100%",
        height: 16
    },
    space20: {
        width: "100%",
        height: 20
    },
    space24: {
        width: "100%",
        height: 24
    },
    space28: {
        width: "100%",
        height: 28
    },
    space30: {
        width: "100%",
        height: 30
    },
    space35: {
        width: "100%",
        height: 35
    },
    space40: {
        width: "100%",
        height: 40
    },
    space50: {
        width: "100%",
        height: 50
    },
    containerHorizontalSpace2: {
        paddingHorizontal: 58
    },
    containerHorizontalSpace: {
        paddingHorizontal: 32
    },
    containerHorizontalSpace10: {
        paddingHorizontal: 26
    },
    containerHorizontalMargin: {
        paddingHorizontal: 16
    },
    containerPadding: {
        paddingHorizontal: 8
    },
    white: {
        backgroundColor: COLORS.WHITE
    },
    lightWhite: {
        backgroundColor: COLORS.LIGHT_WHITE
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.3)"
    },
    transparent: {
        backgroundColor: "transparent"
    },
    borderBottomBlue: {
        borderBottomWidth: LINE_HEIGHT,
        borderBottomColor: COLORS.BLUE
    },
    borderBottom: {
        borderBottomWidth: LINE_HEIGHT,
        borderBottomColor: COLORS.RIPPLE
    },
    bottomButtonSpace: {
        height: 50
    },
    titleInfoBlock: {
        paddingVertical: 24
    },
    lineSeperatorBlue: {
        backgroundColor: COLORS.BLUE,
        height: 1,
        marginTop: 20,
        marginBottom: 20,
        width: "100%"
    },
    seperator: {
        width: "100%",
        height: 8,
        backgroundColor: COLORS.FEATURE_BACKGROUND
    },
    seperator16: {
        width: "100%",
        height: 16,
        backgroundColor: COLORS.FEATURE_BACKGROUND
    }
};
export const FONT_WEIGHTS = {
    light: "light",
    regular: "regular",
    medium: "medium",
    bold: "bold",
    thin: "thin",
    black: "black"
};
export const TEXT_STYLES = {
    title: {
        ...getFontStyle(FONT_WEIGHTS.black),
        fontSize: 32,
        lineHeight: 42
        // letterSpacing: 5
    },
    description: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 14,
        lineHeight: 18
        // letterSpacing: 10
    },
    info: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 12,
        lineHeight: 16
    },

    infoResult: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 14,
        lineHeight: 23
    },
    titleInfo: {
        ...getFontStyle(FONT_WEIGHTS.bold),
        fontSize: 12
    },
    listItemTitle: {
        fontWeight: "bold",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.TEXT_BLACK
    },
    listItemCaption: {
        fontSize: 14,
        lineHeight: 18,
        color: COLORS.TEXT_GRAY
    },

    body16: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 16,
        lineHeight: 24
    },
    buttonText: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 14,
        lineHeight: 24
        // letterSpacing: 10
    },
    textInput: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 14
        // lineHeight: 24,
        // letterSpacing: 10
    },
    error: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        color: COLORS.ERROR,
        fontSize: 12,
        lineHeight: 18
        // letterSpacing: 10
    },
    yellow: {
        color: COLORS.YELLOW
    },
    errorNormal: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        color: COLORS.ERROR,
        fontSize: 14,
        lineHeight: 24
        // letterSpacing: 10
    },
    dialogTitle: {
        ...getFontStyle(FONT_WEIGHTS.bold),
        fontSize: 20,
        lineHeight: 24,
        // letterSpacing: 10
        color: COLORS.DARK_BLUE
    },
    dialogBody: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 16,
        lineHeight: 24,
        // letterSpacing: 10
        color: COLORS.BLACK
    },
    white: {
        color: COLORS.WHITE
    },
    lightWhite: {
        color: COLORS.LIGHT_WHITE
    },
    darkBlue: {
        color: COLORS.DARK_BLUE
    },
    blue: {
        color: COLORS.BLUE
    },
    center: {
        textAlign: "center"
    },
    black: {
        color: COLORS.TEXT_BLACK
    },
    thin: {
        ...getFontStyle(FONT_WEIGHTS.thin)
    },
    light: {
        ...getFontStyle(FONT_WEIGHTS.light)
    },
    medium: {
        ...getFontStyle(FONT_WEIGHTS.medium)
    },
    bold: {
        ...getFontStyle(FONT_WEIGHTS.bold)
    },
    flex: {
        flex: 1
    }
};
