import React, { PureComponent } from 'react'
import { Modal, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import Image from 'react-native-fast-image'
import { DEVICE_HEIGHT, COLORS } from '~/src/themesnew/common'
import View from './View'
import Text from './Text'
import * as Animatable from 'react-native-animatable'

export default class RoundBottomSheet extends PureComponent {

    constructor(props) {
        super(props)
    }

    _closeModal = () => {
        this.animatedView && this.animatedView.slideOutDown(500)
            .then(() => {
                const { onClose } = this.props
                onClose && onClose()
            })

    }

    render() {
        const { visible, children, title } = this.props

        return (
            <Modal
                animationType={'none'}
                visible={visible}
                transparent={true}
                onRequestClose={this._closeModal}
            >
                <TouchableWithoutFeedback onPress={this._closeModal}>
                    <View style={styles.backdrop}>
                        <Animatable.View
                            style={styles.popupOuter}
                            useNativeDriver={true}
                            easing={'ease-in-out'}
                            duration={500}
                            animation={'slideInUp'}
                            ref={ref => this.animatedView = ref}
                        >
                            <View style={styles.popupContent}>
                                <View className='row-center'>
                                    <View style={styles.popupHeaderIcon} />
                                </View>
                                <View style={styles.popupTitleContainer}>
                                    <Text style={styles.popupTitle}>{title}</Text>
                                    <TouchableOpacity onPress={this._closeModal}>
                                        <Image source={require('~/src/image/chevron_down_light.png')}
                                            style={styles.iconDown}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {children}
                            </View>
                        </Animatable.View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: COLORS.BACKDROP
    },
    popupHeaderIcon: {
        width: 70,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.BORDER_COLOR,
        marginTop: 8
    },
    popupContent: {
        backgroundColor: COLORS.WHITE,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        height: DEVICE_HEIGHT - 139,
        flex: 1,
    },
    popupOuter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupTitleContainer: {
        paddingTop: 22,
        paddingBottom: 14,
        flexDirection: 'row',
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER_COLOR2
    },
    popupTitle: {
        lineHeight: 20,
        flex: 1
    },
    iconDown: {
        width: 24,
        height: 24
    }
})