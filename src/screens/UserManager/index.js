import React, { Component } from "react"
import { TouchableOpacity, Image, FlatList } from 'react-native'
import { View, Text, GradientToolbar, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent";
import FastImage from 'react-native-fast-image'
import I18n from '~/src/I18n'
import styles from './styles'
import users from './data'

export default class UserManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    _handlePressLeftMenu = () => {
        this.props.navigation.openDrawer()
    }

    _handlePressAddUser = () => {

    }

    _renderFloatingButton = () => {
        return (
            <View className='bottom transparent column-center'>
                <TouchableOpacity onPress={this._handlePressAddUser}>
                    <View>
                        <Image
                            source={require('~/src/image/add_new.png')}
                            style={styles.floatingButton}
                        />
                        <View className='space8' />
                        <Text className='green center'>{I18n.t('add_new')}</Text>
                        <View className='space32' />
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    _handlePressMore = () => {
        console.log('PressingMore')
    }

    _renderUserItem = ({ item, index }) => {
        return (
            <View className='row-start'>
                <FastImage
                    style={styles.avatar}
                    source={{ uri: item.avatar }}
                />
                <View className='row-start flex border-bottom pv16'>
                    <View className='flex'>
                        <Text className='textBlack bold mb8 s14'>{item.name}</Text>
                        <Text className='gray mb8'>Username: {item.username}</Text>
                        <Text className={item.status == 0 ? 'error s13' : 'green s13'}>{item.status == 0 ? 'Deactive' : 'Active'}</Text>
                    </View>
                    <TouchableOpacityHitSlop onPress={this._handlePressMore}>
                        <Image source={require('~/src/image/more.png')} style={styles.moreIcon} />
                    </TouchableOpacityHitSlop>

                </View>
            </View>
        )
    }


    render() {
        return (
            <View className="flex white">
                <GradientToolbar
                    leftIcon={require('~/src/image/menu.png')}
                    title={I18n.t('user_manager_title')}
                    onPressLeft={this._handlePressLeftMenu}
                    avatar={require('~/src/image/default_avatar.jpg')}
                />
                <FlatList
                    data={users}
                    keyExtractor={item => item.id + ''}
                    renderItem={this._renderUserItem}
                    ListFooterComponent={<View className='space150' />}
                />
                {this._renderFloatingButton()}
            </View>

        );
    }
}