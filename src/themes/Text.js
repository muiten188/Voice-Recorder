import React from 'react'
import styled from 'styled-components/native'
import { COLORS } from '~/src/themes/common'
import { Text } from 'react-native'
import { viewStyles } from './View'
export const textStyles = {
    ...viewStyles,
    default: {
        color: COLORS.BLACK,
        fontSize: 13,
        includeFontPadding: false,
        textAlignVertical: 'center',
        // letterSpacing: -0.2,
    },
    title: {
        color: COLORS.TEXT_BLACK,
        fontSize: 14,
        fontSize: 16,
        lineHeight: 24,
        // letterSpacing: -0.2,
    },
    action: {
        fontSize: 12,
        color: COLORS.CERULEAN
    },
    error: {
        fontSize: 11,
        color: COLORS.ERROR_RED
    },
    orange: {
        color: COLORS.ORANGE
    },
    green: {
        color: COLORS.GREEN
    },
    blue: {
        color: COLORS.BLUE
    },
    caption: {
        fontSize: 12,
        color: COLORS.TEXT_GRAY
    },
    label: {
        fontSize: 12,
        color: COLORS.TEXT_BLACK
    },
    textBlack: {
        color: COLORS.TEXT_BLACK
    },
    black: {
        color: COLORS.BLACK
    },
    white: {
        color: COLORS.WHITE
    },
    white54: {
        color: COLORS.WHITE54
    },
    gray: {
        color: COLORS.TEXT_GRAY
    },
    lightGray: {
        color: COLORS.PLACEHOLDER_COLOR
    },
    cerulean: {
        color: COLORS.CERULEAN
    },
    greenishTeal: {
        color: COLORS.GREENISHTEAL
    },
    left: {
        textAlign: 'left'
    },
    center: {
        textAlign: 'center'
    },
    right: {
        textAlign: 'right'
    },
    bold: {
        fontWeight: 'bold'
    },
    medium: {
    },
    s11: {
        fontSize: 11
    },
    s12: {
        fontSize: 12
    },
    s13: {
        fontSize: 13
    },
    s14: {
        fontSize: 14
    },
    s15: {
        fontSize: 15
    },
    s16: {
        fontSize: 16
    },
    s18: {
        fontSize: 18
    },
    s20: {
        fontSize: 20
    },
    s24: {
        fontSize: 24
    },
    s30: {
        fontSize: 30
    },
    s44: {
        fontSize: 44
    },
    s48: {
        fontSize: 48
    },
    lh16: {
        lineHeight: 16
    },
    lh20: {
        lineHeight: 20
    },
    lh24: {
        lineHeight: 24
    },
    lh40: {
        lineHeight: 40
    },
    ls0: {
        letterSpacing: 0
    },
    flex: {
        flex: 1
    },
    'line-through': {
        textDecorationLine: 'line-through'
    },
    whiteBlue: {
        color: COLORS.TEXT_BLUE_WHITE
    },
    inputAccessoryText: {
        fontSize: 15,
        fontFamily: 'SFProText-Medium',
        color: COLORS.CERULEAN,
        paddingHorizontal: 16,
        paddingVertical: 12
    }

}

export default StyledText = (props) => {
    const { className, style, ...passProps } = props
    let styleArr = [textStyles.default]
    if (className) {
        const splitClassName = className.split(' ')
        styleArr = [...styleArr, ...splitClassName.map(item => textStyles[item] || '').filter(item => !!item)]
    }
    return (
        <Text  {...passProps} style={[styleArr, style]} />
    )
}

export const Title = styled.Text`
    font-family: SFProText-Medium;
    color: ${COLORS.TEXT_BLACK};
    font-size: 16;
    lineHeight: 24;
    letter-spacing: -0.2;
    include-font-padding: false;
    text-align-vertical: center;
`

export const Label = styled.Text`
    color: ${COLORS.TEXT_BLACK};
    font-size: 12;
    include-font-padding: false;
    text-align-vertical: center;
`


export const TextBold = styled.Text`
    font-weight: bold;
    color: ${COLORS.BLACK};
    font-size: 14;
    include-font-padding: false;
    text-align-vertical: center;
`

export const ButtonText = styled.Text`
    font-size: 14;
    font-weight: bold;
    include-font-padding: false;
    text-align-vertical: center;
`

export const ActionText = styled.Text`
    font-size: 12;
    color: ${COLORS.CERULEAN};
    include-font-padding: false;
    text-align-vertical: center;
`

export const Caption = styled.Text`
    font-size: 12;
    color: ${COLORS.TEXT_GRAY};
    include-font-padding: false;
    text-align-vertical: center;
`
