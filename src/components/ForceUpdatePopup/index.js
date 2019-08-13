import React from 'react'
import { Platform, StyleSheet, Image, Linking } from 'react-native'
import { Text, View, Button } from '~/src/themesnew/ThemeComponent'
import { COLORS } from '~/src/themesnew/common'
import I18n from "~/src/I18n"



export default class ForceUpdatePopup extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    show(url) {
        this.setState({
            visible: true,
            url
        })

    }

    hide() {
        this.setState({
            visible: false
        })
    }

    _handlePressUpdate = () => {
        const defaultUrl = Platform.OS == 'android' ? "market://details?id=com.ati.mshop" : "https://testflight.apple.com/join/Bv9JNj8X"
        const url = this.state.url || defaultUrl
        Linking.openURL(url)
    }

    render() {
        const { title = I18n.t('notification'), content = I18n.t('force_update_content') } = this.props
        if (!this.state.visible) return <View />

        return (
            <View style={styles.modalContainer}>
                {/* <TouchableWithoutFeedback onPress={this._onPressOverlay}> */}
                <View style={styles.backdrop}>
                    <View style={styles.popupOuter}>
                        <View style={styles.popupContainer}>
                            <View style={styles.header}>
                                <Image source={require('~/src/image/warning.png')}
                                    style={styles.warningIcon}
                                />
                                <Text className='title'>{title}</Text>
                            </View>
                            <View style={styles.popupContent}>
                                <View style={styles.popupTextContainer}>
                                    <Text style={styles.popupText}>{content}</Text>
                                </View>

                                <View style={styles.buttonBlock}>
                                    {/* <Button
                                            negative
                                            text={I18n.t('cancel')}
                                            onPress={this._handlePressNo}
                                            style={styles.buttonLeft}
                                        /> */}
                                    <Button
                                        text={I18n.t('update')}
                                        onPress={this._handlePressUpdate}
                                        style={styles.buttonRight}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                {/* </TouchableWithoutFeedback> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000
    },
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
        borderRadius: 6,
        flex: 1,
        marginRight: 8
    },
    buttonRight: {
        borderRadius: 6,
        flex: 1,
    }
})
