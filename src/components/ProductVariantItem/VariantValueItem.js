import React, { PureComponent } from 'react'
import { View, ScrollView, Text } from 'react-native'
import commonStyle, { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { TouchableRipple } from 'react-native-paper'
import styles from './styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class VariantValueItem extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    _handlePress = () => {
        const { item, onPress } = this.props
        onPress && onPress(item)
    }

    _handlePressDelete = () => {
        const { item, onDelete } = this.props
        onDelete && onDelete(item)
    }

    render() {
        const { isEditing, item } = this.props
        if (isEditing) {
            return (
                <View style={styles.variantSingleValueItemContainer}>
                    <TouchableRipple onPress={this._handlePressDelete} style={{ position: 'absolute', top: 0, right: 0, backgroundColor: COLORS.WHITE, zIndex: 100 }}>
                        <Icon name={'close-circle-outline'} size={18} color={COLORS.RIPPLE} />
                    </TouchableRipple>
                    <TouchableRipple style={styles.variantValueItem} rippleColor={COLORS.RIPPLE} onPress={this._handlePress}>
                        <Text>{item.value}</Text>
                    </TouchableRipple>
                </View>

            )
        } else {
            const isChoosed = !!item.choosed
            const borderColor = isChoosed ? COLORS.BLUE : COLORS.RIPPLE
            const color = isChoosed ? COLORS.BLUE : 'rgba(0, 0, 0, 0.85)'
            return (
                <View style={styles.variantSingleValueItemContainer}>
                    <TouchableRipple style={[styles.variantValueItem, { borderColor }]} rippleColor={COLORS.RIPPLE} onPress={this._handlePress}>
                        <Text style={{ color }}>{item.value}</Text>
                    </TouchableRipple>
                </View>
            )
        }
    }
}