import React, { Component } from 'react'
import View from './View'
import Text from './Text'
import TextInput from './TextInputBase'
import { COLORS } from './common'

export default class SingleRowInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            focus: false
        }
    }

    _handleFocus = () => {
        const { onFocus } = this.props
        this.setState({
            focus: true
        }, () => {
            onFocus && onFocus()
        })

    }

    _handleBlur = () => {
        const { onBlur } = this.props
        this.setState({
            focus: false
        }, () => {
            onBlur && onBlur()
        })
    }

    focus = () => {
        this.textInput && this.textInput.focus()
    }

    blur = () => {
        this.textInput && this.textInput.blur()
    }

    render() {
        const { label, labelStyle, rightLabel, error, onFocus, onBlur, secureTextEntry = false, className, ...passProps } = this.props
        return (
            < View className='row-all-start white' >
                <View className='leftLabel'>
                    <Text className='s12 textBlack' style={labelStyle}>{label}</Text>
                </View>
                <View className='ph16 flex pt8 border-left2' style={{ paddingBottom: !!error ? 0 : 8 }}>
                    <View className='row-start flex'>
                        <TextInput
                            {...passProps}
                            onFocus={this._handleFocus}
                            onBlur={this._handleBlur}
                            secureTextEntry={secureTextEntry}
                            style={{
                                fontSize: className == 's16' ? 16 : 14,
                                flex: 1,
                                height: 32,
                                paddingTop: 0,
                                paddingBottom: 0,
                                color: this.state.focus && !secureTextEntry ? COLORS.CERULEAN : COLORS.TEXT_BLACK
                            }}
                            ref={ref => this.textInput = ref}
                        />
                        {!!rightLabel && <Text className='s12 lightGray' style={{ marginLeft: 24 }}>{rightLabel}</Text>}
                    </View>
                    {!!error && <Text className='error pb8'>{error}</Text>}
                </View>
            </View >
        )
    }

}