import React from 'react'
import { Text, Button, Surface } from '~/src/themes/ThemeComponent'
import { COLORS, SIZES } from '~/src/themes/common'

export default class OTPCountdown extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            time: props.time
        }
        this.intervalID = -1
    }

    componentDidMount() {
        this._playCount()
    }

    _playCount = () => {
        this.intervalID = setInterval(() => {
            const { onCountToEnd } = this.props
            if (this.state.time <= 0) {
                this._stopCount()
                onCountToEnd && onCountToEnd()
                return
            }
            this.setState({
                time: this.state.time - 1
            })
        }, 1000)
    }

    _stopCount = () => {
        clearInterval(this.intervalID)
        this.intervalID = -1
    }

    componentWillUnmount() {
        this._stopCount()
    }

    _handlePressResend = () => {
        this.props.onResend && this.props.onResend()
    }

    render() {
        const { textColor, secondColor } = this.props
        if (this.state.time <= 0) {
            return (
                <Surface themeable={false} fullWidth rowSpacebetween style={{ height: SIZES.BUTTON_FIELD }}>
                    <Text white t={'hint_not_receive_otp'}></Text>
                    <Button
                        flat noPadding
                        textStyle={{ color: COLORS.DARK_BLUE }}
                        t={'resend'}
                        onPress={this._handlePressResend}
                    />
                </Surface>
            )
        }
        let textStyle = {}, textCountStyle = {}
        if (textColor) {
            textStyle = { color: textColor }
        }
        if (secondColor) {
            textCountStyle = { color: secondColor }
        }

        return (
            <Surface themeable={false} fullWidth rowCenter style={{ height: SIZES.BUTTON_FIELD }}>
                    <Text white description t='hint_not_receive_otp' style={textStyle} />
                    <Text yellow description style={textCountStyle}> {this.state.time}</Text>
            </Surface>
        )
    }
}