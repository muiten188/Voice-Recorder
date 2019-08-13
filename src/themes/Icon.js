import React, { Component } from 'react'
import Icon from '~/src/components/FontIcon'
import light from './light'

export default class ThemeIcon extends Component {

    render() {
        const { forwardedRef, name, theme, themeable = true, ...rest } = this.props
        return (
            <Icon name={name} {...rest} />
        )
    }
}