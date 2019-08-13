import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

export const borderLeftRightWidth = 40

const holdSize = width - borderLeftRightWidth * 2

const borderTopWidth = (height - 56 - holdSize) / 2 + 10

const borderBottomWidth = (height - 56 - holdSize) / 2 - 10

const pixelRatio = 1 //PixelRatio.get()

const holdSpan = 8

export default {

    holdView: {
        left: borderLeftRightWidth / pixelRatio - holdSpan,
        top: borderTopWidth / pixelRatio - holdSpan,
        width: holdSize / pixelRatio + holdSpan * 2,
        height: holdSize / pixelRatio + holdSpan * 2,
        right: (width - borderLeftRightWidth) / pixelRatio + holdSpan,
        bottom: (height - 56 - borderBottomWidth) / pixelRatio + holdSpan,
    },

    container: {
        flex: 1,
    },

    hintText: {
        position: 'absolute',
        top: borderTopWidth - holdSpan - 55,
        width: width,
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        paddingLeft: 60,
        paddingRight: 60,
        fontWeight: 'bold'
    },

    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: width,
        height: height - 56,
    },

    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        width: width,
        height: height - 56,
        alignItems: 'center',
    },

    topOverlay: {
        top: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },

    frameOverlayView: {
        borderLeftWidth: borderLeftRightWidth,
        borderRightWidth: borderLeftRightWidth,
        borderTopWidth: borderTopWidth,
        borderBottomWidth: borderBottomWidth,
        borderColor: 'rgba(1, 1, 1, 0.5)'
    },
    frameOverlayViewBlack: {
        borderLeftWidth: borderLeftRightWidth,
        borderRightWidth: borderLeftRightWidth,
        borderTopWidth: borderTopWidth,
        borderBottomWidth: borderBottomWidth,
        borderColor: 'black'
    },
    cartBar: {
        ...SURFACE_STYLES.rowSpacebetween,
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 8,
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        left: 0, 
        right: 0,
        zIndex: 100
    },
    cartIconContainer: {
        paddingRight: 10,
        paddingVertical: 5
    },
    cartBadge: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 0, 0, 0.85)',
        position: 'absolute',
        top: 0, 
        right: 0,
        zIndex: 200
    },
    cartBadgeText: {
        color: COLORS.WHITE,
        fontSize: 10
    }
}