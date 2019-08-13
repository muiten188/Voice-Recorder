import React, { Component } from 'react'
import { SafeAreaView, View, InteractionManager, Alert, Text } from 'react-native'
import { RNCamera } from 'react-native-camera'
import I18n from '~/src/I18n'
import { SURFACE_STYLES, DEVICE_WIDTH, DEVICE_HEIGHT } from '~/src/themes/common'
import Svg, { Polyline } from 'react-native-svg'
import styles from './styles'
const ACCEPT_BARCODE_TYPE = [
    RNCamera.Constants.BarCodeType.code128, RNCamera.Constants.BarCodeType.ean13,
    RNCamera.Constants.BarCodeType.ean8, RNCamera.Constants.BarCodeType.upc_a,
    RNCamera.Constants.BarCodeType.upc_e, RNCamera.Constants.BarCodeType.upc_ean
]
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import { totalCartProductNumberSelector } from '~/src/store/selectors/order'
import { getProductByBarcode } from '~/src/store/actions/product'
import { addProductToOrderCart } from '~/src/store/actions/order'
import LoadingModal from '~/src/components/LoadingModal'
import { connect } from 'react-redux'
import PopupConfirm from '~/src/components/PopupConfirm'
import Linearicon from '~/src/components/Linearicon'
import { Button } from 'react-native-paper';

class ProductBarcodeScanner extends Component {

    static navigationOptions = {
        headerTitle: I18n.t('scan_product_barcode'),
    }

    constructor(props) {
        super(props)
        this.state = {
            showCameraView: false,
            loading: false
        }
        this.didFocusListener = props.navigation.addListener(
            'didFocus',
            this.componentDidFocus,
        )
        this.isReading = false
    }


    componentDidFocus = () => {
        this.camera && this.camera.resumePreview()
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
        this.camera && this.camera.pausePreview()
        console.log('On Read', qrData.data)
        const barcode = qrData.data
        if (this.isReading) return
        this.isReading = true
        this.setState({ loading: true })
        const { merchantId, getProductByBarcode } = this.props
        getProductByBarcode(merchantId, barcode, (err, data) => {
            console.log('getProductByBarcode err', err)
            console.log('getProductByBarcode data', data)
            setTimeout(() => {
                this.camera && this.camera.resumePreview()
                this.isReading = false
            }, 500)
            this.setState({ loading: false })
            if (data && data.code == 3003) {
                this.setState({ loading: false }, () => {
                    this.popupProduct && this.popupProduct.open()
                })
            } else if (data && data.id) {
                const { addProductToOrderCart } = this.props
                this.setState({ loading: false })
                addProductToOrderCart({
                    ...data,
                    qty: 1
                })
                this.props.navigation.navigate('Toast', { text: I18n.t('added_to_cart') })
                // 
            } else {
                this.setState({ loading: false })
                // this.props.navigation.navigate('Toast', { text: I18n.t('err_general') })
            }
        })
    }

    _continueScan = () => {
        setTimeout(() => {
            this.camera && this.camera.resumePreview()
        }, 0)
    }

    _goBack = () => {
        this.props.navigation.goBack()
    }

    _handleGoBackToCart = () => {
        this.props.navigation.goBack()
    }

    _renderCartBar = () => {
        const { totalProduct } = this.props
        return (
            <View style={styles.cartBar}>
                <View style={styles.cartIconContainer}>
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{totalProduct}</Text>
                    </View>
                    <Linearicon name='cart' style={{ fontSize: 24, color: 'rgba(0, 0, 0, 0.6)' }} />
                </View>
                <Button mode="contained" onPress={this._handleGoBackToCart}
                >
                    {I18n.t('go_back_to_cart')}
                </Button>
            </View>
        )
    }



    render() {
        return (
            <SafeAreaView style={SURFACE_STYLES.flex}>
                <View style={SURFACE_STYLES.flex}>
                    <LoadingModal visible={this.state.loading} />
                    <PopupConfirm
                        animationType='none'
                        contentT={'product_not_exists'}
                        titleT={'alert'}
                        textYesT={'close'}
                        ref={ref => this.popupProduct = ref}
                        onPressYes={this._continueScan}
                    />
                    {!!this.state.showCameraView && <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={{
                            width: DEVICE_WIDTH,
                            height: DEVICE_HEIGHT - 56
                        }}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.on}
                        permissionDialogTitle={'Permission to use camera'}
                        permissionDialogMessage={'We need your permission to use your camera phone'}
                        onBarCodeRead={this._onRead}
                        barCodeTypes={ACCEPT_BARCODE_TYPE}
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
                        <Text style={styles.hintText}>{I18n.t('barcode_scanning_hint')}</Text>
                    </View>
                    {this._renderCartBar()}
                </View>
            </SafeAreaView>
        )
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
    totalProduct: totalCartProductNumberSelector(state)
}), { getProductByBarcode, addProductToOrderCart })(ProductBarcodeScanner)