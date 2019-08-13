import React, { PureComponent } from 'react';
import { View, FlatList, SafeAreaView, Modal, TouchableWithoutFeedback } from 'react-native'
import { TouchableRipple, Text, Button, ToggleButton } from 'react-native-paper'
import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import styles from './styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class ToggleMenu extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    _handlePressToggleItem = (item) => {
        const { onPress } = this.props
        onPress && onPress(item)
    }

    _renderToggleItem = (item, index) => {
        const { data, activeMenu } = this.props
        const isActive = typeof (activeMenu) != undefined ? (item.value == activeMenu) : (index == 0)
        const menuNameStyle = isActive ? styles.menuNameActive : styles.menuName
        const iconColor = isActive ? COLORS.WHITE : COLORS.DARK_GRAY
        let toggleItemStyle = isActive ? styles.toggleItemActive : styles.toggleItem
        const radiusStyle = (index == 0) ? styles.leftRadius : ((index == data.length - 1) ? styles.rightRadius : {})
        toggleItemStyle = {
            ...toggleItemStyle,
            ...radiusStyle
        }
        return (
            <TouchableRipple
                key={item.value}
                onPress={() => this._handlePressToggleItem(item)}
                style={radiusStyle}
            >
                <View
                    style={toggleItemStyle}>
                    <Icon name={item.icon} size={24} color={iconColor} />
                    <Text style={menuNameStyle}>{item.name}</Text>
                </View>
            </TouchableRipple>
        )
    }

    render() {
        const { style, data } = this.props

        return (
            <View style={[SURFACE_STYLES.rowCenter, style]}>
                {!!data && data.map(this._renderToggleItem)}
            </View>
        )
    }
}