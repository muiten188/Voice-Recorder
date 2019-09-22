import React from 'react'
import { Modal, View, TouchableWithoutFeedback, StyleSheet, Image } from 'react-native'
import Text, { Title, TextBold } from './Text'
import SmallButton from './SmallButton'
import { COLORS } from '~/src/themes/common'
import I18n from "~/src/I18n"



export default class PopupConfirm extends React.PureComponent {

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
            <Text style={styles.popupText}>
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
        const { title = I18n.t('confirm'), negativeText = I18n.t('cancel'), children } = this.props
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
                                <View style={styles.header}>
                                    <Image source={require('~/src/image/warning.png')}
                                        style={styles.warningIcon}
                                    />
                                    <Title>{title}</Title>
                                </View>
                                <View style={styles.popupContent}>
                                    {!!children ?
                                        children
                                        :
                                        <View style={styles.popupTextContainer}>
                                            <Text style={styles.popupText}>{this._getHighlightContent()}</Text>
                                        </View>
                                    }
                                    <View style={styles.buttonBlock}>
                                        <SmallButton
                                            gray
                                            text={negativeText}
                                            onPress={this._handlePressNo}
                                            style={styles.buttonLeft}
                                        />
                                        <SmallButton
                                            text={I18n.t('agree')}
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
    header: {
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER_COLOR
    },
    warningIcon: {
        width: 21,
        height: 18,
        marginRight: 8
    },
    popupContent: {
        paddingHorizontal: 24,
    },
    popupTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    popupText: {
        marginTop: 47,
        marginBottom: 44,
        color: COLORS.TEXT_BACK,
        textAlign: 'center'
    },
    textHightLight: {
        color: COLORS.CERULEAN
    },
    buttonBlock: {
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonLeft: {
        flex: 1,
        marginRight: 8
    },
    buttonRight: {
        flex: 1,
    }
})
