import React, { Component, PureComponent } from 'react'
import { View } from 'react-native'
import { SURFACE_STYLES } from '~/src/themes/common'
import { getElevation } from '~/src/utils'

export default class ThemeView extends PureComponent {
    render() {
        const { forwardedRef, children, style, theme, themeable = true, text, icon, elevation, ...rest } = this.props
        const viewThemeStyle = []
        for (let identifier in rest) {
            if (SURFACE_STYLES[identifier] && rest[identifier]) {
                viewThemeStyle.push(SURFACE_STYLES[identifier])
            }
        }
        if (elevation) {
            viewThemeStyle.push(getElevation(elevation))
        }
        viewThemeStyle.push(style)
        return (
            <View ref={forwardedRef} {...rest}
                style={viewThemeStyle}
            >
                {children}
            </View>
        )
    }
}