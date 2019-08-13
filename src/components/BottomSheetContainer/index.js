import React, { Component } from 'react'
import { View, Modal, Text, TouchableWithoutFeedback, Animated, Easing } from 'react-native'
import styles from './styles'
const DURATION = 300

export default class BottomSheetContainer extends Component {
    constructor(props) {
        super(props)
        this.base_position = 300
        this.state = {
            modalVisible: false,
            translateY: new Animated.Value(this.base_position),
        }
    }
    open = () => {


        this.setState({ modalVisible: true }, () => {
            Animated.timing(this.state.translateY, {
                toValue: 0,
                duration: DURATION,
                easing: Easing.linear,
                useNativeDriver: true, // <-- Add this
            }).start()
        })
    }
    close = () => {
        Animated.timing(this.state.translateY, {
            toValue: this.base_position,
            duration: DURATION,
            easing: Easing.linear,
            useNativeDriver: true, // <-- Add this
        }).start(() => this.setState({ modalVisible: false, translateY: new Animated.Value(this.base_position) }))

    }

    _onPressItem = (item) => {
        if (!item.enable) return;
        this.setState({ modalVisible: false, translateY: new Animated.Value(this.base_position) },
            () => this.props.onPressItem && this.props.onPressItem(item)
        )
    }

    render() {
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}>
                <TouchableWithoutFeedback onPress={() => this.close()}>
                    <View style={styles.modalOverlay}>
                        <Animated.View
                            style={{
                                ...styles.modalContainer,
                                transform: [{
                                    translateY: this.state.translateY.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, 1],
                                    }),
                                }]
                            }}
                        >
                            {!!this.props.children && this.props.children}
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}