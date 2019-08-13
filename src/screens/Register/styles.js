import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { getElevation } from '~/src/utils'
export default {
    viewHeader:{
        backgroundColor: COLORS.PRIMARY,
        width:'100%',
        height:149
    },
    textHeader:{
        fontSize:18,
        color:COLORS.FEATURE_BACKGROUND,
        // fontWeight:"bold"
    },
    textTitle:{
        fontSize:14,
        color:'rgb(24,24,36)',
        marginTop: 24,
    },
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
}