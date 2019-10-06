import React, { Component } from "react"
import { TouchableOpacity, Image, FlatList } from 'react-native'
import { View, Text, GradientToolbar, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent";
import FastImage from 'react-native-fast-image'
import I18n from '~/src/I18n'
import styles from './styles'
import { connect } from 'react-redux'
import { getListUser } from '~/src/store/actions/user'
import { userListSelector } from '~/src/store/selectors/user'
import { chainParse } from '~/src/utils'
const emptyArray = []

class UserManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false
        }

    }

    _handlePressLeftMenu = () => {
        this.props.navigation.openDrawer()
    }

    _handlePressAddUser = () => {
        this.props.navigation.navigate('UserInfo')
    }

    _load = (page = 1, refreshing = false) => {
        const { getListUser } = this.props
        if (refreshing) {
            this.setState({ refreshing: true })
        } else {
            this.setState({ refreshing: false })
        }
        getListUser(page, (err, data) => {
            console.log('getListUser err', err)
            console.log('getListUser data', data)
            this.setState({ loading: false, refreshing: false })
        })
    }

    _refresh = () => {
        this._load(1, true)
    }

    _loadMore = () => {
        if (this.state.loading || this.state.refreshing) return
        const { userList } = this.props
        console.log('userList loadMore', userList)
        if (userList.next_page > 0) {
            this._load(userList.next_page)
        }
    }

    //     activated: true
    // date_of_birth: 1561983193
    // email: "haivu1@gmail.com"
    // first_name: "Vu"
    // last_name: "Hai"
    // new_password: "123456"
    // password: ""
    // role: 1
    // username: "haivu1"

    componentDidMount() {
        this._load()
    }


    _renderFloatingButton = () => {
        return (
            <TouchableOpacity onPress={this._handlePressAddUser} style={styles.floatingButtonTouchable}>
                <Image
                    source={require('~/src/image/add_new.png')}
                    style={styles.floatingButton}
                />
            </TouchableOpacity>
        )
    }

    _handlePressMore = () => {
        console.log('PressingMore')
    }

    _handlePressUser = (userInfo) => {
        console.log('_handlePressUser', userInfo)
        this.props.navigation.navigate('UserInfo', { userInfo })
    }

    _renderUserItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this._handlePressUser(item)}>
                <View className='row-start'>
                    <FastImage
                        style={styles.avatar}
                        source={require('~/src/image/default_avatar.jpg')}
                    />
                    <View className='row-start flex border-bottom pv16'>
                        <View className='flex'>
                            <Text className='textBlack bold mb8 s14'>{item.first_name} {item.last_name}</Text>
                            <Text className='gray mb8'>{I18n.t('username')}: {item.username}</Text>
                            <Text className='gray mb8'>{I18n.t('mail')}: {item.email}</Text>
                            <Text className={item.activated ? 'green s13' : 'error s13'}>{item.activated ? I18n.t('active') : I18n.t('inactive')}</Text>
                        </View>
                        <TouchableOpacityHitSlop onPress={this._handlePressMore}>
                            <Image source={require('~/src/image/more.png')} style={styles.moreIcon} />
                        </TouchableOpacityHitSlop>

                    </View>
                </View>
            </TouchableOpacity>

        )
    }


    render() {
        const userListData = chainParse(this.props, ['userList', 'data']) || emptyArray
        return (
            <View className="flex white">
                <GradientToolbar
                    leftIcon={require('~/src/image/menu.png')}
                    title={I18n.t('user_manager_title')}
                    onPressLeft={this._handlePressLeftMenu}
                    avatar={require('~/src/image/default_avatar.jpg')}
                />
                <FlatList
                    data={userListData}
                    refreshing={this.state.refreshing}
                    onRefresh={this._refresh}
                    keyExtractor={item => item.id + ''}
                    renderItem={this._renderUserItem}
                    ListFooterComponent={<View className='space150' />}
                    onEndReached={this._loadMore}
                    onEndReachedThreshold={0.2}
                />
                {this._renderFloatingButton()}
            </View>

        );
    }
}

export default connect(state => ({
    userList: userListSelector(state)
}), { getListUser })(UserManager)