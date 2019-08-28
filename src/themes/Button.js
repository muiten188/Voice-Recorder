import React from 'react'
import styled from 'styled-components/native'
import { COLORS } from '~/src/themes/common'
import { ButtonText as Text } from './Text'


const getBackgroundColor = (props) => {
    if (props.disabled) {
        return '#dcdcdc'
    } else if (props.passive) {
        return COLORS.LIGHT_BLUE
    } else if (props.negative) {
        return COLORS.BORDER_COLOR
    } else {
        return COLORS.GREEN
    }
}

const getTextColor = (props) => {
    if (props.disabled) {
        return COLORS.TEXT_GRAY
    } else if (props.passive) {
        return COLORS.CERULEAN
    } else if (props.negative) {
        return COLORS.TEXT_GRAY
    } else {
        return COLORS.WHITE
    }
}

ButtonView = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 56;
    border-radius: 28;
    padding-horizontal: 16;
    background-color: ${props => getBackgroundColor(props)}
`

ButtonText = styled(Text)`
    color: ${props => getTextColor(props)};
`


export default ActiveButton = (props) => {
    const { disabled, passive, negative, children, ...passProps } = props
    return (
        <ButtonView
            passive={passive}
            disabled={disabled}
            negative={negative}
            {...passProps}>
            {children ?
                children :
                <ButtonText
                    disabled={disabled}
                    passive={passive}
                    negative={negative}
                >
                    {props.text}
                </ButtonText>
            }

        </ButtonView>
    )

}