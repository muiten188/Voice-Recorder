import { COLORS } from "~/src/themes/common"

export default {
    actionBlock: {
        width: '100%',
        padding: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconContainerCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    fileNameInput: {
        borderBottomWidth: 1, 
        borderBottomColor: COLORS.BORDER_COLOR, 
        flex: 1
    }
}
