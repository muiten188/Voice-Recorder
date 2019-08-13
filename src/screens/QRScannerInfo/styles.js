import { SURFACE_STYLES } from '~/src/themes/common'
export default {
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
}