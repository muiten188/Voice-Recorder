import React, { Component } from 'react'
import { COLORS } from '~/src/themes/common'
import { View, Text, SmallButton } from '~/src/themes/ThemeComponent'
import { Image, TouchableOpacity, StyleSheet } from 'react-native'
import I18n from '~/src/I18n'
import { logout } from '~/src/store/actions/common'
import { connect } from 'react-redux'
import { userInfoSelector } from '~/src/store/selectors/auth'

const DRAWER_MENUS = [
    {
        key: 'Home',
        label: I18n.t('home_title'),
        icon: require('~/src/image/home.png')
    },
    {
        key: 'UserManager',
        label: I18n.t('user_manager_title'),
        icon: require('~/src/image/usermanager.png')
    },
    {
        key: 'Settings',
        label: I18n.t('setting_title'),
        icon: require('~/src/image/setting.png')
    },
]

class Drawer extends Component {
    componentDidMount() {
        console.log('Drawer didmount')
    }

    _handlePressItem = (item) => {
        console.log('Pressing Item', item)
        console.log('Props', this.props)
        this.props.navigation.closeDrawer()
        this.props.navigation.navigate(item.key)
    }

    _renderDrawerItem = (item, index) => {
        return (
            <TouchableOpacity onPress={() => this._handlePressItem(item)} key={item.key}>
                <View className='row-start ph16 pv16'>
                    <View style={{ marginRight: 20 }}>
                        <Image
                            source={item.icon}
                            style={{ width: 18, height: 18 }} />
                    </View>
                    <Text className='textBlack bold'>{item.label}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _handlePressLogout = () => {
        this.props.navigation.closeDrawer()
        setTimeout(() => {
            this.props.logout()
        }, 100)
    }

    _handlePressAccountInfo = () => {
        this.props.navigation.closeDrawer()
        this.props.navigation.navigate('MyAccount')
    }

    render() {
        const { userInfo } = this.props
        return (
            <View>
                <TouchableOpacity onPress={this._handlePressAccountInfo}>
                    <View className='row-start ph16 border-bottom background' style={styles.infoContainer}>
                        <Image source={require('~/src/image/default_avatar.jpg')}
                            style={styles.avatar}
                        />
                        <View>
                            <Text className='textBlack s15 bold mb4'>{userInfo.first_name} {userInfo.last_name}</Text>
                            <Text className='gray'>{userInfo.email}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View>
                    <View className='space16' />
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

const styles = StyleSheet.create({
    avatar: {
        width: 42,
        height: 42,
        marginRight: 10,
        borderRadius: 21,
        borderWidth: 2,
        borderColor: COLORS.WHITE
    },
    infoContainer: {
        paddingTop: 22,
        paddingBottom: 14
    }
})

export default connect(state => ({
    userInfo: userInfoSelector(state)
}), { logout })(Drawer)