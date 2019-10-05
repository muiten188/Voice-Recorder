import React, { Component } from "react"
import { Image } from 'react-native'
import { View, Text, TextInput, SmallButton, TouchableOpacityHitSlop, DropdownInput } from "~/src/themes/ThemeComponent";
import FastImage from 'react-native-fast-image'
import I18n from '~/src/I18n'
import styles from './styles'
import LinearGradient from 'react-native-linear-gradient'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { logout } from '~/src/store/actions/common'
import { connect } from 'react-redux'
import { updateUserInfo } from '~/src/store/actions/auth'
import { userInfoSelector } from '~/src/store/selectors/auth'
import { chainParse } from '~/src/utils'
import { ROLES_LIST } from '~/src/constants'
import LoadingModal from '~/src/components/LoadingModal'
import { getUserInfo } from '~/src/store/actions/auth'
class MyAccount extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props);
        console.log('UserInfo', props.userInfo)
        this.state = {
            isEditing: false,
            phone: '0977865062',
            email: chainParse(props, ['userInfo', 'email']),
            role: chainParse(props, ['userInfo', 'role']),
            loading: false
        }
    }

    _handleBack = () => {
        this.props.navigation.goBack()
    }

    _handlePressEdit = () => {
        console.log('Pressing Edit')
        if (!this.state.isEditing) {
            this.setState({ isEditing: true })
        } else {
            const { updateUserInfo } = this.props
            this.setState({ loading: true })
            updateUserInfo(this.state.email, {
                role: this.state.role,
            }, (err, data) => {
                console.log('updateUserInfo err', err)
                console.log('updateUserInfo data', data)
                const { getUserInfo } = this.props
                getUserInfo()
                this.setState({ loading: false, isEditing: false })
            })
        }

    }

    _handlePressLogout = () => {

    }

    _handlePressChangePassword = () => {
        this.props.navigation.navigate('ChangePassword')
    }

    _getDisplayRole = (role) => {
        const roleObj = ROLES_LIST.find(item => item.value == role)
        if (!roleObj) return ''
        return roleObj.name
    }

    _handleChangeRole = (role) => {
        if (role != this.state.role) {
            this.setState({ role })
        }
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
                            <Text className='textBlack s13'>{this.state.email}</Text>
                        </View>
                    </View>
                    <View className='row-start pv16 ph16'>
                        <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('position')}</Text>
                            <Text className='textBlack s13'>{this._getDisplayRole(this.state.role)}</Text>
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
                                value={this.state.email}
                                onChangeText={text => this.setState({ email: text })}
                            />
                        </View>

                    </View>
                    <View className='ph16 pv16 white row-start'>
                        <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} />
                        <DropdownInput
                            label={I18n.t('position')}
                            value={this.state.role}
                            values={ROLES_LIST}
                            popupTitle={I18n.t('choose_position')}
                            onPressItem={this._handleChangeRole}
                            style={styles.dropdown}
                        />
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <View className="flex white">
                <LoadingModal visible={this.state.loading} />
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
                            <TouchableOpacityHitSlop onPress={this._handleBack} style={styles.backIconTouchable}>
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

export default connect(state => ({
    userInfo: userInfoSelector(state)
}), {
    updateUserInfo, logout, getUserInfo
})(MyAccount)