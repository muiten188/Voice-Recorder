import React, { PureComponent } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import Surface from '~/src/themes/Surface'
import Text from '~/src/themes/Text'
// import Icon from '~/src/themes/Icon'
import commonStyle, { SURFACE_STYLES } from '~/src/themes/common'
import I18n from '~/src/I18n'
import { COLORS } from '~/src/themes/common'
import { Caption } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// 
export default class ThemeTextInput extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            focus: false
        }
    }
    _handlePressIconRight = () => {
        this.props.onPressIconRight && this.props.onPressIconRight()
    }

    _handleFocus = () => {
        const { onFocus } = this.props
        this.setState({
            focus: true
        })
        onFocus && onFocus()
    }

    _handleBlur = () => {
        const { onBlur } = this.props
        this.setState({
            focus: false
        })
        onBlur && onBlur()
    }

    render() {
        const { descriptionIcon, descriptionText, iconRight, showIconRight = true, rightText,
            hasError, errorText, iconStyle, containerStyle, textInputStyle, style, label,
            activeColor = COLORS.BLUE, inactiveColor = 'rgba(0, 0, 0, 0.54)',
            placeholderT, placeholder, isRequire, ...rest } = this.props
        const color = this.state.focus ? activeColor : inactiveColor
        let textInputContainerStyle = [commonStyle.textInput.textInputContainer, style]

        // if (hasError) {
        //     textInputContainerStyle.push({ borderBottomColor: COLORS.ERROR })
        // }

        // const rightPart = !!showIconRight ?
        //     (
        //         !!iconRight ? <TouchableOpacity onPress={this._handlePressIconRight}>
        //             <View style={commonStyle.textInput.iconRightContainer}>
        //                 <Icon name={iconRight} size={20} color={color} />
        //             </View>
        //         </TouchableOpacity>
        //             :
        //             <Text style={{ color }}>{rightText}</Text>
        //     )
        //     :
        //     < View />


        return (
            <Surface themeable={false}>
                <Surface themeable={false} rowStart style={[textInputContainerStyle]}>
                    {!!descriptionIcon ?
                        <View style={{ ...SURFACE_STYLES.rowCenter, paddingRight: 5, minWidth: 30 }}>
                            <Icon name={descriptionIcon} size={24} color={color} />
                        </View>
                        :
                        descriptionText ?
                            <View style={{ ...SURFACE_STYLES.rowCenter, paddingRight: 5, minWidth: 30 }}>
                                <Text style={{ color }}>{descriptionText}</Text>
                            </View>
                            :
                            <View />
                    }
                    {!!label && <Text style={{ color: COLORS.TEXT_BLACK }}>{label}
                        {!!isRequire && <Text style={{ color: 'red' }}>*</Text>}
                    </Text>}
                    <TextInput
                        {...rest}
                        onFocus={this._handleFocus}
                        onBlur={this._handleBlur}
                        placeholder={placeholderT ? I18n.t(placeholderT) : (placeholder || '')}
                        style={[commonStyle.textInput.input, { flex: 1, height: '100%', textAlign: 'right' }, textInputStyle]}
                    />
                    {/* {rightPart} */}
                </Surface>
                {!!hasError
                    && <Surface themeable={false} rowSpacebetween fullWidth style={{ marginTop: 3, }}>
                        <Text themeable={false} error>{errorText}</Text>
                        <Icon name='alert' size={12} color={COLORS.ERROR} />
                    </Surface>}
            </Surface>
        )
    }
}