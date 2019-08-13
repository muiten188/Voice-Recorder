import React from 'react';
import { View, TextInput, Platform, TouchableWithoutFeedback } from 'react-native';
import { Surface, Icon, Text } from '~/src/themes/ThemeComponent'
import styles from './styles'
import Cursor from '~/src/components/Cursor'
import { CURSOR_TYPE } from "~/src/constants"
import commonStyle from '~/src/themes/common'

export default class CodeStepInput extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            otp: '',
            otpDisplay: '',
            cursorType: props.cursorType || CURSOR_TYPE.VERTICAL
        }
    }

    _onChangeText = (text) => {
        const validText = text.toString().replace(/\D/g, '')
        if (this.props.secure) {
            if (validText.length > this.state.otp.length) {
                let otpDisplay = validText.split('').map((text, index) => {
                    if (index < validText.length - 1) return '*'
                    return text
                }).join('')
                this.setState({ otp: validText, otpDisplay: otpDisplay }, () => {
                    setTimeout(() => {
                        this.setState({ otp: validText, otpDisplay: validText.split('').map(text => '*').join('') })
                    }, 50);
                })
            } else {
                this.setState({ otp: validText, otpDisplay: validText.split('').map(text => '*').join('') })
            }
        } else {
            this.setState({ otp: validText, otpDisplay: validText })
        }
        this.props.onChange && this.props.onChange(validText)
    }

    _handlePressOTP = () => {
        this.fakeInput.blur()
        this.fakeInput.focus()
    }

    render() {
        const { hasError, errorText } = this.props
        let inputArr = []
        for (let i = 0; i < this.props.numberDigit; i++) {
            let otpStyle = (i != this.props.numberDigit - 1) ?
                (this.props.otpItem ? { ...styles.otpItem, ...this.props.otpItem } : styles.otpItem) :
                (this.props.otpItemLast ? { ...styles.otpItemLast, ...this.props.otpItemLast } : styles.otpItemLast)

            if (!!this.props.disable) {
                inputArr.push(
                    <View style={otpStyle} key={i}>
                        <Text style={styles.otpText}>{this.state.otpDisplay.charAt(i)}</Text>
                    </View>
                );
            } else {

                const { otpDisplay } = this.state;
                let displayText;

                if (!!otpDisplay.charAt(i)) {
                    displayText = <Text style={styles.otpText}>{this.state.otpDisplay.charAt(i)}</Text>;
                } else if (i == 0 || !!otpDisplay.charAt(i - 1)) {
                    displayText = this.state.cursorType == CURSOR_TYPE.VERTICAL
                        ? <Cursor type={this.state.cursorType} />
                        : <Cursor type={this.state.cursorType} style={{ marginTop: 20, width: 20 }} />;
                }

                inputArr.push(
                    <TouchableWithoutFeedback key={i} onPress={this._handlePressOTP}>
                        <View style={otpStyle}>
                            {displayText}
                        </View>
                    </TouchableWithoutFeedback>
                );
            }
        }

        return (
            <View>
                <View style={{ ...styles.container, ...this.props.style }}>
                    {!this.props.disable &&
                        <TextInput
                            underlineColorAndroid='transparent'
                            ref={ref => this.fakeInput = ref}
                            autoCorrect={false}
                            autoFocus={this.props.autofocusShow}
                            style={{ position: 'absolute', width: 0, height: 0 }}
                            keyboardType='numeric'
                            value={this.state.otp}
                            onChangeText={(text) => this._onChangeText(text)}
                            maxLength={this.props.numberDigit}
                        />}
                    {inputArr}
                </View>
                {!!hasError && <Surface themeable={false} rowSpacebetween fullWidth style={{ marginTop: 5 }}>
                    <Text themeable={false} error>{errorText}</Text>
                    <Icon name='GB_alert' style={commonStyle.textInput.iconError} />
                </Surface>}
            </View>
        )
    }
}
