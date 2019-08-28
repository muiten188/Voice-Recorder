import { COLORS } from "~/src/themes/common"
import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')
export default {
    itemOuterActive: {
        backgroundColor: COLORS.WHITE,
        height: 46,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.CERULEAN,
    },
    itemOuter: {
        backgroundColor: COLORS.WHITE,
        height: 46,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.WHITE,
    },

    item: {
        height: 46,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemActive: {
        height: 44,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 12,
        color: 'rgb(26, 24, 36)'
    },
    textActive: {
        fontSize: 12,
        fontWeight: "bold",
        color: COLORS.CERULEAN
    },
    list: {
        width,  
    },
    listContainer: {
        width: '100%',
        backgroundColor: COLORS.WHITE
    }

}