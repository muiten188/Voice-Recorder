import React from 'react'
import { Modal, TouchableWithoutFeedback, StyleSheet, Image } from 'react-native'
import Text, { Title, TextBold } from './Text'
import View from './View'
import Button from './Button'
import SmallButton from './SmallButton'
import { COLORS } from '~/src/themes/common'
import I18n from "~/src/I18n"



export default class PopupConfirmDelete extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            visible: !!props.visible ? true : false,
        }
    }

    open() {
        this.setState({
            visible: true
        })

    }

    close() {
        this.setState({
            visible: false
        })
    }

    _onPressOverlay = () => {
        const { onPressOverlay } = this.props;
        this.setState({
            visible: false
        }, () => {
            onPressOverlay && onPressOverlay()
        })
    }

    _getHighlightContent = () => {
        const { content } = this.props
        const splitArr = content.split("\"")
        return (
            <Text className='textBlack s13 center'>
                {splitArr.map((item, index) => index % 2 == 0 ? item : <TextBold style={styles.textHightLight} key={item}>"{item}"</TextBold>)}
            </Text>
        )
    }

    _handlePressYes = () => {
        this.close()
        this.props.onPressYes && this.props.onPressYes()
    }

    _handlePressNo = () => {
        this.close()
        this.props.onPressNo && this.props.onPressNo()
    }

    render() {
        const { title = I18n.t('confirm'), negativeText = I18n.t('cancel'), positiveText = I18n.t('agree') } = this.props
        return (
            <Modal
                animationType={'none'}
                visible={this.state.visible}
                transparent={true}
                onRequestClose={() => this.close()}
            >
                <TouchableWithoutFeedback onPress={this._onPressOverlay}>
                    <View style={styles.backdrop}>
                        <View style={styles.popupOuter}>
                            <View style={styles.popupContainer}>
                                <View className='column-center'>
                                    <Image source={require('~/src/image/delete2.png')}
                                        style={styles.deleteIcon}
                                    />
                                    <View style={styles.popupContent}>
                                        <Text className='s16 lh24 bold textBlack'>{title}</Text>
                                        <View className='space16' />
                                        <Text style={styles.popupText}>{this._getHighlightContent()}</Text>
                                        <View className='space32' />
                                    </View>
                                    <View style={styles.buttonBlock}>
                                        <SmallButton
                                            gray
                                            text={negativeText}
                                            onPress={this._handlePressNo}
                                            style={styles.buttonLeft}
                                        />
                                        <SmallButton
                                            red
                                            text={positiveText}
                                            onPress={this._handlePressYes}
                                            style={styles.buttonRight}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.BACKDROP
    },
    popupOuter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 6,
        marginHorizontal: 24,
        flex: 1
    },
    deleteIcon: {
        width: 46,
        height: 48,
        marginVertical: 20,
    },
    popupContent: {
        paddingHorizontal: 16,
    },
    popupTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textHightLight: {
        color: COLORS.CERULEAN
    },
    buttonBlock: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#e3e3e3'
    },
    buttonLeft: {
        flex: 1,
        marginRight: 8
    },
    buttonRight: {
        flex: 1,
    }
})
