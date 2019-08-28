import React, { Component } from 'react'
import I18n from '~/src/I18n'
import { Image, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native'
import { Container, Text, Toolbar, View, TextInputBase as TextInput, Button, SingleRowInput } from '~/src/themes/ThemeComponent'
import LoadingModal from '~/src/components/LoadingModal'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { COLORS } from '~/src/themes/common';
import { formatPhoneNumber, isValidPhoneNumer, chainParse } from '~/src/utils'
import { userInfoSelector } from "~/src/store/selectors/auth";
import { updateUserInfo, getUserInfo } from '~/src/store/actions/auth'
import ToastUtils from '~/src/utils/ToastUtils'
import lodash from 'lodash'

class AccountInfo extends Component {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            name: chainParse(props, ['userInfo', 'name']) || '',
            phone: chainParse(props, ['userInfo', 'phone']) || '',
            errName: '',
            errPhone: '',
            changed: false
        }
    }

    _handlePressChangePassword = () => {
        this.props.navigation.navigate('ChangePassword')
    }

    _handleSave = lodash.throttle(() => {
        const phoneNumber = this.state.phone.replace(/\s/g, "");
        if (!isValidPhoneNumer(phoneNumber)) {
            this.setState({ errPhone: I18n.t("err_invalid_phone_number") });
            return;
        }
        this.setState({ loading: true })
        const { updateUserInfo, getUserInfo } = this.props
        updateUserInfo(this.state.name.trim(), phoneNumber, (err, data) => {
            console.log('updateUserInfo err', err)
            console.log('updateUserInfo data', data)
            this.setState({ loading: false })
            const httpStatus = chainParse(data, ['httpHeaders', 'status'])
            if (httpStatus == 200) {
                getUserInfo()
                ToastUtils.showSuccessToast(I18n.t('update_account_info_success'))
                this.props.navigation.goBack()
            } else if (data && data.code) {
                ToastUtils.showErrorToast(data.msg)
            }
        })
    }, 500)

    componentDidMount() {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }
    }

    render() {
        const { userInfo } = this.props
        const enableBtn = (
            !!this.state.name &&
            !!this.state.phone &&
            !this.state.errName &&
            !this.state.errPhone &&
            this.state.changed
        )
        return (
            <Container>
                <LoadingModal visible={this.state.loading} />
                <Toolbar
                    title={I18n.t('account_info')}
                />
                <View className='flex background'>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View className='space16' />
                        <View className='row-space-between pl24 pr16'>
                            <View>
                                <Text className='s12 textBlack'>{I18n.t('username')}</Text>
                                <Text className='bold textBlack s15' style={{ marginTop: 5 }}>{userInfo.userName}</Text>
                            </View>
                            <TouchableOpacity onPress={this._handlePressChangePassword}>
                                <View className='row-start ph8 pv8' style={{ backgroundColor: COLORS.WHITE, borderWidth: 1, borderColor: COLORS.BORDER_COLOR, borderRadius: 6, }}>
                                    <Image source={require('~/src/image/lock.png')} style={{ width: 24, height: 24, marginRight: 8 }} />
                                    <Text className='s12 textBlack'>{I18n.t('change_password')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View className='space16' />
                        <SingleRowInput
                            label={I18n.t('full_name')}
                            onChangeText={text => this.setState({ name: text, errName: '', changed: true })}
                            value={this.state.name}
                            maxLength={80}
                            error={this.state.errName}
                            ref={ref => this.nameInput = ref}
                            returnKeyType={'next'}
                            onSubmitEditing={() => {
                                this.phoneInput && this.phoneInput.focus()
                            }}
                        />
                        <View className='space8' />
                        <SingleRowInput
                            label={I18n.t('phone_number')}
                            onChangeText={text => this.setState({ phone: formatPhoneNumber(text), errPhone: '', changed: true })}
                            value={formatPhoneNumber(this.state.phone)}
                            maxLength={12}
                            keyboardType={'number-pad'}
                            error={this.state.errPhone}
                            ref={ref => this.phoneInput = ref}
                            returnKeyType={'done'}
                        />
                    </KeyboardAwareScrollView>
                    <View className='bottom'>
                        <Button
                            onPress={this._handleSave}
                            text={I18n.t('save_change')}
                            style={{ flex: 1 }}
                            disabled={!enableBtn}
                        />
                    </View>
                </View>
            </Container>
        )
    }
}

export default connect(state => ({
    userInfo: userInfoSelector(state)
}), {
        updateUserInfo, getUserInfo
    })(AccountInfo)

const styles = StyleSheet.create({
    textInput: {
        fontSize: 14,
        height: 16,
        flex: 1,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
    }
})