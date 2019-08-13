import React, { Component } from 'react';
import commonStyle, { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { TextInput as TextInputPaper, DefaultTheme } from 'react-native-paper'
import { View } from 'react-native'
import Text from './Text'
import Icon from './Icon'


export default class TextInputEffect extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { style, theme, mode, errorText, hasError, ...props } = this.props
        return (
            <View>
                <TextInputPaper
                    mode={'outlined'}
                    style={{ backgroundColor: 'transparent', placeholderTextColor: COLORS.WHITE }}
                    theme={{
                        ...DefaultTheme,
                        colors: {
                            ...DefaultTheme.colors,
                            primary: COLORS.WHITE,
                            accent: COLORS.WHITE,
                            placeholder: COLORS.WHITE,
                            text: COLORS.WHITE
                        }
                    }}
                    {...props}
                />
                {!!hasError && <View style={[SURFACE_STYLES.rowSpacebetween, SURFACE_STYLES.fullWidth, { marginTop: 5 }]}>
                    <Text themeable={false} error>{errorText}</Text>
                    <Icon name='GB_alert' style={commonStyle.textInput.iconError} />
                </View>}
            </View>
        )
    }
}
