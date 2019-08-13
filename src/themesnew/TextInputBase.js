import React, { PureComponent } from "react";
import { StyleSheet, TextInput } from "react-native";
import { COLORS } from '~/src/themesnew/common'

export default class TextInputBase extends PureComponent {
    constructor(props) {
        super(props)
    }

    focus() {
        this.textInput && this.textInput.focus()
    }

    blur() {
        this.textInput && this.textInput.blur()
    }

    render() {
        const { style, ...passProps } = this.props
        return <TextInput
            {...passProps}
            underlineColorAndroid={'transparent'}
            style={[styles.defaultStyle, style]}
            ref={ref => this.textInput = ref}
        />
    }
}

const styles = StyleSheet.create({
    defaultStyle: {
        // fontFamily: 'SFProText-Regular',
        color: COLORS.TEXT_BLACK,
        fontSize: 14,
        // includeFontPadding: true,
        textAlignVertical: 'center',
        // letterSpacing: -0.2,
    }
})
