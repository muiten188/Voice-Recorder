import React from 'react'
import { View } from 'react-native'
import { COLORS } from './common'
import { STATUSBAR_HEIGHT } from '~/src/themes/common'

export const viewStyles = {
    'statusbar': {
        height: STATUSBAR_HEIGHT
    },

    'row-start': {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    'row-end': {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    'row-align-start': {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    'row-all-start': {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    'row-center': {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    'row-space-between': {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    'flex': {
        flex: 1

    },
    'column-center': {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    'column-all-start': {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    'column-start': {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    'column-end': {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    'column-align-end': {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    'column-align-start': {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    'border-bottom': {
        borderBottomColor: COLORS.BORDER_COLOR,
        borderBottomWidth: 1,
    },
    'border-right': {
        borderRightColor: COLORS.BORDER_COLOR,
        borderRightWidth: 1,
    },
    'border-top': {
        borderTopColor: COLORS.BORDER_COLOR,
        borderTopWidth: 1,
    },
    'border-top2': {
        borderTopColor: COLORS.BORDER_COLOR2,
        borderTopWidth: 1,
    },
    'border-bottom2': {
        borderBottomColor: COLORS.BORDER_COLOR2,
        borderBottomWidth: 1,
    },
    'border-left2': {
        borderLeftColor: COLORS.BORDER_COLOR2,
        borderLeftWidth: 1,
    },
    'space8': {
        width: '100%',
        height: 8,
    },
    'space10': {
        width: '100%',
        height: 10,
    },
    'space12': {
        width: '100%',
        height: 12,
    },
    'space14': {
        width: '100%',
        height: 14
    },
    'space16': {
        width: '100%',
        height: 16,
    },
    'space18': {
        width: '100%',
        height: 18,
    },
    'space20': {
        width: '100%',
        height: 20
    },
    'space25': {
        width: '100%',
        height: 25,
    },
    'space24': {
        width: '100%',
        height: 24
    },
    'space26': {
        width: '100%',
        height: 26
    },
    'space32': {
        width: '100%',
        height: 32
    },
    'space36': {
        width: '100%',
        height: 36
    },
    'space40': {
        width: '100%',
        height: 40
    },
    space56: {
        width: '100%',
        height: 56
    },

    'space60': {
        width: '100%',
        height: 60
    },
    'space50': {
        width: '100%',
        height: 50,
    },
    'space100': {
        width: '100%',
        height: 100,
    },
    'space120': {
        width: '100%',
        height: 120,
    },
    'space150': {
        width: '100%',
        height: 150,
    },
    'ph8': {
        paddingHorizontal: 8,
    },
    'ph14': {
        paddingHorizontal: 14,
    },
    'ph16': {
        paddingHorizontal: 16,
    },
    'ph18': {
        paddingHorizontal: 18,
    },
    'ph24': {
        paddingHorizontal: 24,
    },
    'ph32': {
        paddingHorizontal: 32,
    },
    'pv4': {
        paddingVertical: 4,
    },
    'ph34': {
        paddingHorizontal: 34,
    },
    'ph44': {
        paddingHorizontal: 44,
    },
    'ph54': {
        paddingHorizontal: 54,
    },
    'ph56': {
        paddingHorizontal: 56,
    },
    'pv8': {
        paddingVertical: 8,
    },
    'pv10': {
        paddingVertical: 10,
    },
    'pv16': {
        paddingVertical: 16,
    },
    'pv18': {
        paddingVertical: 18,
    },
    'pv24': {
        paddingVertical: 24,
    },
    pv32: {
        paddingVertical: 32
    },
    pd32: {
        padding: 32
    },
    'pv14': {
        paddingVertical: 14,
    },
    'pv12': {
        paddingVertical: 12,
    },
    'white': {
        backgroundColor: COLORS.WHITE,
    },
    'background': {
        backgroundColor: COLORS.BACKGROUND,
    },
    mb4: {
        marginBottom: 4
    },
    'mb6': {
        marginBottom: 6,
    },
    'mb8': {
        marginBottom: 8,
    },
    mb10: {
        marginBottom: 10,
    },

    mt24: {
        marginTop: 24
    },
    'pt16': {
        paddingTop: 16,
    },
    pt8: {
        paddingTop: 8
    },
    'pb8': {
        paddingBottom: 8,
    },
    'ml10': {
        marginLeft: 10,
    },
    'ml24': {
        marginLeft: 24,
    },
    'pt24': {
        paddingTop: 24,
    },
    pt14: {
        paddingTop: 14
    },
    'pb16': {
        paddingBottom: 16
    },
    'pb12': {
        paddingBottom: 12
    },
    'mh24': {
        marginHorizontal: 24
    },
    mh8: {
        marginHorizontal: 8
    },

    pl24: {
        paddingLeft: 24
    },
    pr16: {
        paddingRight: 16
    },
    'bottom': {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: COLORS.WHITE
    },
    'transparent': {
        backgroundColor: 'transparent'
    },
    wrap: {
        flexWrap: 'wrap'
    },
    leftLabelBorder: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 118,
        paddingVertical: 16,
        paddingLeft: 24,
        paddingRight: 8,
        borderRightWidth: 1,
        borderRightColor: COLORS.BORDER_COLOR2
    },
    leftLabel: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 118,
        paddingVertical: 16,
        paddingLeft: 24,
        paddingRight: 8,
    },
    inputAccessoryView: {
        backgroundColor: COLORS.BACKGROUND,
        borderTopColor: COLORS.BORDER_COLOR,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

}

export default StyledView = (props) => {
    const { className, style, ...passProps } = props
    let styleArr = []
    if (className) {
        const splitClassName = className.split(' ')
        styleArr = splitClassName.map(item => viewStyles[item] || '').filter(item => !!item)
    }
    return (
        <View  {...passProps} style={[styleArr, style]} />
    )
}