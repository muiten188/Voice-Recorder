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
            placeholder, value, onPress, isRequire
        } = this.props
        let textInputContainerStyle = [commonStyle.textInput.textInputContainer, { borderBottomWidth: 1, borderBottomColor: COLORS.TEXT_BLACK, width: '100%' }, style]

        if (hasError) {
            textInputContainerStyle.push({ borderBottomColor: COLORS.ERROR })
        }


        return (
            <Surface themeable={false} columnAlignStart style={[commonStyle.textInput.textInputColumnContainer2, { width: '100%' }, containerStyle]}>
                {!!label && <Text>
                    <Caption style={{ color: COLORS.TEXT_GRAY }}>{label}</Caption>
                    {!!isRequire && <Text style={{ color: 'red' }}>*</Text>}
                </Text>
                }
                <Surface themeable={false} rowStart style={[textInputContainerStyle]}>
                    {!!descriptionIcon ?
                        <View style={{ paddingRight: 5 }}>
                            <Icon name={descriptionIcon} size={24} color={COLORS.TEXT_GRAY} />
                        </View>
                        :
                        descriptionText ?
                            <View style={{ paddingRight: 5 }}>
                                <Text style={{ color: COLORS.TEXT_GRAY }}>{descriptionText}</Text>
                            </View>
                            :
                            <View />
                    }
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
                {!!hasError
                    && <Surface themeable={false} rowSpacebetween fullWidth style={{ marginTop: 3, }}>
                        <Text themeable={false} error>{errorText}</Text>
                        <Icon name='alert' size={12} color={COLORS.ERROR} />
                    </Surface>}
            </Surface>
        )
    }
}