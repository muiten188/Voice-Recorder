import React, { Component } from 'react';
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import * as Animatable from 'react-native-animatable'
import { TouchableWithoutFeedback, View, Text } from 'react-native'

export default class Toast extends Component {
    constructor(props) {
        super(props)
        this.disablePress = false
    }

    componentDidMount() {
        const { duration = 2000 } = this.props
        setTimeout(() => {
            this.animatedView && this.animatedView.fadeOut().then(endState => {
                this.props.navigation.goBack()
            })
        }, duration)
    }

    _handlePressToast = () => {
        this.disablePress = true
        this.animatedView && this.animatedView.fadeOut().then(endState => {
            this.props.navigation.goBack()
        })
    }

    render() {
        const text = this.props.navigation.getParam('text')
        const duration = this.props.navigation.getParam('duration', 700)
        return (
            <TouchableWithoutFeedback onPress={this._handlePressToast}>
                <View style={[SURFACE_STYLES.flex, SURFACE_STYLES.columnCenter]}>
                    <Animatable.View
                        style={{
                            padding: 15,
                            borderRadius: 20,
                            margin: 20,
                            backgroundColor: COLORS.BLUE,
                            ...SURFACE_STYLES.rowCenter
                        }}
                        animation={'fadeIn'}
                        useNativeDriver={true}
                        duration={duration}
                        ref={ref => this.animatedView = ref}
                    >
                        <Text style={{ color: COLORS.WHITE, textAlign: 'center' }}>{text}</Text>
                    </Animatable.View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}
