import { COLORS } from '~/src/themes/common'
import { toElevation } from "~/src/utils"

export default {
    selectItem: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
        borderRadius: 2,
    },
    text: {
        color: 'rgba(0,0,0,0.9)',
        fontSize: 14
    },
    dropdownIcon: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: 10,
        marginLeft: 28
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    listValueContainer: {
        position: 'absolute',
        backgroundColor: COLORS.WHITE,
        maxHeight: 170,
        zIndex: 100,
        ...toElevation(2)
    },
    listValueContainerScroll: {
        backgroundColor: COLORS.WHITE,
        maxHeight: 170
    },
    listValueItem: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }

}