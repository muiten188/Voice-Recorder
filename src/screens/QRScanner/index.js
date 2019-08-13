import React, { Component } from 'react'
import { SafeAreaView, View, InteractionManager, Alert, Text } from 'react-native'
import { RNCamera } from 'react-native-camera'
import I18n from '~/src/I18n'
import { DEVICE_WIDTH, DEVICE_HEIGHT } from '~/src/themes/common'
import Svg, { Polyline } from 'react-native-svg'
import styles from './styles'

export default class QRScanner extends Component {

    static navigationOptions = {
        headerTitle: I18n.t('scan_qr'),
    }

    constructor(props) {
        super(props)
        this.state = {
            showCameraView: false,
            shouldDetect: true
        }
        this.didFocusListener = props.navigation.addListener(
            'didFocus',
            this.componentDidFocus,
        )
        this.lock = false
    }


    componentDidFocus = () => {
        if (!this.state.shouldDetect) {
            this.setState({ shouldDetect: true })
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
                this.setState({ showCameraView: true })
            }, 200)
        })
    }

    componentWillUnmount() {
        this.didFocusListener.remove()
    }


    _onRead = (qrData) => {
        if (this.lock) return
        this.setState({ shouldDetect: false })
        this.lock = true
        const callback = this.props.navigation.getParam('callback')
        this.props.navigation.goBack()
        callback && callback(qrData.data)
    }

    _goBack = () => {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <SafeAreaView style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}>
                {!!this.state.showCameraView && <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={{
                        width: DEVICE_WIDTH,
                        height: DEVICE_HEIGHT
                    }}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    onBarCodeRead={this.state.shouldDetect ? this._onRead : null}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    captureAudio={false}
                />}

                <View style={[styles.overlay, styles.topOverlay, this.state.permissionDenyBack ? styles.frameOverlayViewBlack : styles.frameOverlayView]}>

                </View>

                <View style={[styles.overlay, styles.topOverlay]}>
                    <Svg
                        style={[styles.overlay, styles.topOverlay]}
                    >
                        <Polyline
                            x={styles.holdView.left}
                            y={styles.holdView.top}
                            points="0,35, 0,0, 35,0"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                        />

                        <Polyline
                            x={styles.holdView.right}
                            y={styles.holdView.top}
                            points="0,35, 0,0, -35,0"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                        />

                        <Polyline
                            x={styles.holdView.left}
                            y={styles.holdView.bottom}
                            points="0,-35, 0,0, 35,0"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                        />

                        <Polyline
                            x={styles.holdView.right}
                            y={styles.holdView.bottom}
                            points="0,-35, 0,0, -35,0"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                        />


                    </Svg>

                    <Text style={styles.hintText}>{I18n.t('qr_scanning_hint')}</Text>
                </View>
            </SafeAreaView>
        );
    }
}
