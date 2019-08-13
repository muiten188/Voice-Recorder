import { COLORS, DEVICE_WIDTH } from '~/src/themesnew/common'

export default {
    tabStyle: {
        height: 56, 
        // paddingTop: 34, 
        // paddingBottom: 20
    },
    indicatorStyle: {
        backgroundColor: COLORS.CERULEAN, 
        height: 2
    },
    barStyle: {
        backgroundColor: COLORS.WHITE, 
        width: DEVICE_WIDTH
    },
    createOrderBtn: {
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: COLORS.GREENISHTEAL,
        height: 40
    },
    addIconBtn: {
        width: 10, 
        height: 10, 
        marginRight: 12
    }
}