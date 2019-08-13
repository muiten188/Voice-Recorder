import React, { Component } from 'react';
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import * as Animatable from 'react-native-animatable'
import { TouchableWithoutFeedback, View, Text, Modal } from 'react-native'
import { showToast, hideToast } from '~/src/store/actions/toast'
import { connect } from 'react-redux'
import { chainParse } from '~/src/utils'

class Toast extends Component {
    constructor(props) {
        super(props)
    }

    _handlePressToast = () => {

    }

    show = () => {

    }

    close = () => {
        const { hideToast } = this.props
        hideToast()
    }

    render() {
        const { visible, text, } = this.props
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={visible}
                onRequestClose={this.close}>
                <TouchableWithoutFeedback onPress={this.close}>
                    <View style={[SURFACE_STYLES.flex, SURFACE_STYLES.columnCenter]}>
                        <View
                            style={{
                                padding: 15,
                                borderRadius: 20,
                                margin: 20,
                                backgroundColor: COLORS.BLUE,
                                ...SURFACE_STYLES.rowCenter
                            }}
                        >
                            <Text style={{ color: COLORS.WHITE, textAlign: 'center' }}>{text}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </Modal>
        )
    }
}

export default connect(state => ({
    visible: !!chainParse(state, ['info', 'toastVisible']),
    text: chainParse(state, ['info', 'toastText'])
}), { showToast, hideToast })(Toast)