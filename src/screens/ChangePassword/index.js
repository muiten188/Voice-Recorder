import React, { Component } from "react"
import { Image } from 'react-native'
import { View, Text, SmallButton, TouchableOpacityHitSlop, TextInput } from "~/src/themes/ThemeComponent";
import FastImage from 'react-native-fast-image'
import I18n from '~/src/I18n'
import styles from './styles'
import LinearGradient from 'react-native-linear-gradient'
import { updateUserInfo } from '~/src/store/actions/auth'
import { connect } from 'react-redux'
import { userInfoSelector } from '~/src/store/selectors/auth'
import LoadingModal from '~/src/components/LoadingModal'
import { chainParse } from '~/src/utils'
import { logout } from '~/src/store/actions/common'
import ToastUtils from '~/src/utils/ToastUtils'

class ChangePassword extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            newPassword: '',
            rePassword: '',
            errPassword: '',
            errRepassword: '',
            code: '',
            loading: false
        }
    }

    _handlePressConfirm = () => {
        if (this.state.newPassword != this.state.rePassword) {
            this.setState({ errRepassword: I18n.t('err_invalid_repassword') })
            return
        }
        this.setState({ loading: true })
        const { updateUserInfo } = this.props
        updateUserInfo('', {
            current_password: this.state.password,
            password: this.state.newPassword
        }, (err, data) => {
            console.log('Change pass err', err)
            console.log('Change pass data', data)
            this.setState({ loading: false })
            const statusCode = chainParse(data, ['httpHeaders', 'status'])
            if (data && data.code && data.message) {
                try {
                    const messObj = JSON.parse(data.message)
                    if (messObj.code == 6) {
                        this.setState({ errPassword: I18n.t('err_invalid_current_password') })
                    }
                } catch (err) {
                    console.log('Parse json error', err)
                }
            } else if (statusCode == 200) {
                const { logout } = this.props
                ToastUtils.showSuccessToast(I18n.t('change_password_success'))
                logout()
                
            }

        })
    }

    render() {
        const { userInfo } = this.props
        return (
            <View className="flex white">
                <LoadingModal visible={this.state.loading} />
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
                            <Text className='white bold s14 mb4'>{userInfo.last_name}</Text>
                            <Text className='white s12'>Admintrator</Text>
                        </View>

                    </View>
                </LinearGradient>
                <View>
                    <View className='space10' />
                    <View className='ph16 pv12'>
                        <TextInput
                            label={I18n.t('password')}
                            value={this.state.password}
                            onChangeText={text => this.setState({ password: text, errPassword: '' })}
                            secureTextEntry={true}
                            error={this.state.errPassword}
                        />
                    </View>
                    <View className='ph16 pv12'>
                        <TextInput
                            label={I18n.t('new_password')}
                            value={this.state.newPassword}
                            onChangeText={text => this.setState({ newPassword: text })}
                            secureTextEntry={true}
                        />
                    </View>
                    <View className='ph16 pv12'>
                        <TextInput
                            label={I18n.t('re_new_password')}
                            value={this.state.rePassword}
                            onChangeText={text => this.setState({ rePassword: text, errRepassword: '' })}
                            secureTextEntry={true}
                            error={this.state.errRepassword}
                        />
                    </View>
                    <View className='space100' />
                </View>

                <View className='row-center'>
                    <SmallButton
                        green
                        text={I18n.t('confirm')}
                        onPress={this._handlePressConfirm}
                    />
                </View>
            </View>

        );
    }
}

export default connect(state => ({
    userInfo: userInfoSelector(state)
}), {
    updateUserInfo, logout
})(ChangePassword)

