import commonStyle, { COLORS, SURFACE_STYLES } from '~/src/themes/common'
export default {
    container: {

    },
    bottomButtonContainer: {
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: 10, 
        backgroundColor: COLORS.WHITE
    },
    titleBlock: {
        color: 'rgba(0, 0, 0, 0.9)',
        fontWeight: 'bold',
        paddingVertical: 10
    },
    title: {
        color: 'rgba(0, 0, 0, 0.9)',
        width: 110,
    },
    block: {
        marginBottom: 8, 
        paddingHorizontal: 8, 
        backgroundColor: COLORS.WHITE,
    },
    subBlock: {
        ...SURFACE_STYLES.rowAlignStart,
        borderBottomColor: COLORS.RIPPLE,
        borderBottomWidth: 0.5,
        paddingBottom: 8,
        marginBottom: 8, 
    },
    input: {
        borderWidth: 1, 
        borderRadius: 2, 
        width: 100, 
        borderColor: COLORS.RIPPLE,
        paddingTop: 0,
        paddingBottom: 0,
        height: 36
    },
    input2: {
        borderWidth: 1, 
        borderRadius: 2, 
        flex: 1,
        borderColor: COLORS.RIPPLE,
        paddingTop: 0,
        paddingBottom: 0,
        height: 36
    },
    rowInput: {
        ...SURFACE_STYLES.rowSpacebetween,
        marginBottom: 5
    },
    headerContainer: {
        ...SURFACE_STYLES.rowSpacebetween,
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.RIPPLE,
        backgroundColor: COLORS.WHITE
    }

}