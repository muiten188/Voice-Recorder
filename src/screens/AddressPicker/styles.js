import { COLORS } from '~/src/themes/common'
import { toElevation } from '~/src/utils'

export default {
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    map: {
        flex: 1
    },
    buttonBottomContainer: {
        // position: 'absolute',
        minHeight: 50,
        // bottom: 0,
        // left: 0,
        // right: 0,
        backgroundColor: 'white',
        ...toElevation(2),
    },
    buttonNextContainer: {
        backgroundColor: COLORS.BLUE,
        margin: 8,
        padding: 8,
        borderRadius: 4,
    },
    textWhite: {
        color: 'white',
        fontSize: 15
    },
    geoCodingItem: {
        padding: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    text: {
        color: 'rgba(0, 0, 0, 0.9)'
    },
    textBold: {
        color: 'rgba(0, 0, 0, 0.9)',
        fontWeight: 'bold'
    },
    geoCodingHeader: {
        padding: 10,
        backgroundColor: COLORS.FEATURE_BACKGROUND
    },
    iconCheckActive: {
        fontSize: 20,
        color: COLORS.BLUE
    },
}