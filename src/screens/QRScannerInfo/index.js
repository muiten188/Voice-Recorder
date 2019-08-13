import React, { Component } from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { Button } from 'react-native-paper'
import I18n from '~/src/I18n'
import { SURFACE_STYLES } from '~/src/themes/common'
import { TextInput2 as TextInput } from '~/src/themes/ThemeComponent'
import { formatPhoneNumber, formatMoney, revertFormatMoney, } from '~/src/utils'
import { merchantSelector } from '~/src/store/selectors/merchant'
import { createQR } from '~/src/store/actions/order'
import { connect } from 'react-redux'
import LoadingModal from '~/src/components/LoadingModal'
import styles from './styles'


class QRScannerInfo extends Component {

    static navigationOptions = {
        headerTitle: I18n.t('pay'),
    }

    constructor(props) {
        super(props)
        this.state = {
            money: '',
            loading: false
        }
    }

    _handleChargeMoney = () => {
        console.log('Charge Money')
        this.setState({ loading: true })
        const bankUserInfo = this.props.navigation.getParam('bankUserInfo')
        setTimeout(() => {
            this.setState({ loading: false }, () => {
                this.props.navigation.navigate('QRScannerPaySuccess', {
                    info: {
                        ...bankUserInfo,
                        money: revertFormatMoney(this.state.money)
                    }
                })
            })
        }, 300)
    }

    render() {
        const bankUserInfo = this.props.navigation.getParam('bankUserInfo')
        console.log('Bank User Info', bankUserInfo)
        return (
            <SafeAreaView style={[SURFACE_STYLES.flex, SURFACE_STYLES.columnStart]}>
                <LoadingModal visible={this.state.loading} />
                <View style={[{ paddingVertical: 10 }, SURFACE_STYLES.containerHorizontalSpace]}>
                    <View style={[styles.item, SURFACE_STYLES.rowSpacebetween]}>
                        <Text style={styles.textLabel}>{I18n.t('full_name')}</Text>
                        <Text style={styles.textValue}>{bankUserInfo.name}</Text>
                    </View>
                    <View style={[styles.item, SURFACE_STYLES.rowSpacebetween]}>
                        <Text style={styles.textLabel}>{I18n.t('phone_number')}</Text>
                        <Text style={styles.textValue}>{formatPhoneNumber(bankUserInfo.phone)}</Text>
                    </View>
                    <View style={[styles.item, SURFACE_STYLES.rowSpacebetween]}>
                        <Text style={styles.textLabel}>{I18n.t('bank_account_number')}</Text>
                        <Text style={styles.textValue}>{bankUserInfo.accountNumber}</Text>
                    </View>
                    <View style={SURFACE_STYLES.space16} />
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
                    <Button mode="contained" onPress={this._handleChargeMoney}
                        disabled={!revertFormatMoney(this.state.money)}
                    >
                        {I18n.t('pay')}
                    </Button>
                </View>
            </SafeAreaView>
        );
    }
}

export default connect(state => ({
    merchantInfo: merchantSelector(state)
}), { createQR })(QRScannerInfo)