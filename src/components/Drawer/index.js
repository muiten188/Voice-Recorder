import React, { Component } from 'react'
import { COLORS } from '~/src/themes/common'
import { View, Text, SmallButton } from '~/src/themes/ThemeComponent'
import { Image, TouchableOpacity } from 'react-native'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import I18n from '~/src/I18n'

const DRAWER_MENUS = [
    {
        key: 'Home',
        label: 'Home',
        icon: 'home-outline'
    },
    {
        key: 'Documents',
        label: 'Documents',
        icon: 'file-document-outline'
    },
    {
        key: 'UserManager',
        label: 'User Manager',
        icon: 'account-outline'
    },
    {
        key: 'Settings',
        label: 'Settings',
        icon: 'settings-outline'
    },
]

export default class Drawer extends Component {
    componentDidMount() {
        console.log('Drawer didmount')
    }

    _handlePressItem = (item) => {
        console.log('Pressing Item', item)
        console.log('Props', this.props)
        this.props.navigation.navigate(item.key)
    }

    _renderDrawerItem = (item, index) => {
        return (
            <TouchableOpacity onPress={() => this._handlePressItem(item)}>
                <View className='row-start ph16 pv16'>
                    <View style={{ marginRight: 20 }}>
                        <Icon name={item.icon} size={22} color={COLORS.DARK_GRAY} />
                    </View>
                    <Text className='textBlack bold'>{item.label}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _handlePressLogout = () => {

    }

    render() {
        return (
            <View>
                <View className='row-start ph16 border-bottom background' style={{ paddingTop: 22, paddingBottom: 14 }}>
                    <Image source={{ uri: 'https://dsdigitaladvertisingdda.com/wp-content/uploads/2017/07/client.png' }}
                        style={{ width: 42, height: 42, marginRight: 10, borderRadius: 21, borderWidth: 2, borderColor: COLORS.WHITE }}
                    />
                    <View>
                        <Text className='textBlack s16 bold mb10'>Hải Vũ</Text>
                        <Text className='gray'>vu.longhai93@gmail.com</Text>
                    </View>
                </View>
                <View>
                    {DRAWER_MENUS.map(this._renderDrawerItem)}
                    <View className='ph16 pv16 row-start'>
                        <SmallButton
                            red
                            text={I18n.t('logout')}
                            onPress={this._handlePressLogout}
                        />
                    </View>

                </View>
            </View>
        )
    }

}