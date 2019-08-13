import React, { Component } from 'react'
import { Image, InteractionManager, TouchableOpacity, StatusBar, Platform } from 'react-native'
import I18n from '~/src/I18n'
import { merchantSelector } from '~/src/store/selectors/merchant'
import { connect } from 'react-redux'
import LoadingModal from '~/src/components/LoadingModal'
import { importQRCode, deleteQRCode } from '~/src/store/actions/qrCode'
import QRCodeComponent from 'react-native-qrcode-svg'
import { showToast, chainParse } from '~/src/utils'
import { getListMerchant } from '~/src/store/actions/merchant'
import { PopupConfirm, Toolbar, Text, View, Container, Button } from '~/src/themesnew/ThemeComponent'
import ToastUtils from '~/src/utils/ToastUtils'
import { COLORS } from '~/src/themesnew/common'


class QRCodeConfig extends Component {

    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            money: '',
            loading: false,
            qrError: '',
            showQRCode: false
        }
    }

    _onReadQRCode = (qrCodeData) => {
        console.log('qrCodeData', qrCodeData)
        const { importQRCode, getListMerchant } = this.props
        this.setState({ loading: true })
        importQRCode(qrCodeData, (err, data) => {
            console.log('importQRCode err', err)
            console.log('importQRCode data', data)
            const httpStatus = chainParse(data, ['httpHeaders', 'status'])
            if (data && data.code && data.code == 5002) {
                this.setState({ qrError: I18n.t('invalid_qr_code'), loading: false })
            } else if (data && data.code) {
                this.setState({ qrError: data.msg, loading: false })
            } else if (httpStatus == 200) {
                getListMerchant()
                this.setState({ loading: false, qrError: '' }, () => {
                    ToastUtils.showSuccessToast(I18n.t('update_qrcode_success'))
                })
            }
        })
    }

    _handlePressScan = () => {
        console.log('_handlePressScan')
        this.props.navigation.navigate('QRScanner', {
            callback: this._onReadQRCode
        })
    }

    // _handlePressUpload = () => {
    //     console.log('_handlePressUpload')
    //     ImagePicker.launchImageLibrary({

    //     }, (response) => {
    //         console.log('Response = ', response);

    //         if (response.didCancel) {
    //             console.log('User cancelled image picker');
    //         } else if (response.error) {
    //             console.log('ImagePicker Error: ', response.error);
    //         } else if (response.customButton) {
    //             console.log('User tapped custom button: ', response.customButton);
    //         } else {
    //             console.log('Response image', response.data)
    //             // data:image/jpeg;base64,
    //             const base64Data = `${response.data}`
    //             console.log('Base 64 Data', base64Data)
    //             const jpegData = Buffer.from(base64Data, 'base64');
    //             console.log('jpegData', jpegData)
    //             const rawImageData = jpeg.decode(jpegData);
    //             console.log('rawImageData', rawImageData)
    //             // const clampedArray = new Uint8ClampedArray(rawImageData.data.length);
    //             // console.log('clampedArray befire', clampedArray)
    //             // // manually fill Uint8ClampedArray, cause Uint8ClampedArray.from function is not available in react-native
    //             // for (let i = 0; i < rawImageData.data.length; i++) {
    //             //     clampedArray[i] = rawImageData.data[i];
    //             // }
    //             // console.log('clampedArray', clampedArray)
    //             // const qrCode = jsQR(clampedArray, rawImageData.width, rawImageData.height);
    //             // console.log('qrCode', qrCode)
    //             // if (qrCode) {
    //             //     console.log("Found QR code", qrCode);
    //             // }
    //         }
    //     })
    // }

    _handlePressDelete = () => {
        console.log('_handlePressDelete')
        this.popupConfirmDelete && this.popupConfirmDelete.open()
    }

    _deleteQRCode = () => {
        console.log('_deleteQRCode')
        const { deleteQRCode, getListMerchant } = this.props
        this.setState({ loading: true })
        deleteQRCode((err, data) => {
            console.log('importQRCode err', err)
            console.log('importQRCode data', data)
            this.setState({ loading: false })
            const httpStatus = chainParse(data, ['httpHeaders', 'status'])
            if (httpStatus == 200) {
                getListMerchant()
                ToastUtils.showSuccessToast(I18n.t('delete_qrcode_success'))
            } else {
                ToastUtils.showErrorToast(I18n.t('err_general'))
            }
        })
    }

    componentDidMount = () => {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }
        InteractionManager.runAfterInteractions(() => {
            this.setState({ showQRCode: true })
        })
    }

    render() {
        const qrCode = this.props && this.props.merchantInfo && this.props.merchantInfo.listMerchantQR && this.props.merchantInfo.listMerchantQR[0]
            && this.props.merchantInfo.listMerchantQR[0].body ? this.props.merchantInfo.listMerchantQR[0].body : ''
        return (
            <Container>
                <Toolbar
                    title={I18n.t('config_vn_qrcode')}
                />
                <LoadingModal visible={this.state.loading} />
                <PopupConfirm
                    animationType="none"
                    content={I18n.t('warn_delete_qrcode')}
                    onPressYes={this._deleteQRCode}
                    onPressNo={() => { }}
                    ref={ref => this.popupConfirmDelete = ref}
                />
                <View className='flex background'>

                    <View className='space18 background' />
                    <View className='white'>
                        <View className='ph24 pt14 pb16'>
                            <Text className='textBlack s12'>{I18n.t('current_qr_code')}</Text>
                        </View>
                        {!!this.state.qrError &&
                            <View className='ph24 pv12'>
                                <Text className='error'>{this.state.qrError}</Text>
                            </View>
                        }
                        {(!qrCode || !this.state.showQRCode) ?
                            <View className='row-center'>
                                <View className='row-center ph24' style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
                                    <Text className='gray bold'>{I18n.t('no_qr')}</Text>
                                </View>
                                <Image source={require('~/src/image/no_qr.png')}
                                    style={{ width: 262, height: 262 }}
                                />
                            </View>
                            :
                            <View className='row-center' style={{ height: 262 }}>
                                <QRCodeComponent
                                    value={qrCode}
                                    size={220}
                                    ecl={'L'}
                                />
                            </View>
                        }
                        {!!qrCode && <View className='row-start' style={{ height: 46, paddingVertical: 10 }}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={this._handlePressDelete}>
                                <View className='row-center flex border-right'>
                                    <Text className='cerulean center'>
                                        {I18n.t('delete_qr_code')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1 }} onPress={this._handlePressScan}>
                                <View className='row-center flex'>
                                    <Text className='cerulean center'>
                                        {I18n.t('update_new')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>}
                    </View>
                    {!qrCode && <View>
                        <View className='space16' />
                        <View className='row-start ph32'>
                            <Button
                                text={I18n.t('scan_qr_code')}
                                onPress={this._handlePressScan}
                                style={{ flex: 1, borderRadius: 6 }}
                            />
                        </View>
                    </View>}


                </View>
            </Container>
        )
    }
}

export default connect(state => ({
    merchantInfo: merchantSelector(state)
}), { importQRCode, getListMerchant, deleteQRCode })(QRCodeConfig)