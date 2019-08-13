import React, { Component, PureComponent } from 'react'
import commonStyle from '~/src/themes/common'
import Ripple from 'react-native-material-ripple'
import Surface from '~/src/themes/Surface'
import Text from '~/src/themes/Text'
import Icon from '~/src/themes/Icon'
import { View } from 'react-native'
import { BUTTON_STYLES } from '~/src/themes/common'
import PropTypes from 'prop-types'
import LinearGradient from 'react-native-linear-gradient'
import { getElevation } from '~/src/utils'

export default class Button extends PureComponent {
    static defaultProps = {
        textTransform: String.prototype.toUpperCase
    }

    render() {
        const { forwardedRef, children, style, theme, icon, iconStyle, textStyle, enable,
            buttonEnableStyle, buttonDisableStyle, buttonTextEnableStyle, buttonTextDisableStyle,
            leftComponent, rightComponent, centerComponent, innerExpand,
            t, textTransform, text,
            gradientButton = false, gradientProps = {}, gradientStyle, rippleStyle,
            gradientWhiteLayer = false,
            ...rest } = this.props
        let buttonThemeStyle = [commonStyle.button]
        let textButtonStyle = [commonStyle.buttonText, textStyle]
        if (enable != null && typeof (enable) != 'undefined') {
            if (!enable) {
                buttonThemeStyle = [...buttonThemeStyle, commonStyle.buttonDisable, buttonDisableStyle]
                textButtonStyle = [...textButtonStyle, commonStyle.buttonTextDisable, buttonTextDisableStyle]
            } else {
                buttonThemeStyle = [...buttonThemeStyle, buttonEnableStyle]
                textButtonStyle = [...textButtonStyle, buttonTextEnableStyle]
            }
        }
        for (let identifier in rest) {
            if (BUTTON_STYLES[identifier]) {
                const { textStyle, ...restButtonStyle } = BUTTON_STYLES[identifier]
                buttonThemeStyle.push(restButtonStyle)
                if (textStyle) {
                    textButtonStyle.push(textStyle)
                }
            }
        }
        buttonThemeStyle.push(style)
        const buttonTextElement = typeof (t) != 'undefined' ? <Text themeable={false} style={textButtonStyle} t={t} textTransform={textTransform} /> :
            typeof (text) != undefined ? <Text themeable={false} style={textButtonStyle}>{text}</Text> : <Surface themeable={false} />
        const center = centerComponent ? centerComponent() : (
            <Surface themeable={false} rowCenter
                expand={!!innerExpand}
            >
                {!!icon && <Icon name={icon} style={[commonStyle.buttonIcon, iconStyle]} />}
                {buttonTextElement}
            </Surface>
        )

        const ButtonComponent = enable === false ? View : Ripple
        if (gradientButton) {
            if (typeof (enable) === 'undefined' || enable === true) {
                buttonThemeStyle.push(
                    { opacity: 1 }
                )
            } else if (enable === false) {
                buttonThemeStyle.push(
                    { opacity: 0.45 }
                )
            }
            const elevationObj = enable ? getElevation(4) : {}
            return (
                <ButtonComponent ref={forwardedRef}
                    rippleColor={'white'}
                    style={rippleStyle}
                    {...rest}>
                    <Surface themeable={false} style={gradientWhiteLayer ? [commonStyle.buttonGradientLayer, elevationObj] : elevationObj}>
                        <LinearGradient
                            colors={['rgba(255,255,255, 1)', 'rgba(212, 212, 212, 1)']}
                            start={{ x: 0.0, y: 0.0 }}
                            end={{ x: 1.0, y: 0.0 }}
                            locations={[0.0, 1.0]}
                            style={[buttonThemeStyle, gradientStyle]}
                            {...gradientProps}
                        >
                            {!!leftComponent && leftComponent()}
                            {center}
                            {!!rightComponent && rightComponent()}
                        </LinearGradient>
                    </Surface>
                </ButtonComponent>
            )
        }

        return (
            <ButtonComponent ref={forwardedRef} {...rest}
                style={buttonThemeStyle}
                rippleColor={'white'}
            >
                <Surface themeable={false} rowStart>
                    {!!leftComponent && leftComponent()}
                    {center}
                    {!!rightComponent && rightComponent()}
                </Surface>
            </ButtonComponent>
        )
    }
}

Button.propTypes = {
    t: PropTypes.string,
    textTransform: PropTypes.func
}