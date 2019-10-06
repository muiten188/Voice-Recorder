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
import { getListUser, updateOtherUserInfo, createUser } from '~/src/store/actions/user'
import { chainParse, isValidEmail } from '~/src/utils'
import { ROLES_LIST, ROLES, SEX_LIST, USER_STATUS_LIST, SEX } from '~/src/constants'
import LoadingModal from '~/src/components/LoadingModal'
import { getUserInfo } from '~/src/store/actions/auth'
import moment from "moment"
import ToastUtils from '~/src/utils/ToastUtils'

class UserInfo extends Component {
    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props);
        const userInfo = props.navigation.getParam('userInfo', {})
        const userId = chainParse(userInfo, ['id']) || ''
        console.log('UserInfo', userInfo)
        const dateOfBirth = +chainParse(userInfo, ['date_of_birth'])
        this.state = {
            isEditing: !userId,
            id: userId,
            email: chainParse(userInfo, ['email']),
            role: chainParse(userInfo, ['role']) || ROLES.ADMIN,
            username: chainParse(userInfo, ['username']),
            firstName: chainParse(userInfo, ['first_name']),
            lastName: chainParse(userInfo, ['last_name']),
            sex: chainParse(userInfo, ['sex']) || SEX.MALE,
            activated: chainParse(userInfo, ['activated']) || true,
            password: '',
            dateOfBirth: dateOfBirth ? moment(dateOfBirth * 1000) : '',
            changed: false,
            loading: false,
            dobError: '',
            emailError: '',
            usernameError: '',
            firstNameError: '',
            lastNameError: '',
            passwordError: ''

        }
    }

    _handleBack = () => {
        this.props.navigation.goBack()
        return true
    }

    _handlePressEdit = () => {
        console.log('Pressing Edit')
        // Create User
        if (!this.state.id) {
            const { createUser, getListUser } = this.props
            if (!this.state.email || !this.state.email.trim()) {
                this.setState({ emailError: I18n.t('err_filed_require') })
                return
            } else if (!isValidEmail(this.state.email)) {
                this.setState({ emailError: I18n.t('err_invalid_email') })
                return
            } else if (!this.state.username || !this.state.username.trim()) {
                this.setState({ usernameError: I18n.t('err_filed_require') })
                return
            } else if (!this.state.firstName || !this.state.firstName.trim()) {
                this.setState({ firstNameError: I18n.t('err_filed_require') })
                return
            } else if (!this.state.lastName || !this.state.lastName.trim()) {
                this.setState({ lastNameError: I18n.t('err_filed_require') })
                return
            } else if (!this.state.dateOfBirth) {
                this.setState({ dobError: I18n.t('err_filed_require') })
                return
            } else if (!this.state.password || !this.state.password.trim()) {
                this.setState({ passwordError: I18n.t('err_filed_require') })
                return
            }
            this.setState({ loading: true })
            createUser({
                role: this.state.role,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                sex: this.state.sex,
                date_of_birth: this.state.dateOfBirth ? this.state.dateOfBirth.unix() : '',
                activated: true,
                username: this.state.username,
                email: this.state.email,
                new_password: this.state.password,
                password: ""

            }, (err, data) => {
                console.log('role err', err)
                console.log('role data', data)
                const statusCode = chainParse(data, ['httpHeaders', 'status'])
                this.setState({ loading: false })
                if (data && data.code && data.message) {
                    try {
                        const messageObj = JSON.parse(data.message)
                        if (messageObj.message) {
                            ToastUtils.showErrorToast(messageObj.message)
                        }
                    } catch (err) {
                        console.log('Parse json err', err)
                        ToastUtils.showErrorToast(data.message)
                    }

                } else if (statusCode == 200) {
                    getListUser()
                    ToastUtils.showSuccessToast(I18n.t('create_user_success'))
                    this.props.navigation.goBack()
                }
            })
        } else if (!this.state.isEditing) { // Change to edit mode
            this.setState({ isEditing: true })
        } else { // Update exist user
            const { updateOtherUserInfo, getListUser } = this.props
            this.setState({ loading: true })
            updateOtherUserInfo(this.state.id, {
                role: this.state.role,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                sex: this.state.sex,
                date_of_birth: this.state.dateOfBirth ? this.state.dateOfBirth.unix() : '',
                activated: this.state.activated,
                username: this.state.username,
                ...(this.state.password && this.state.password.trim()) && { password: this.state.password }
            }, (err, data) => {
                console.log('updateOtherUserInfo err', err)
                console.log('updateOtherUserInfo data', data)
                const statusCode = chainParse(data, ['httpHeaders', 'status'])
                this.setState({ loading: false, isEditing: false })
                if (statusCode == 200) {
                    getListUser()
                    ToastUtils.showSuccessToast(I18n.t('update_profile_success'))
                    this.props.navigation.goBack()
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
        this.setState({ dateOfBirth: newDob, dobError: '' })
    }

    _handleChangeStatus = (status) => {
        if (status != this.state.activated) {
            this.setState({ activated: status })
        }
    }

    componentDidMount() {
    }

    _renderViewExistUser = () => {
        return (
            <View style={styles.infoBlock}>
                <View className='row-start pv10 ph16'>
                    {/* <Image source={require('~/src/image/mail.png')} style={styles.fieldIcon} /> */}
                    <View style={styles.leftSpace} />
                    <View>
                        <Text className='bold s14 mb4'>{I18n.t('mail')}</Text>
                        <Text className='textBlack s13'>{this.state.email}</Text>
                    </View>
                </View>

                <View className='row-start pv10 ph16'>
                    {/* <Image source={require('~/src/image/mail.png')} style={styles.fieldIcon} /> */}
                    <View style={styles.leftSpace} />
                    <View>
                        <Text className='bold s14 mb4'>{I18n.t('username')}</Text>
                        <Text className='textBlack s13'>{this.state.username}</Text>
                    </View>
                </View>
                <View className='row-start pv10 ph16'>
                    {/* <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} /> */}
                    <View style={styles.leftSpace} />
                    <View>
                        <Text className='bold s14 mb4'>{I18n.t('first_name')}</Text>
                        <Text className='textBlack s13'>{this.state.firstName}</Text>
                    </View>
                </View>

                <View className='row-start pv10 ph16'>
                    {/* <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} /> */}
                    <View style={styles.leftSpace} />
                    <View>
                        <Text className='bold s14 mb4'>{I18n.t('last_name')}</Text>
                        <Text className='textBlack s13'>{this.state.lastName}</Text>
                    </View>
                </View>

                <View className='row-start pv10 ph16'>
                    {/* <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} /> */}
                    <View style={styles.leftSpace} />
                    <View>
                        <Text className='bold s14 mb4'>{I18n.t('date_of_birth')}</Text>
                        <Text className='textBlack s13'>{this.state.dateOfBirth ? this.state.dateOfBirth.format(I18n.t('date_format')) : ''}</Text>
                    </View>
                </View>

                <View className='row-start pv10 ph16'>
                    {/* <Image source={require('~/src/image/vitri.png')} style={styles.fieldIcon2} /> */}
                    <View style={styles.leftSpace} />
                    <View>
                        <Text className='bold s14 mb4'>{I18n.t('sex')}</Text>
                        <Text className='textBlack s13'>{this._getDisplaySex(this.state.sex)}</Text>
                    </View>
                </View>

                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View>
                        <Text className='bold s14 mb4'>{I18n.t('role')}</Text>
                        <Text className='textBlack s13'>{this._getDisplayRole(this.state.role)}</Text>
                    </View>
                </View>

                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View>
                        <Text className='bold s14 mb4'>{I18n.t('status')}</Text>
                        <Text className='textBlack s13'>{this.state.activated ? I18n.t('active') : I18n.t('inactive')}</Text>
                    </View>
                </View>


                <View className='row-start pv10 ph16'>
                    {/* <Image source={require('~/src/image/password.png')} style={styles.fieldIcon2} /> */}
                    <View style={styles.leftSpace} />
                    <View className='flex'>
                        <Text className='bold s14 mb4'>{I18n.t('password')}</Text>
                        <View className='row-start'>
                            <Text className='textBlack flex s13 bold'>••••••</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    _renderUpdateExistUser = () => {
        return (
            <View style={styles.infoBlock}>
                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View>
                        <Text className='bold s14 mb4'>{I18n.t('mail')}</Text>
                        <Text className='textBlack s13'>{this.state.email}</Text>
                    </View>
                </View>

                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View>
                        <Text className='bold s14 mb4'>{I18n.t('username')}</Text>
                        <Text className='textBlack s13'>{this.state.username}</Text>
                    </View>
                </View>

                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View className='flex'>
                        <TextInput
                            label={I18n.t('first_name')}
                            value={this.state.firstName}
                            onChangeText={text => this.setState({ firstName: text })}
                        />
                    </View>

                </View>

                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View className='flex'>
                        <TextInput
                            label={I18n.t('last_name')}
                            value={this.state.lastName}
                            onChangeText={text => this.setState({ lastName: text })}
                        />
                    </View>

                </View>
                <View className='ph16 pv10 row-start'>
                    <View style={styles.leftSpace} />
                    <DateInput
                        label={I18n.t('date_of_birth')}
                        value={this.state.dateOfBirth}
                        onChange={this._handleChangeDateOfBirth}
                        touchableStyle={{ flex: 1 }}
                    />
                </View>
                <View className='ph16 pv10 white row-start'>
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
                <View className='ph16 pv10 white row-start'>
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

                <View className='ph16 pv10 white row-start'>
                    <View style={styles.leftSpace} />
                    <DropdownInput
                        label={I18n.t('status')}
                        value={this.state.activated}
                        values={USER_STATUS_LIST}
                        popupTitle={I18n.t('choose_status')}
                        onPressItem={this._handleChangeStatus}
                        style={styles.dropdown}
                    />
                </View>

                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View className='flex'>
                        <TextInput
                            label={I18n.t('password')}
                            value={this.state.password}
                            onChangeText={text => this.setState({ password: text })}
                        />
                    </View>

                </View>
            </View>
        )
    }

    _renderCreateUser = () => {
        return (
            <View style={styles.infoBlock}>
                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View className='flex'>
                        <TextInput
                            label={I18n.t('mail')}
                            value={this.state.email}
                            onChangeText={text => this.setState({ email: text, emailError: '' })}
                            error={this.state.emailError}
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                        />
                    </View>
                </View>

                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View className='flex'>
                        <TextInput
                            label={I18n.t('username')}
                            value={this.state.username}
                            onChangeText={text => this.setState({ username: text, usernameError: '' })}
                            error={this.state.usernameError}
                            autoCapitalize={'none'}
                        />
                    </View>
                </View>

                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View className='flex'>
                        <TextInput
                            label={I18n.t('first_name')}
                            value={this.state.firstName}
                            onChangeText={text => this.setState({ firstName: text, firstNameError: '' })}
                            error={this.state.firstNameError}
                        />
                    </View>

                </View>

                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View className='flex'>
                        <TextInput
                            label={I18n.t('last_name')}
                            value={this.state.lastName}
                            onChangeText={text => this.setState({ lastName: text, lastNameError: '' })}
                            error={this.state.lastNameError}
                        />
                    </View>

                </View>
                <View className='ph16 pv10 row-start'>
                    <View style={styles.leftSpace} />
                    <DateInput
                        label={I18n.t('date_of_birth')}
                        value={this.state.dateOfBirth}
                        onChange={this._handleChangeDateOfBirth}
                        error={this.state.dobError}
                        touchableStyle={{ flex: 1 }}
                    />
                </View>
                <View className='ph16 pv10 white row-start'>
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
                <View className='ph16 pv10 white row-start'>
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

                <View className='row-start pv10 ph16'>
                    <View style={styles.leftSpace} />
                    <View className='flex'>
                        <TextInput
                            label={I18n.t('password')}
                            value={this.state.password}
                            onChangeText={text => this.setState({ password: text, passwordError: '' })}
                            error={this.state.passwordError}
                        />
                    </View>

                </View>
            </View>
        )
    }

    _render = () => {
        if (!this.state.id) {
            return this._renderCreateUser()
        }
        else if (!this.state.isEditing) {
            return this._renderViewExistUser()
        } else {
            return this._renderUpdateExistUser()
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

export default connect(null, {
    updateOtherUserInfo, logout, getUserInfo, getListUser, createUser
})(UserInfo)