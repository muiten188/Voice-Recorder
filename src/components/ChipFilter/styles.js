import commonStyle, { COLORS, SURFACE_STYLES } from '~/src/themes/common'
export default {
    item: {
        paddingHorizontal: 8,
        backgroundColor: COLORS.WHITE
    },
    variantNameContainer: {
        ...SURFACE_STYLES.rowSpacebetween,
        ...SURFACE_STYLES.borderBottom,
        paddingVertical: 10,
    },
    variantName: {
        color: COLORS.TEXT_BLACK,
        fontWeight: 'bold'
    },
    function: {
        color: COLORS.BLUE
    },
    chipItem: {
        paddingHorizontal: 16,
        height: 32,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: COLORS.RIPPLE,
        // minWidth: 50,
        ...SURFACE_STYLES.rowCenter
    },
    chipContainer: {
        paddingTop: 5,
        paddingRight: 5,
        marginRight: 5
    },
    variantValueItemContainer: {
        paddingVertical: 10
    },
    variantNameTextInput: {
        minWidth: 150,
        paddingTop: 0,
        paddingBottom: 0,
        color: COLORS.TEXT_BLACK,
        fontWeight: 'bold'
    },
    newVariantNameTextInput: {
        minWidth: 100,
        paddingTop: 0,
        paddingBottom: 0,
        height: 40
    },
   
}