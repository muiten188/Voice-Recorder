import React, { Component } from 'react'
import { View } from 'react-native'

export default class ThemeView extends Component {
    render() {
        const { forwardedRef, children, style, theme, themeable=true, text, icon, ...rest } = this.props
        return (
            <View ref={forwardedRef} {...rest}
            >
                {children}
            </View>
        )
    }
}