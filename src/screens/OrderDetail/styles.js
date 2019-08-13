import { DEVICE_HEIGHT, COLORS } from '~/src/themesnew/common'

export default {
    createOrderBtn: {
        width: 146,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    createOrderText: {
        color: COLORS.WHITE,
        fontWeight: 'bold'
    },
    leftBtn: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 24,
        flex: 1
    },
    forwarImage: {
        width: 46,
        height: 46,
        transform: [{ rotate: '180deg' }]
    },
    totalAmount: {
        fontSize: 16,
        color: COLORS.TEXT_BLACK,
        letterSpacing: -0.27,
        marginLeft: 16,
        fontWeight: 'bold'
    },
    badgeView: {
        // width: 16,
        // height: 16,
        paddingHorizontal: 3,
        paddingVertical: 1,
        borderRadius: 8,
        backgroundColor: COLORS.GREENISHTEAL,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
    },
    badgeText: {
        color: COLORS.WHITE,
        fontSize: 11,
        letterSpacing: -0.19,
        fontWeight: 'bold',
        zIndex: 100,
    },
    cartIconContainer: {
        paddingTop: 5,
        paddingRight: 5
    },


    badgeText: {
        fontSize: 11,
        color: COLORS.WHITE
    },

    leftView: {
        width: 118,
        paddingLeft: 24,
        paddingRight: 14,
    },
    leftViewLarge: {
        width: 118,
        paddingLeft: 24,
        paddingRight: 14,
        height: 82,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: -0.24,
        color: COLORS.TEXT_GRAY
    },
    totalValue: {
        fontSize: 20,
        fontWeight: "bold",
        letterSpacing: -0.34,
        color: COLORS.TEXT_BLACK
    },
    orderCode: {
        fontSize: 14,
        fontWeight: "bold",
        letterSpacing: -0.24,
        color: COLORS.CERULEAN
    },
    addIcon: {
        width: 16,
        height: 16,
        marginRight: 8
    }

}