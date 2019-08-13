import React from 'react'
import { Modal, View, Platform, TouchableWithoutFeedback,Keyboard } from 'react-native'
import styles from './styles'
import { } from 'react-native';
import { Text, Surface, Button } from '~/src/themes/ThemeComponent'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class PopupSearch extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            visible: !!props.visible ? true : false,
        }
        this.callbacks = {}
    }

    open(callbacks) {
        this.setState({
            visible: true
        })

        this.callbacks = {}

        if (!!callbacks) {
            if (callbacks.button1 && (typeof callbacks.button1 === 'function')) {
                this.callbacks.button1 = callbacks.button1
            }

            if (callbacks.button2 && (typeof callbacks.button2 === 'function')) {
                this.callbacks.button2 = callbacks.button2
            }

            if (callbacks.button3 && (typeof callbacks.button3 === 'function')) {
                this.callbacks.button3 = callbacks.button3
            }
        }
    }

    close() {
        this.setState({
            visible: false
        })
    }

    setVisible(visible) {
        this.setState({
            visible: visible
        })
    }

    _handlePressButton1() {
        if (!this.props.remainPopupWhenPressBtn1) {
            this.close();
        }

        if (this.props.onPressButton1) this.props.onPressButton1();

        if (this.callbacks.button1)
            this.callbacks.button1()
    }

    _handlePressButton2() {
        if (!this.props.remainPopupWhenPressBtn2) {
            this.close();
        }

        if (this.props.onPressButton2) this.props.onPressButton2();

        if (this.callbacks.button2)
            this.callbacks.button2()
    }

    _handlePressButton3() {
        if (!this.props.remainPopupWhenPressBtn3) {
            this.close();
        }
        if (this.props.onPressButton3) this.props.onPressButton3();

        if (this.callbacks.button3)
            this.callbacks.button3()
    }

    _onPressOverlay = () => {
        Keyboard.dismiss()
        const { onPressOverlay } = this.props;
        if (onPressOverlay) onPressOverlay();
    }

    _renderContent = (content, boldPart) => {
        const { autoLink = false } = this.props
        if (boldPart) {
            let splitArr = content.split(boldPart)

            if (splitArr.length == 2) {
                let { contentStyle } = this.props
                if (!contentStyle) contentStyle = {}

                return <Text dialogBody style={[contentStyle]}>{splitArr[0]}
                    <Text dialogBody style={[{ fontWeight: 'bold' }]}>{boldPart}</Text>
                    {splitArr[1]}
                </Text>
            }
        }
        return <Text style={styles.textContent}>{content}</Text>
    }

    _renderContentT = (contentT) => {
        const contentStyle = this.props.contentStyle || {}
        return (
            <Text dialogBody style={[contentStyle]} t={contentT} />
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

    _renderButton = () => {
        const {
            textYesT, textNoT,
            disableButtonYes = false,
        } = this.props;

        const buttonYes = <Button enable={!disableButtonYes} dialog gradientButton={true} t={textYesT} onPress={this._handlePressYes} />
        const buttonNo = <Button flat dialog t={textNoT} onPress={this._handlePressNo} textStyle={styles.negativeButtonText} />
        return (
            <View style={styles.buttonContainer}>
                {buttonNo}
                {buttonYes}
            </View>
        )
    }

    _renderDialogContent = () => {
        const { title, content, banner, boldPart, isSpecial, overlayColor,
            textButton1, textButton2, textButton3,
            textButton1T, textButton2T, textButton3T,
            textButton1Transform = String.prototype.toUpperCase,
            textButton2Transform = String.prototype.toUpperCase,
            textButton3Transform = String.prototype.toUpperCase,
            titleT, contentT,contentView
        } = this.props;

        let specialContent = {}
        let boldText = {}
        if (isSpecial) {
            specialContent = { marginTop: 10, marginBottom: Platform.OS == 'ios' ? 20 : 0 }
        }

        const modalBackgroundStyle = !!overlayColor ? { ...styles.backgroundModal, backgroundColor: overlayColor } : styles.backgroundModal

        const titleElement = ((titleT || title) ?
            <View>
                {titleT ?
                    <Text dialogTitle style={[this.props.titleStyle]} t={titleT}>{title}</Text> :
                    title ? <Text dialogTitle style={[this.props.titleStyle]}>{title}</Text> : <View />}
                <Surface themeable={false} space16 />
            </View>
            :
            <View />
        )

        const contentElement = (
            <View style={{ ...styles.contentContainer, ...specialContent }}>
                {contentT ? this._renderContentT(contentT) :
                    content ? this._renderContent(content, boldPart) : <View />}
                    {contentView ? contentView :<View/>}
                    <View style={{width:100, height:100, }}></View>
            </View>
        )


        return (
            <TouchableWithoutFeedback onPress={this._onPressOverlay}>
                <View style={modalBackgroundStyle}>

                    <View style={styles.popupContainer}>
                        {/* <KeyboardAwareScrollView
                            keyboardDismissMode={'on-drag'}
                            keyboardShouldPersistTaps={'handled'}
                            bounces={false}
                        > */}
                            {titleElement}
                            {banner &&
                                <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 15 }}>
                                    <SvgUri
                                        width="105"
                                        height="105"
                                        svgXmlData={banner}
                                    />
                                </View>
                            }
                            {contentElement}
                            {this.props.children &&
                                <View style={{ ...styles.contentContainer, }}>
                                    {this.props.children}
                                </View>
                            }
                            {this._renderButton()}
                        {/* </KeyboardAwareScrollView> */}
                    </View>

                </View>
            </TouchableWithoutFeedback>
        )
    }

    render() {
        const { useNormalView } = this.props

        if (!!useNormalView) {
            return (
                <View
                    style={styles.fullViewScreen}
                >
                    {this._renderDialogContent()}
                </View>
            )
        } else {
            return (
                <Modal
                
                    animationType={this.props.animationType || 'fade'}
                    visible={this.state.visible}
                    transparent={true}
                    onRequestClose={() => this.close()}
                >
                    {this._renderDialogContent()}
                </Modal>
            )
        }
    }
}