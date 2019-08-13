import React, { PureComponent } from 'react'
import { View } from 'react-native'
import Surface from '~/src/themes/Surface'
import Text from '~/src/themes/Text'
import commonStyle, { TEXT_INPUT_STYLES } from '~/src/themes/common'
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { Caption } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableRipple } from 'react-native-paper'
// 
export default class PickerInput extends PureComponent {
    constructor(props) {
        super(props)
    }
    _handlePressIconRight = () => {
        this.props.onPressIconRight && this.props.onPressIconRight()
    }

    render() {
        const { descriptionIcon, descriptionText,
            hasError, errorText, containerStyle, style, label,
            placeholder, value, onPress, isRequire,
        } = this.props
        let textInputContainerStyle = [commonStyle.textInput.textInputContainer, style]


        return (
            <Surface themeable={false} rowStart style={[textInputContainerStyle]}>
                {!!descriptionIcon ?
                    <View style={{ paddingRight: 5 }}>
                        <Icon name={descriptionIcon} size={24} color={'rgba(0,0,0,0.54)'} />
                    </View>
                    :
                    descriptionText ?
                        <View style={{ paddingRight: 5 }}>
                            <Text style={{ color: 'rgba(0,0,0,0.54)' }}>{descriptionText}</Text>
                        </View>
                        :
                        <View />
                }
                {!!label && <Text>
                    <Text style={{ color: COLORS.TEXT_BLACK }}>{label}</Text>
                    {!!isRequire && <Text style={{ color: 'red' }}>*</Text>}
                </Text>}
                <TouchableRipple
                    onPress={onPress}
                    rippleColor={COLORS.RIPPLE}
                    style={[SURFACE_STYLES.flex]}
                >
                    <View style={[SURFACE_STYLES.rowEnd, SURFACE_STYLES.flex]}>
                        <Text style={{ color: value ? COLORS.TEXT_BLACK : COLORS.TEXT_GRAY }}>{value || placeholder}</Text>
                        <Icon name={'chevron-right'} size={24} color={value ? COLORS.TEXT_BLACK : COLORS.TEXT_GRAY} />
                    </View>
                </TouchableRipple>
            </Surface>
        )
    }
}