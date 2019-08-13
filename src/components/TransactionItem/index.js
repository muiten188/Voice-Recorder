import React, { Component } from 'react';
import { View } from 'react-native'
import { TouchableRipple, Text } from 'react-native-paper'
import { SURFACE_STYLES, TEXT_STYLES, COLORS } from '~/src/themes/common'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { formatMoney } from '~/src/utils'
import I18n from '~/src/I18n'
import moment from 'moment'
import { ORDER_STATUS } from '~/src/constants'


export default class TransactionItem extends Component {
    constructor(props) {
        super(props)
    }

    _hanlePress = (item) => {
        const { id, orderCode, time, type, money, displayInfo, onPress } = this.props
        onPress && onPress(id)
    }

    _getItemName = (type) => {
        switch (type) {
            case 'bank':
                return 'bank-transfer-in'
            case 'muffin':
                return 'muffin'
            case 'music':
                return 'music-circle'
            case 'food':
                return 'food-variant'
            case 'drink':
                return 'food-fork-drink'
        }
    }

    render() {
        const { orderCode, time, type, money, displayInfo, status, tableDisplay } = this.props
        const iconName = this._getItemName(type)
        const extraStyle = (status == ORDER_STATUS.PAY_SUCCESS) ? { borderLeftWidth: 4, borderLeftColor: COLORS.BLUE } : {}
        return (
            <TouchableRipple
                onPress={() => this._hanlePress()}
                rippleColor={COLORS.RIPPLE}
            >
                <View style={[SURFACE_STYLES.rowStart, { padding: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0, 0, 0, 0.1)' }, extraStyle]}>
                    <Icon name={iconName} size={35} color={COLORS.BLUE} />
                    <View style={[SURFACE_STYLES.columnAlignStart, { paddingLeft: 5, flex: 1 }]}>
                        <View style={[SURFACE_STYLES.rowSpacebetween, { width: '100%' }]}>
                            <Text style={[TEXT_STYLES.body16, { color: 'rgba(0,0,0,0.9)' }]} >{I18n.t('transaction_code')}</Text>
                            <Text style={[TEXT_STYLES.body16, { color: 'rgba(0,0,0,0.9)' }]} >{orderCode}</Text>
                        </View>

                        <View style={[SURFACE_STYLES.rowSpacebetween, { width: '100%' }]}>
                            <Text style={[TEXT_STYLES.description, { color: 'rgba(0,0,0,0.9)' }]}>{I18n.t('money_amount')}</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.BLUE }}>{formatMoney(money)} {I18n.t('d')}</Text>
                        </View>

                        {!!displayInfo && <Text style={[TEXT_STYLES.description, { color: 'rgba(0,0,0,0.5)' }]}>{displayInfo}</Text>}
                        {!!tableDisplay && <View style={[SURFACE_STYLES.rowSpacebetween, { width: '100%' }]}>
                            <Text style={[TEXT_STYLES.description, { color: 'rgba(0,0,0,0.9)' }]}>{I18n.t('table')}</Text>
                            <Text style={[TEXT_STYLES.description, { color: 'rgba(0,0,0,0.9)' }]}>{tableDisplay}</Text>
                        </View>}

                        <View style={[SURFACE_STYLES.rowSpacebetween, { width: '100%' }]}>
                            <Text style={[TEXT_STYLES.description, { color: 'rgba(0,0,0,0.5)' }]}>{I18n.t('transaction_time')}</Text>
                            <Text style={[TEXT_STYLES.description, { color: 'rgba(0,0,0,0.5)' }]}>{moment(time * 1000).format(I18n.t('full_date_time_format'))}</Text>
                        </View>
                    </View>
                </View>
            </TouchableRipple>
        )
    }
}