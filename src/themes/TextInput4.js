import React, { Component, PureComponent } from 'react'
// import { themeSelector, languageSelector } from '~/src/store/selectors/ui'
// import { connect } from 'react-redux'
import { getTheme } from './utils'
import { TextInput, TouchableOpacity, View } from 'react-native'
import Surface from '~/src/themes/Surface'
import Text from '~/src/themes/Text'
import Icon from '~/src/themes/Icon'
import commonStyle, { TEXT_INPUT_STYLES } from '~/src/themes/common'
import I18n from '~/src/I18n'
import { COLORS } from '~/src/themes/common'
import light from './light'
// 
export default class ThemeTextInput extends PureComponent {

    _handlePressIconRight = () => {
        this.props.onPressIconRight && this.props.onPressIconRight()
    }

    render() {
        const { forwardedRef, style, containerStyle, textInputStyle, theme, themeable,
            descriptionIcon, iconRight, rightTextT, placeholderT, placeholder, showIconRight = true,
            hasError, errorText, iconStyle, label, labelT, labelStyle, labelContainerStyle, ...rest } = this.props
        const themeStyle = light
        let textInputThemeStyle = themeable ?
            [{ color: themeStyle.textInputTextColor }, commonStyle.textInput.input, textInputStyle]
            : [commonStyle.textInput.input, textInputStyle]
        let placeholderTextColorTheme = themeable ? themeStyle.textInputPlaceholderColor : 'rgba(0, 0, 0, 0.4)'
        let descriptionIconStyle = themeable ?
            [{ color: themeStyle.textInputTextColor }, commonStyle.textInput.descriptionIcon]
            : [commonStyle.textInput.descriptionIcon]
        let iconRightStyle = themeable ?
            [{ color: themeStyle.textInputTextColor }, commonStyle.textInput.iconRight]
            : [commonStyle.textInput.iconRight]

        let textInputContainerStyle = [commonStyle.textInput.textInputContainer, style]
        for (let identifier in rest) {
            if (TEXT_INPUT_STYLES[identifier] && rest[identifier]) {
                const { container, icon, input, placeholderColor } = TEXT_INPUT_STYLES[identifier]
                if (icon) {
                    descriptionIconStyle.push(icon)
                    iconRightStyle.push(icon)
                }
                container && textInputContainerStyle.push(container)
                placeholderColor && (placeholderTextColorTheme = placeholderColor)
                input && textInputThemeStyle.push(input)
            }
        }

        if (hasError) {
            // textInputThemeStyle.push({ color: COLORS.ERROR })
            textInputContainerStyle.push({ borderBottomColor: COLORS.ERROR })
        }
        descriptionIconStyle.push(iconStyle)
        iconRightStyle.push(iconStyle)

        const rightPart = (!!iconRight && !!showIconRight) ?
            (
                <TouchableOpacity onPress={this._handlePressIconRight}>
                    <View style={commonStyle.textInput.iconRightContainer}>
                        <Icon name={iconRight} style={iconRightStyle} />
                    </View>
                </TouchableOpacity>
            ) :
            (
                rightTextT ? <Text t={rightTextT} /> : <View />
            )

        return (
            <Surface themeable={false} columnStart style={[commonStyle.textInput.textInputColumnContainer, containerStyle]}>
                {!!(label || labelT) &&
                    <Surface rowStart fullWidth style={[labelContainerStyle]}>
                        <Text style={[commonStyle.textInput.textInputLabel, labelStyle]}>{labelT ? I18n.t(labelT) : label}</Text>
                    </Surface>
                }
                <Surface themeable={false} rowStart style={textInputContainerStyle}>
                    {!!descriptionIcon && <Icon name={descriptionIcon} style={descriptionIconStyle} />}
                    <TextInput
                        {...rest}
                        placeholder={placeholderT ? I18n.t(placeholderT) : (placeholder || '')}
                        placeholderTextColor={placeholderTextColorTheme}
                        style={textInputThemeStyle}
                    />
                    {rightPart}
                </Surface>
                {!!hasError
                    && <Surface themeable={false} rowSpacebetween fullWidth style={{ marginTop: 3, }}>
                        <Text themeable={false} error>{errorText}</Text>
                        <Icon name='GB_alert' style={commonStyle.textInput.iconError} />
                    </Surface>}
            </Surface>
        )
    }
}