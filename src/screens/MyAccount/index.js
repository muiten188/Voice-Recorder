import React, { Component } from "react"
import { Image } from 'react-native'
import { View, Text, TextInput, SmallButton, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent";
import FastImage from 'react-native-fast-image'
import I18n from '~/src/I18n'
import styles from './styles'
import LinearGradient from 'react-native-linear-gradient'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class MyAccount extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            phone: '0977865062',
            mail: 'vu.longhai93@gmail.com',
            position: 'Traffic Reporter',
        }
    }

    _handleBack = () => {
        this.props.navigation.goBack()
    }

    _handlePressEdit = () => {
        console.log('Pressing Edit')
        this.setState({ isEditing: !this.state.isEditing })
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
                            <Text className='textBlack s13'>{this.state.phone}</Text>
                        </View>
                    </View>
                    <View className='row-start pv16 ph16'>
                        <Image source={require('~/src/image/mail.png')} style={styles.fieldIcon} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('mail')}</Text>
                            <Text className='textBlack s13'>{this.state.mail}</Text>
                        </View>
                    </View>
                    <View className='row-start pv16 ph16'>
                        <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('position')}</Text>
                            <Text className='textBlack s13'>{this.state.position}</Text>
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
        } else {
            return (
                <View style={styles.infoBlock}>
                    <View className='row-start pv16 ph16'>
                        <Image source={require('~/src/image/phone.png')} style={styles.fieldIcon} />
                        <View className='flex'>
                            <TextInput
                                label={I18n.t('phone')}
                                value={this.state.phone}
                                onChangeText={text => this.setState({ phone: text })}
                                keyboardType={'number-pad'}
                            />
                        </View>
                    </View>
                    <View className='row-start pv16 ph16'>
                        <Image source={require('~/src/image/mail.png')} style={styles.fieldIcon} />
                        <View className='flex'>
                            <TextInput
                                label={I18n.t('mail')}
                                value={this.state.mail}
                                onChangeText={text => this.setState({ mail: text })}
                            />
                        </View>

                    </View>
                    <View className='row-start pv16 ph16'>
                        <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} />
                        <View className='flex'>
                            <TextInput
                                label={I18n.t('position')}
                                value={this.state.position}
                                onChangeText={text => this.setState({ position: text })}
                            />
                        </View>
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <View className="flex white">
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={"handled"}
                    enableOnAndroid={true}
                >
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
                            <Image source={this.state.isEditing ? require('~src/image/edit_done.png') : require('~src/image/edit.png')} style={styles.actionIcon} />
                        </TouchableOpacityHitSlop>
                    </View>
                    {this._render()}

                    {!this.state.isEditing && <View className='row-center'>
                        <SmallButton
                            red
                            text={I18n.t('logout')}
                            onPress={this._handlePressLogout}
                        />
                    </View>}
                </KeyboardAwareScrollView>
            </View>


        );
    }
}