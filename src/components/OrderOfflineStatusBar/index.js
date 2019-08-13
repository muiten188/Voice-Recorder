import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { SURFACE_STYLES, DEVICE_WIDTH, DEVICE_HEIGHT, COLORS } from '~/src/themes/common'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import I18n from '~/src/I18n'
import { toElevation } from '~/src/utils'
import { ORDER_TAB } from '~/src/constants'


export default class OrderOfflineStatusBar extends Component {
    constructor(props) {
        super(props)
        this.data = [
            {
                id: ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY,
                icon: 'credit-card-plus',
                text: I18n.t('wait_for_pay'),
            },
            {
                id: ORDER_TAB.ORDER_OFFLINE_PAID,
                icon: 'gift',
                text: I18n.t('paid'),
            },
        ]
    }

    _hanlePress = (item) => {
        this.props.onChange && this.props.onChange(item)
    }


    render() {
        const { activeItem } = this.props
        return (
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={[SURFACE_STYLES.rowSpacebetween, { padding: 10 }]}>
                        {this.data.map(item => {
                            const color = item.id == activeItem ? COLORS.BLUE : COLORS.DARK_GRAY
                            const borderColor = item.id == activeItem ? COLORS.BLUE : COLORS.WHITE
                            return (
                                <TouchableRipple
                                    onPress={() => this._hanlePress(item)}
                                    rippleColor={COLORS.RIPPLE}
                                    key={item.id}
                                >
                                    <View style={[
                                        SURFACE_STYLES.columnCenter,
                                        { width: 75, height: 75, borderColor, borderWidth: 2, borderRadius: 10, padding: 5, backgroundColor: COLORS.WHITE, marginHorizontal: 5, marginVertical: 5 },
                                        toElevation(5)
                                    ]} >
                                        <Icon name={item.icon} size={32} color={color} />
                                        <Text style={{ textAlign: 'center', fontSize: 12, color }}>{item.text}</Text>
                                    </View>
                                </TouchableRipple>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        )
    }
}