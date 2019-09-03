import React from 'react'
import styled from 'styled-components/native'
import { COLORS } from '~/src/themes/common'
import { ButtonText as Text } from './Text'


const getBackgroundColor = (props) => {
    if (props.disabled) {
        return '#dcdcdc'
    } else if (props.red) {
        return COLORS.LIGHT_RED
    } else {
        return COLORS.GREEN
    }
}

const getTextColor = (props) => {
    if (props.disabled) {
        return COLORS.TEXT_GRAY
    } else if (props.red) {
        return COLORS.RED
    } else {
        return COLORS.WHITE
    }
}

ButtonView = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 36;
    border-radius: 18;
    padding-horizontal: 23;
    background-color: ${props => getBackgroundColor(props)}
`

ButtonText = styled(Text)`
    color: ${props => getTextColor(props)};
    font-weight: normal;
`


export default ActiveButton = (props) => {
    const { disabled, red, green, children, ...passProps } = props
    const tags = { disabled, red, green }
    return (
        <ButtonView
            {...tags}
            {...passProps}>
            {children ?
                children :
                <ButtonText
                    {...tags}
                >
                    {props.text}
                </ButtonText>
            }

        </ButtonView>
    )

}