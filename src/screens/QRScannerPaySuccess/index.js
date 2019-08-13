import React, { Component } from 'react'
import { View, Text, SafeAreaView, BackHandler } from 'react-native'
import { Button, Colors } from 'react-native-paper'
import I18n from '~/src/I18n'
import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import { formatPhoneNumber, formatMoney, } from '~/src/utils'
import { merchantSelector } from '~/src/store/selectors/merchant'
import { createQR } from '~/src/store/actions/order'
import { connect } from 'react-redux'
import LoadingModal from '~/src/components/LoadingModal'
import styles from './styles'
import { StackActions } from 'react-navigation';
import Linearicon from '~/src/components/Linearicon'




class QRScannerPaySuccess extends Component {

    static navigationOptions = {
        headerTitle: I18n.t('pay'),
    }

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    _handleBack = () => {
        this.props.navigation.dispatch(StackActions.popToTop())
        return true
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBack)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBack)
    }

    _handleGoHome = () => {
        console.log('Charge Money')
        this.props.navigation.dispatch(StackActions.popToTop())
    }

    render() {
        const info = this.props.navigation.getParam('info')
        return (
            <SafeAreaView style={[SURFACE_STYLES.flex, SURFACE_STYLES.columnCenter, SURFACE_STYLES.containerHorizontalSpace]}>
                <View style={styles.infoContainer}>
                    <Linearicon name='checkmark-circle' style={{ fontSize: 72, color: COLORS.BLUE }} />
                    <View style={SURFACE_STYLES.space16} />
                    <Text style={{ fontSize: 16, color: COLORS.TEXT_BLACK, fontWeight: 'bold' }}>{I18n.t('pay_success')}</Text>
                    <View style={SURFACE_STYLES.space28} />
                    <View style={[styles.item, SURFACE_STYLES.rowSpacebetween]}>
                        <Text style={styles.textLabel}>{I18n.t('full_name')}</Text>
                        <Text style={styles.textValue}>{info.name}</Text>
                    </View>
                    <View style={[styles.item, SURFACE_STYLES.rowSpacebetween]}>
                        <Text style={styles.textLabel}>{I18n.t('phone_number')}</Text>
                        <Text style={styles.textValue}>{formatPhoneNumber(info.phone)}</Text>
                    </View>
                    <View style={[styles.item, SURFACE_STYLES.rowSpacebetween]}>
                        <Text style={styles.textLabel}>{I18n.t('bank_account_number')}</Text>
                        <Text style={styles.textValue}>{info.accountNumber}</Text>
                    </View>
                    <View style={[styles.item, SURFACE_STYLES.rowSpacebetween]}>
                        <Text style={styles.textLabel}>{I18n.t('pay_money_amount')}</Text>
                        <Text style={styles.textValue}>{formatMoney(info.money)}</Text>
                    </View>
                </View>
                <Button mode="contained" onPress={this._handleGoHome}
                >
                    {I18n.t('go_home')}
                </Button>
            </SafeAreaView >
        );
    }
}

export default connect(state => ({
    merchantInfo: merchantSelector(state)
}), { createQR })(QRScannerPaySuccess)