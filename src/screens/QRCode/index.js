import React, { Component } from 'react'
import { View, Share, SafeAreaView } from 'react-native'
import { Button } from 'react-native-paper'
import I18n from '~/src/I18n'
import { SURFACE_STYLES } from '~/src/themes/common'
import { TextInput2 as TextInput } from '~/src/themes/ThemeComponent'
import { chainParse, formatMoney, revertFormatMoney, toNormalCharacter, getQRCode } from '~/src/utils'
import { merchantSelector } from '~/src/store/selectors/merchant'
import { createQR } from '~/src/store/actions/order'
import { connect } from 'react-redux'
import LoadingModal from '~/src/components/LoadingModal'
import { PAY_GUID } from '~/src/constants'


class QRCode extends Component {

    static navigationOptions = {
        headerTitle: I18n.t('qr_code'),
    }

    constructor(props) {
        super(props)
        this.state = {
            money: '',
            loading: false
        }
    }

    _handleShareQRCode = () => {
        Share.share({
            message: 'QR Code Content',
            title: 'QR Code'
        })
    }

    _handleCreateQR = () => {
        // Sample
        // const qrCode = getQRCode({
        //     method: '12',
        //     guid: 'A000000775',
        //     merchantId: '112343845',
        //     merchantCategoryCode: '4722',
        //     transactionAmount: '10000',
        //     merchantName: 'NguyetTran Shop',
        //     merchantCity: 'DONGTHAP',
        //     postalCode: '005411',
        //     billNumber: 'A12345',
        //     storeLabel: 'Nguyet Tran Shop CS1',
        //     terminalLabel: '0001'
        // })
        // const qrCode = getQRCode({
        //     method: '11',
        //     guid: '908405',
        //     merchantId: '112343845',
        //     merchantCategoryCode: '4722',
        //     // transactionAmount: '10000',
        //     merchantName: 'NguyetTran Shop',
        //     merchantCity: 'DONGTHAP',
        //     postalCode: '005411',
        //     // billNumber: 'A12345',
        //     storeLabel: 'Nguyet Tran Shop CS1',
        //     terminalLabel: '0001'
        // })
        // console.log('QR Code', qrCode)

        const { createQR, merchantInfo } = this.props
        console.log('merchantInfo', merchantInfo)
        this.setState({ loading: true })
        const merchantId = chainParse(merchantInfo, ['merchant', 'id'])
        const formalShortName = toNormalCharacter(chainParse(merchantInfo, ['merchant', 'shortName'])).toUpperCase()
        const money = revertFormatMoney(this.state.money)
        const taxCode = chainParse(merchantInfo, ['merchant', 'taxCode']) || merchantId
        createQR(money, merchantId, (err, data) => {
            console.log('Create QR err', err)
            console.log('Create QR data', data)
            if (data && data.updated) {
                this.setState({ loading: false })
                const orderCode = chainParse(data, ['updated', 'orderCode'])
                const qrCode = getQRCode({
                    guid: PAY_GUID,
                    'method': '12',
                    merchantId: taxCode,
                    merchantCategoryCode: '4111',
                    transactionAmount: '' + money,
                    merchantName: formalShortName,
                    merchantCity: 'HANOI',
                    billNumber: orderCode,
                    terminalLabel: merchantId
                })
                this.props.navigation.navigate('QRViewer', {
                    qrCode
                })
            } else {
                this.setState({ loading: false })
            }

        })
    }

    render() {
        return (
            <SafeAreaView style={[SURFACE_STYLES.flex, SURFACE_STYLES.columnStart]}>
                <LoadingModal visible={this.state.loading} />
                <View style={[{ paddingVertical: 10 }, SURFACE_STYLES.containerHorizontalSpace]}>
                    <TextInput
                        label={I18n.t('qr_money_input_hint')}
                        descriptionIcon={'home-currency-usd'}
                        rightText={I18n.t('d')}
                        showIconRight={true}
                        onChangeText={text => this.setState({ money: formatMoney(text) })}
                        value={this.state.money}
                        onPressIconRight={() => this.setState({ money: '' })}
                        keyboardType='number-pad'
                    />
                    <View style={SURFACE_STYLES.space30} />
                    <Button mode="contained" onPress={this._handleCreateQR}
                        disabled={!revertFormatMoney(this.state.money)}
                    >
                        {I18n.t('create_qr')}
                    </Button>
                </View>
            </SafeAreaView>
        );
    }
}

export default connect(state => ({
    merchantInfo: merchantSelector(state)
}), { createQR })(QRCode)