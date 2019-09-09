import React from "react";
import { Image } from 'react-native'
import Menu, { MenuItem } from 'react-native-material-menu'
import { Text, View, TouchableOpacityHitSlop } from '~/src/themes/ThemeComponent'
import { COLORS } from '~/src/themes/common'
import lodash from 'lodash'

export default class Picker extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    _hideMenu = () => {
        this._menu.hide();
    };

    _showMenu = () => {
        this._menu.show();
    }

    _handlePressMenu = (item) => {
        console.log('_handlePressMenu', item)
        const { value, onChangeValue } = this.props
        this._hideMenu()
        if (item.value != value) {
            onChangeValue && onChangeValue(item.value)
        }

    }

    _renderDropdownItem = (item, index) => {
        return (
            <MenuItem
                onPress={() => this._handlePressMenu(item)}
                key={item.value}
                textStyle={{ color: COLORS.TEXT_BLACK }}
            >{item.label}</MenuItem>
        )

    }

    _getDisplayValue = lodash.memoize((value, options) => {
        if (!value) return ''
        const valueObj = options.find(item => item.value == value)
        if (!valueObj) return ''
        return valueObj.label
    })

    _renderTrigger = () => {
        const { placeholder, value, options } = this.props
        const displayValue = this._getDisplayValue(value, options)
        return (
            <TouchableOpacityHitSlop onPress={this._showMenu}>
                <View className='row-start'>
                    <Text numberOfLines={1}>{displayValue || placeholder}</Text>
                    <View style={{ marginLeft: 10 }}>
                        {/* <Icon name='chevron-down' size={16} color={COLORS.TEXT_BLACK} /> */}
                        <Image source={require('~/src/image/dropdown.png')} style={{ width: 8, height: 4 }} />
                    </View>

                </View>
            </TouchableOpacityHitSlop>

        )

    }

    render() {
        const { options, styles } = this.props
        return (
            <View style={styles}>
                <Menu
                    ref={ref => this._menu = ref}
                    button={this._renderTrigger()}
                >
                    {!!options && options.map(this._renderDropdownItem)}
                </Menu>
            </View>

        )
    }
}
