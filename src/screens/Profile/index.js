import React, { Component } from "react"
import { Image } from 'react-native'
import { View, Text, TextInput, SmallButton, TouchableOpacityHitSlop, DropdownInput, DateInput } from "~/src/themes/ThemeComponent";
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
import { ROLES_LIST, SEX_LIST } from '~/src/constants'
import LoadingModal from '~/src/components/LoadingModal'
import { getUserInfo } from '~/src/store/actions/auth'
import moment from "moment"
import ToastUtils from '~/src/utils/ToastUtils'
class Profile extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props);
        console.log('UserInfo', props.userInfo)
        const dateOfBirth = +chainParse(props, ['userInfo', 'date_of_birth'])
        this.state = {
            isEditing: false,
            email: chainParse(props, ['userInfo', 'email']),
            role: chainParse(props, ['userInfo', 'role']),
            firstName: chainParse(props, ['userInfo', 'first_name']),
            lastName: chainParse(props, ['userInfo', 'last_name']),
            sex: chainParse(props, ['userInfo', 'sex']),
            dateOfBirth: dateOfBirth ? moment(dateOfBirth * 1000) : '',
            changed: false,
            loading: false,
        }
    }

    _handleBack = () => {
        this.props.navigation.goBack()
        return true
    }

    _loadUserInfo = () => {
        const { getUserInfo } = this.props
        getUserInfo((err, data) => {
            const statusCode = chainParse(data, ['httpHeaders', 'status'])
            if (statusCode == 200) {
                const dateOfBirth = +chainParse(data, ['date_of_birth'])
                this.setState({
                    email: chainParse(data, ['email']),
                    role: chainParse(data, ['role']),
                    firstName: chainParse(data, ['first_name']),
                    lastName: chainParse(data, ['last_name']),
                    sex: chainParse(data, ['sex']),
                    dateOfBirth: dateOfBirth ? moment(dateOfBirth * 1000) : '',
                })
            }
        })
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
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                sex: this.state.sex,
                date_of_birth: this.state.dateOfBirth ? this.state.dateOfBirth.unix() : ''
            }, (err, data) => {
                console.log('updateUserInfo err', err)
                console.log('updateUserInfo data', data)
                const statusCode = chainParse(data, ['httpHeaders', 'status'])
                this.setState({ loading: false, isEditing: false })
                if (statusCode == 200){
                    ToastUtils.showSuccessToast(I18n.t('update_profile_success'))
                    this._loadUserInfo()
                }
                
                
            })
        }

    }

    _handlePressLogout = () => {

    }

    _handlePressChangePassword = () => {
        this.props.navigation.navigate('ChangePassword')
    }

    _getDisplayRole = (role) => {
        const roleObj = ROLES_LIST.find(item => item.value === role)
        if (!roleObj) return ''
        return roleObj.name
    }

    _handleChangeRole = (role) => {
        if (role != this.state.role) {
            this.setState({ role })
        }
    }

    _getDisplaySex = (sex) => {
        const sexObj = SEX_LIST.find(item => item.value === sex)
        if (!sexObj) return ''
        return sexObj.name
    }

    _handleChangeSex = (sex) => {
        if (sex != this.state.sex) {
            this.setState({ sex })
        }
    }

    _handleChangeDateOfBirth = (newDob) => {
        console.log('New dob', newDob)
        this.setState({ dateOfBirth: newDob })
    }

    componentDidMount() {
        this._loadUserInfo()
    }

    _render = () => {
        if (!this.state.isEditing) {
            return (
                <View style={styles.infoBlock}>
                    <View className='row-start pv16 ph16'>
                        {/* <Image source={require('~/src/image/mail.png')} style={styles.fieldIcon} /> */}
                        <View style={styles.leftSpace} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('mail')}</Text>
                            <Text className='textBlack s13'>{this.state.email}</Text>
                        </View>
                    </View>
                    <View className='row-start pv16 ph16'>
                        {/* <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} /> */}
                        <View style={styles.leftSpace} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('first_name')}</Text>
                            <Text className='textBlack s13'>{this.state.firstName}</Text>
                        </View>
                    </View>

                    <View className='row-start pv16 ph16'>
                        {/* <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} /> */}
                        <View style={styles.leftSpace} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('last_name')}</Text>
                            <Text className='textBlack s13'>{this.state.lastName}</Text>
                        </View>
                    </View>

                    <View className='row-start pv16 ph16'>
                        {/* <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} /> */}
                        <View style={styles.leftSpace} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('date_of_birth')}</Text>
                            <Text className='textBlack s13'>{this.state.dateOfBirth ? this.state.dateOfBirth.format(I18n.t('date_format')) : ''}</Text>
                        </View>
                    </View>

                    <View className='row-start pv16 ph16'>
                        {/* <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} /> */}
                        <View style={styles.leftSpace} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('sex')}</Text>
                            <Text className='textBlack s13'>{this._getDisplaySex(this.state.sex)}</Text>
                        </View>
                    </View>

                    <View className='row-start pv16 ph16'>

                        <View style={styles.leftSpace} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('role')}</Text>
                            <Text className='textBlack s13'>{this._getDisplayRole(this.state.role)}</Text>
                        </View>
                    </View>


                    <View className='row-start pv16 ph16'>
                        {/* <Image source={require('~/src/image/password.png')} style={styles.fieldIcon2} /> */}
                        <View style={styles.leftSpace} />
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
                        {/* <Image source={require('~/src/image/mail.png')} style={styles.fieldIcon} /> */}
                        <View style={styles.leftSpace} />
                        <View>
                            <Text className='bold s14 mb4'>{I18n.t('mail')}</Text>
                            <Text className='textBlack s13'>{this.state.email}</Text>
                        </View>
                    </View>

                    <View className='row-start pv16 ph16'>
                        {/* <Image source={require('~/src/image/mail.png')} style={styles.fieldIcon} /> */}
                        <View style={styles.leftSpace} />
                        <View className='flex'>
                            <TextInput
                                label={I18n.t('first_name')}
                                value={this.state.firstName}
                                onChangeText={text => this.setState({ firstName: text })}
                            />
                        </View>

                    </View>

                    <View className='row-start pv16 ph16'>
                        {/* <Image source={require('~/src/image/mail.png')} style={styles.fieldIcon} /> */}
                        <View style={styles.leftSpace} />
                        <View className='flex'>
                            <TextInput
                                label={I18n.t('last_name')}
                                value={this.state.lastName}
                                onChangeText={text => this.setState({ lastName: text })}
                            />
                        </View>

                    </View>
                    <View className='ph16 pv16 row-start'>
                        <View style={styles.leftSpace} />
                        <DateInput
                            label={I18n.t('date_of_birth')}
                            value={this.state.dateOfBirth}
                            onChange={this._handleChangeDateOfBirth}
                            touchableStyle={{ flex: 1 }}
                        />
                    </View>
                    <View className='ph16 pv16 white row-start'>
                        {/* <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} /> */}
                        <View style={styles.leftSpace} />
                        <DropdownInput
                            label={I18n.t('sex')}
                            value={this.state.sex}
                            values={SEX_LIST}
                            popupTitle={I18n.t('choose_sex')}
                            onPressItem={this._handleChangeSex}
                            style={styles.dropdown}
                        />
                    </View>
                    <View className='ph16 pv16 white row-start'>
                        {/* <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} /> */}
                        <View style={styles.leftSpace} />
                        <DropdownInput
                            label={I18n.t('role')}
                            value={this.state.role}
                            values={ROLES_LIST}
                            popupTitle={I18n.t('choose_role')}
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
                                    source={require('~/src/image/default_avatar.jpg')}
                                    style={styles.avatar}
                                />
                                <Text className='white bold s14 mb4'>{this.state.firstName} {this.state.lastName}</Text>
                                <Text className='white s12'>{this._getDisplayRole(this.state.role)}</Text>
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
                    <View className='space32' />
                </KeyboardAwareScrollView>
            </View>


        );
    }
}

export default connect(state => ({
    userInfo: userInfoSelector(state)
}), {
    updateUserInfo, logout, getUserInfo
})(Profile)