import React, { Component } from 'react'
import { View, Share, SafeAreaView } from 'react-native'
import { Button } from 'react-native-paper'
import QRCodeComponent from 'react-native-qrcode-svg'
import I18n from '~/src/I18n'
import { SURFACE_STYLES } from '~/src/themes/common'
import { TextInput2 as TextInput, RadioGroup } from '~/src/themes/ThemeComponent'
import { formatMoney, revertFormatMoney } from '~/src/utils'
import { merchantSelector } from '~/src/store/selectors/merchant'
import { createQR } from '~/src/store/actions/order'
import { connect } from 'react-redux'
import LoadingModal from '~/src/components/LoadingModal'


export default class QRViewer extends Component {

    static navigationOptions = {
        headerTitle: I18n.t('qr_code'),
    }

    constructor(props) {
        super(props)
    }

    _handleShareQRCode = () => {
        const qrCode = this.props.navigation.getParam('qrCode')
        Share.share({
            message: qrCode,
            title: 'QR Code'
        })
    }


    render() {
        // const orderCode = this.props.navigation.getParam('orderCode')
        const qrCode = this.props.navigation.getParam('qrCode')
        console.log('QR Code', qrCode)
        return (
            <SafeAreaView style={[SURFACE_STYLES.flex, SURFACE_STYLES.columnCenter]}>
                <QRCodeComponent
                    value={qrCode}
                    size={200}
                    ecl={'L'}
                />
                <View style={SURFACE_STYLES.space40} />
                <Button icon='share' mode="contained" onPress={this._handleShareQRCode}>
                    {I18n.t('share_qr_code')}
                </Button>

            </SafeAreaView>
        );
    }
}