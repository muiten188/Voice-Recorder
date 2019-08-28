import React, { Component } from 'react'
import { View, Modal, ActivityIndicator, Platform } from 'react-native'
import styles from './styles'
import { COLORS } from '~/src/themes/common'

export default class LoadingModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { visible = false } = this.props
        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={visible}
                onRequestClose={() => { }}>
                <View style={styles.modalOverlay}>
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator size={Platform.OS == 'android' ? 60 : 'large'} color={COLORS.CERULEAN} />
                    </View>
                </View>
            </Modal>
        )
    }
}