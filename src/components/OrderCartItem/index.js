import React, { Component } from 'react';
import { View } from 'react-native'
import { TouchableRipple, Text } from 'react-native-paper'
import { SURFACE_STYLES, TEXT_STYLES, COLORS } from '~/src/themes/common'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { formatMoney, getWidth } from '~/src/utils'
import I18n from '~/src/I18n'
import NumberStepper from '~/src/components/NumberStepper'
import Image from 'react-native-fast-image'
const IMAGE_WIDTH = getWidth(80)
import styles from './styles'


export default class OrderCartItem extends Component {
    constructor(props) {
        super(props)
    }

    _hanlePress = () => {
        console.log('Pressing Item')
        const { onPress } = this.props
        onPress && onPress()
    }

    _handleChangeNumber = (number) => {
        const { id, productId, onChangeNumber } = this.props
        console.log('Change Number', this.props)
        onChangeNumber && onChangeNumber(id, productId, number)
    }

    _hanlePressDelete = () => {
        const { id, onDelete, number, productId } = this.props
        onDelete && onDelete(id, productId, number)
    }

    render() {
        const { productName, price, promotionPrice, description, number = 1, productAvatar = 'https://vanteacafe.com/img/placeholders/xcomfort_food_placeholder.png,qv=1.pagespeed.ic.mWp7cl8OIL.webp' } = this.props
        const currentPrice = promotionPrice ? Math.max(((+price) - (+promotionPrice)), 0) : price
        return (
            <TouchableRipple
                onPress={this._hanlePress}
                rippleColor={COLORS.RIPPLE}
            >
                <View style={[SURFACE_STYLES.rowAlignStart, SURFACE_STYLES.borderBottom, { paddingVertical: 10 }]}>
                    <Image
                        source={{ uri: productAvatar || '' }}
                        style={{
                            width: IMAGE_WIDTH,
                            height: IMAGE_WIDTH
                        }}
                    />
                    <View style={{ paddingHorizontal: 10, flex: 1 }}>
                        <Text style={[TEXT_STYLES.body1]}>{productName}</Text>
                        <Text style={[TEXT_STYLES.description, { color: COLORS.BLUE }]}>{formatMoney(currentPrice)} {I18n.t('d')}</Text>
                        {!!promotionPrice && <Text style={[TEXT_STYLES.description, { color: COLORS.GRAY, fontStyle: 'italic', textDecorationLine: 'line-through' }]}>{formatMoney(price)} {I18n.t('d')}</Text>}
                    </View>
                    <View style={SURFACE_STYLES.columnAlignEnd}>
                        <View style={{ marginBottom: 5 }}>
                            <Icon name='delete-circle' size={25} color={'rgba(255, 0, 0, 0.5)'}
                                onPress={this._hanlePressDelete}
                            />
                        </View>

                        <NumberStepper
                            onChange={this._handleChangeNumber}
                            value={number}
                        />
                    </View>
                </View>
            </TouchableRipple>
        )
    }
}