import { getFontStyle } from '~/src/utils'
import { Dimensions, PixelRatio, StatusBar } from 'react-native'
const window = Dimensions.get('window')
import { getElevation, scaleWidth } from '~/src/utils'
export const LINE_HEIGHT = PixelRatio.roundToNearestPixel(0.5)
export const DEVICE_WIDTH = window.width
export const DEVICE_HEIGHT = window.height
console.log('DEVICES', DEVICE_WIDTH, DEVICE_HEIGHT)

export const STATUS_BAR_HEIGHT = 20
console.log('STATUS_BAR_HEIGHT', STATUS_BAR_HEIGHT)
export const COLORS = {
    WHITE: '#FFFFFF',
    LIGHT_WHITE: 'rgba(255, 255, 255, 0.8)',
    ERROR: '#ED1C24',
    PRIMARY:"rgb(4,124,215)",
    BLUE: 'rgba(17, 120, 189, 1)',
    BLUE_OPACITY: 'rgba(17, 120, 189, 0.5)',
    DARK_BLUE: 'rgba(7, 82, 133, 1)',
    LIGHT_BLUE: '#D7E8F8',
    LIGHT_BLUE2: '#a0c4e5',
    TRANSPARENT: 'transparent',
    BLACK: '#000000',
    GRAY: '#EAEAEC',
    DARK_GRAY: '#919699',
    LIGHT_GRAY: '#F2F2F2',
    FEATURE_BACKGROUND: 'rgb(246, 246, 246)',
    YELLOW: '#FDAE44',
    RIPPLE: 'rgba(0, 0, 0, 0.12)',
    TEXT_GRAY: 'rgba(0, 0, 0, 0.3)',
    TEXT_GRAY_MIDDLE: 'rgba(0, 0, 0, 0.6)',
    TEXT_BLACK: 'rgba(0, 0, 0, 0.9)',
    STATUS_BAR: '#0255A1',
    WARNING: '#FFC107',
    RED: 'red',
    RED2: 'rgb(255, 51, 51)',
    LIGHT_RED: 'rgba(255, 153, 153, 1)',
    ORANGE: 'rgb(250, 100, 0)',
    LIGHT_ORANGE:'rgb(247,181,0)'
}

export const NEW_COLORS = {
    WHITE: '#FFFFFF',
    BLUE: 'rgb(0, 145, 255)',
    ORANGE: 'rgb(250, 100, 0)',
    GREEN: 'rgb(52,196,124)',
    GRAY: 'rgba(0, 0, 0, 0.5)'

}

export const SIZES = {
    TOOLBAR: 44,
    TOOLBAR_AND_STATUSBAR: 44 + STATUS_BAR_HEIGHT,
    CONTAINER_HORIZONTAL_MARGIN: 16,
    CONTAINER_HORIZONTAL_SPACE: 32,
    CONTAINER_HORIZONTAL_SPACE_AND_MARGIN: 48,
    CONTAINER_HORIZONTAL_SPACE10_AND_MARGIN: 26,
    TITLE_DESCRIPTION: 121,
    TEXT_INPUT_CONTAINER: 69,
    BUTTON_FIELD: 48,
    DIALOG_BUTTON: 42,
    DIALOG_BUTTON_FIELD: 64,
    DIALOG_SPACE: 28,
    BLOCK_TITLE_HEIGHT: 40,
    IMAGE_BACKGROUND_HEIGHT: 116 + 44 + STATUS_BAR_HEIGHT,
    IMAGE_BACKGROUND_HEIGHT_WITHOUT_TOOLBAR: 116,
    BANNER_WIDTH: DEVICE_WIDTH - 52,
    BANNER_HEIGHT: 128,
    BANK_ITEM_HEIGHT: 68,

}


export const THEMES = {
    light: 'light',
    dark: 'dark'
}

export const FONT_WEIGHTS = {
    light: 'light',
    regular: 'regular',
    medium: 'medium',
    bold: 'bold',
    thin: 'thin',
    black: 'black'
}

export const TEXT_STYLES = {
    title: {
        ...getFontStyle(FONT_WEIGHTS.black),
        fontSize: 32,
        lineHeight: 42,
        // letterSpacing: 5
    },
    description: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 14,
        lineHeight: 18,
        // letterSpacing: 10
    },
    info: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 12,
        lineHeight: 16,
    },

    infoResult: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 14,
        lineHeight: 23,
    },
    titleInfo: {
        ...getFontStyle(FONT_WEIGHTS.bold),
        fontSize: 12,
    },
    listItemTitle: {
        fontWeight: 'bold',
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
        lineHeight: 24,
    },
    buttonText: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 14,
        lineHeight: 24,
        // letterSpacing: 10
    },
    textInput: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        fontSize: 14,
        // lineHeight: 24,
        // letterSpacing: 10
    },
    error: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        color: COLORS.ERROR,
        fontSize: 12,
        lineHeight: 18,
        // letterSpacing: 10
    },
    yellow: {
        color: COLORS.YELLOW
    },
    errorNormal: {
        ...getFontStyle(FONT_WEIGHTS.regular),
        color: COLORS.ERROR,
        fontSize: 14,
        lineHeight: 24,
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
        textAlign: 'center'
    },
    black: {
        color: COLORS.TEXT_BLACK
    },
    thin: {
        ...getFontStyle(FONT_WEIGHTS.thin),
    },
    light: {
        ...getFontStyle(FONT_WEIGHTS.light),
    },
    medium: {
        ...getFontStyle(FONT_WEIGHTS.medium),
    },
    bold: {
        ...getFontStyle(FONT_WEIGHTS.bold),
    },
    flex: {
        flex: 1
    }
}

export const TEXT_INPUT_STYLES = {
    white: {
        container: {
            borderBottomWidth: LINE_HEIGHT,
            borderBottomColor: COLORS.WHITE
        },
        icon: {
            color: COLORS.WHITE,
        },
        input: {
            color: COLORS.WHITE,
        },
        placeholderColor: COLORS.LIGHT_WHITE
    },
    blue: {
        container: {
            borderBottomWidth: LINE_HEIGHT,
            borderBottomColor: COLORS.BLUE
        },
        icon: {
            color: COLORS.BLUE,
        },
        input: {
            color: COLORS.BLUE,
        },
        placeholderColor: COLORS.LIGHT_WHITE
    },
    black: {
        container: {
            borderBottomWidth: LINE_HEIGHT,
            borderBottomColor: COLORS.BLACK
        },
        icon: {
            color: COLORS.BLACK,
        },
        input: {
            color: COLORS.BLACK,
        },
        placeholderColor: 'rgba(0, 0, 0, 0.4)'
    },
    noBorder: {
        borderBottomWidth: 0,
        borderBottomColor: 'transparent'
    },
    blackWithDarkblueIcon: {
        container: {
            borderBottomWidth: LINE_HEIGHT,
            borderBottomColor: COLORS.BLACK
        },
        icon: {
            color: COLORS.DARK_BLUE,
        },
        input: {
            color: COLORS.BLACK,
        },
        placeholderColor: 'rgba(0, 0, 0, 0.4)'
    }
}

export const SURFACE_STYLES = {
    screenContainerCommon: {
        flex: 1,
        backgroundColor: COLORS.FEATURE_BACKGROUND
    },
    full: {
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT
    },
    fullWithoutToolbar: {
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT - SIZES.TOOLBAR_AND_STATUSBAR
    },
    content: {
        minHeight: DEVICE_HEIGHT - SIZES.IMAGE_BACKGROUND_HEIGHT
    },
    fullWidth: {
        width: '100%'
    },
    flex: {
        flex: 1
    },
    expand: {
        flex: 1
    },
    columnCenter: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    columnStart: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    columnAllStart: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    columnEnd: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    columnAlignEnd: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    columnAlignStart: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    rowAlignStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    rowAllStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    rowAlignEnd: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    },
    rowEnd: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rowSpacebetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    rowSpacearound: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    rowSpacebetweenNotAlignItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        width: '100%',
        height: 8
    },
    space10: {
        width: '100%',
        height: 10
    },
    space12: {
        width: '100%',
        height: 12
    },
    space16: {
        width: '100%',
        height: 16,
    },
    space20: {
        width: '100%',
        height: 20
    },
    space24: {
        width: '100%',
        height: 24
    },
    space28: {
        width: '100%',
        height: 28
    },
    space30: {
        width: '100%',
        height: 30
    },
    space35: {
        width: '100%',
        height: 35
    },
    space40: {
        width: '100%',
        height: 40
    },
    space50: {
        width: '100%',
        height: 50
    },
    titleAndDescription: {
        height: SIZES.TITLE_DESCRIPTION,
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    transparent: {
        backgroundColor: 'transparent',
    },
    borderBottomBlue: {
        borderBottomWidth: LINE_HEIGHT,
        borderBottomColor: COLORS.BLUE
    },
    borderBottom: {
        borderBottomWidth: LINE_HEIGHT,
        borderBottomColor: COLORS.RIPPLE
    },
    imageBackgroundSmall: {
        minHeight: SIZES.IMAGE_BACKGROUND_HEIGHT_WITHOUT_TOOLBAR
    },
    imageBackgroundSmallFloat: {
        minHeight: SIZES.IMAGE_BACKGROUND_HEIGHT_WITHOUT_TOOLBAR + SIZES.BANK_ITEM_HEIGHT / 2,
    },
    imageBackground: {
        minHeight: SIZES.IMAGE_BACKGROUND_HEIGHT
    },
    imageBackground2: {
        height: SIZES.IMAGE_BACKGROUND_HEIGHT,
        width: DEVICE_WIDTH
    },
    imageBackgroundFloat: {
        minHeight: SIZES.IMAGE_BACKGROUND_HEIGHT + SIZES.BANK_ITEM_HEIGHT / 2
    },
    imageBackgroundFloat2: {
        height: SIZES.IMAGE_BACKGROUND_HEIGHT + SIZES.BANK_ITEM_HEIGHT / 2,
        width: DEVICE_WIDTH
    },
    floatBankItemPart: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SIZES.BANK_ITEM_HEIGHT / 2,
        zIndex: 0
    },
    fakeToolbar: {
        height: SIZES.TOOLBAR_AND_STATUSBAR
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
        width: '100%'
    },
    seperator: {
        width: '100%',
        height: 8,
        backgroundColor: COLORS.FEATURE_BACKGROUND
    },
    seperator16: {
        width: '100%',
        height: 16,
        backgroundColor: COLORS.FEATURE_BACKGROUND
    }
}

export const BUTTON_STYLES = {
    ...SURFACE_STYLES,
    round: {
        borderRadius: 24
    },
    flat: {
        backgroundColor: 'transparent',
        ...getElevation(0)
    },
    'outline-blue': {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.BLUE,
        ...getElevation(0),
        textStyle: {
            color: COLORS.BLUE
        }
    },
    full: {
        width: '100%',
    },
    noPadding: {
        paddingLeft: 0,
        paddingRight: 0
    },
    dialog: {
        height: SIZES.DIALOG_BUTTON,
        borderRadius: SIZES.DIALOG_BUTTON / 2
    }
}

export default {
    button: {
        borderRadius: 2,
        backgroundColor: COLORS.BLUE,
        height: SIZES.BUTTON_FIELD,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        ...getElevation(2)
    },
    buttonGradientLayer: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 24,
    },
    buttonText: {
        ...TEXT_STYLES.buttonText,
        color: COLORS.WHITE,
    },
    buttonDisable: {
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        height: SIZES.BUTTON_FIELD,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        ...getElevation(0)
    },
    buttonTextDisable: {
        ...TEXT_STYLES.buttonText,
        color: COLORS.LIGHT_WHITE,
    },
    buttonIcon: {
        fontSize: 18,
        color: COLORS.WHITE,
        marginRight: 5
    },
    toolbar: {
        container: {
            height: SIZES.TOOLBAR,
            width: DEVICE_WIDTH,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            elevation: 2,
            zIndex: 10000
        },
        iconLeft: {
            fontSize: 24,
        },
        iconLeftContainer: {
            paddingLeft: SIZES.CONTAINER_HORIZONTAL_MARGIN,
            width: SIZES.CONTAINER_HORIZONTAL_SPACE_AND_MARGIN,
            height: SIZES.TOOLBAR,
            flexDirection: 'row',
            alignItems: 'center',
        },
        title: {
            fontSize: 20,
            flex: 1
        },
        iconRightContainer: {
            paddingRight: 16,
            paddingLeft: 8,
            height: SIZES.TOOLBAR,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        iconRight: {
            fontSize: 24,
        },
    },
    textInput: {
        input: {
            flex: 1,
            ...TEXT_STYLES.textInput
        },
        textInputColumnContainer: {
            minHeight: 69,
        },
        textInputColumnContainer2: {
            minHeight: 40,
        },
        textInputContainer: {
            height: 42,
        },
        textInputLabel: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 1)',
            lineHeight: 16,
            textAlign: 'left'
        },
        descriptionIcon: {
            fontSize: 20,
            marginRight: 15
        },
        iconRight: {
            fontSize: 16,
        },
        iconError: {
            fontSize: 16,
            color: COLORS.ERROR
        },
        iconRightContainer: {
            paddingHorizontal: 5,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        }
    }
}