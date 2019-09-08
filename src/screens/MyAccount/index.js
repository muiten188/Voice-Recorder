import React, { Component } from "react"
import { Image } from 'react-native'
import { View, Text, SmallButton, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent";
import FastImage from 'react-native-fast-image'
import I18n from '~/src/I18n'
import styles from './styles'
import LinearGradient from 'react-native-linear-gradient'

export default class MyAccount extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            isEditing: false
        }
    }

    _handleBack = () => {
        this.props.navigation.goBack()
    }

    _handlePressEdit = () => {
        console.log('Pressing Edit')
    }

    _handlePressLogout = () => {

    }

    _handlePressChangePassword = () => {
        this.props.navigation.navigate('ChangePassword')
    }

    _render = () => {
        if (!this.state.isEditing) {
            return (
                <View style={styles.infoBlock}>
                    <View className='row-start pv16 ph16'>
                        <Image source={require('~/src/image/phone.png')} style={styles.fieldIcon} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('phone')}</Text>
                            <Text className='textBlack s13'>0977865062</Text>
                        </View>
                    </View>
                    <View className='row-start pv16 ph16'>
                        <Image source={require('~/src/image/mail.png')} style={styles.fieldIcon} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('mail')}</Text>
                            <Text className='textBlack s13'>vu.longhai93@gmail.com</Text>
                        </View>
                    </View>
                    <View className='row-start pv16 ph16'>
                        <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('position')}</Text>
                            <Text className='textBlack s13'>0977865062</Text>
                        </View>
                    </View>
                    <View className='row-start pv16 ph16'>
                        <Image source={require('~/src/image/password.png')} style={styles.fieldIcon2} />
                        <View className='flex'>
                            <Text className='bold s14 mb4'>{I18n.t('password')}</Text>
                            <View className='row-start'>
                                <Text className='textBlack flex s13 bold'>••••••</Text>
                                <TouchableOpacityHitSlop onPress={this._handlePressChangePassword}>
                                    <Text className='green s13'>{I18n.t('change_password')} ›</Text>
                                </TouchableOpacityHitSlop>

                            </View>
                            
                        </View>
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <View className="flex white">
                <LinearGradient
                    colors={['#d63e3b', '#209955']}
                    style={[styles.gradientContainer]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View>
                        <View className='statusbar' />
                        <TouchableOpacityHitSlop onPress={this._handleBack}>
                            <Image source={require('~/src/image/back.png')}
                                style={styles.backIcon}
                            />
                        </TouchableOpacityHitSlop>
                        <View className='column-center' style={{ marginTop: 25 }}>
                            <FastImage
                                source={{ uri: 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fewedit.files.wordpress.com%2F2016%2F10%2Fdr-strange.jpg&w=400&c=sc&poi=face&q=85' }}
                                style={styles.avatar}
                            />
                            <Text className='white bold s14 mb4'>Vũ Long Hải</Text>
                            <Text className='white s12'>Admintrator</Text>
                        </View>

                    </View>

                </LinearGradient>
                <View className='row-end ph14' style={styles.actionContainer}>
                    <TouchableOpacityHitSlop onPress={this._handlePressEdit}>
                        <Image source={require('~src/image/edit.png')} style={styles.actionIcon} />
                    </TouchableOpacityHitSlop>
                </View>
                {this._render()}

                <View className='row-center'>
                    <SmallButton
                        red
                        text={I18n.t('logout')}
                        onPress={this._handlePressLogout}
                    />
                </View>
            </View>

        );
    }
}