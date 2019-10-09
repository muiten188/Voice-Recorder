import React, { Component } from "react";
import {
    ImageBackground,
    Image,
    InteractionManager
} from "react-native";
import {
    View,
    RoundTextInput,
    Button,
    TouchableOpacityHitSlop,
    Text, Checkbox,
    PopupConfirm
} from "~/src/themes/ThemeComponent";
import { connect } from "react-redux";
import I18n from "~/src/I18n";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "~/src/themes/common";
import styles from "./styles";
import LoadingModal from "~/src/components/LoadingModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackActions, NavigationActions } from "react-navigation";
import lodash from 'lodash'
import { signIn, createAccessToken } from '~/src/store/actions/auth'
import { chainParse } from '~/src/utils'
import ToastUtils from '~/src/utils/ToastUtils'
import AsyncStorage from "@react-native-community/async-storage";

class Login extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            userName: props.username || "",
            password: "",
            errPassword: "",
            errUserName: "",
            loading: false,
            saveLogin: false
        };
    }

    _handlePressSaveLogin = () => {
        this.setState({ saveLogin: !this.state.saveLogin })
    }

    _handleLogin = lodash.throttle(() => {
        if (!this.state.userName || !this.state.password) return
        const { signIn, createAccessToken } = this.props
        InteractionManager.runAfterInteractions(() => {
            this.setState({ loading: true })
            signIn(this.state.userName, this.state.password, (err, data) => {
                console.log('signIn err', err)
                console.log('signIn data', data)

                const statusCode = chainParse(data, ['httpHeaders', 'status'])
                if (statusCode == 200) {
                    const refreshToken = chainParse(data, ['refresh_token'])
                    // Save refreshToken to AsyncStorage
                    AsyncStorage.setItem("refreshToken", refreshToken);
                    createAccessToken(refreshToken, (errAc, dataAc) => {
                        console.log('createAccessToken err', errAc)
                        console.log('createAccessToken data', dataAc)
                        this.setState({ loading: false })
                        const statusCodeAc = chainParse(data, ['httpHeaders', 'status'])
                        if (statusCodeAc == 200) {
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: "Drawer" })],
                                key: undefined
                            });
                            this.props.navigation.dispatch(resetAction);
                        } else if (data && data.message) {
                            this.setState({ loading: false })
                            const messObj = JSON.parse(data.message)
                            ToastUtils.showErrorToast(messObj['message'])
                        } else {
                            this.setState({ loading: false })
                        }
                    })

                } else if (data && data.message) {
                    this.setState({ loading: false })
                    const messObj = JSON.parse(data.message)
                    ToastUtils.showErrorToast(messObj['message'])
                } else {
                    this.setState({ loading: false })
                }
            })
        })
    }, 500)


    _handlePressRegister = () => {
        console.log('_handlePressRegister')
        this.popupRegister && this.popupRegister.open()
    }

    render() {

        return (
            <View className='flex white'>
                <LoadingModal visible={this.state.loading} />
                <PopupConfirm
                    ref={ref => this.popupRegister = ref}
                    oneButton={true}
                    showHeader={false}
                >
                    <View className='column-center'>
                        <View className='pv16'>
                            <Text className='s18 lh24 bold textBlack center'>{I18n.t('register_new_account')}</Text>
                        </View>
                        <View className='pv16'>
                            <Text className='s14 lh24 textBlack center'>{I18n.t('register_content')}</Text>
                        </View>
                    </View>

                </PopupConfirm>
                <ImageBackground
                    source={require('~/src/image/bg_login.png')}
                    style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
                    resizeMode={'stretch'}
                >
                    <View className='flex ph16'>
                        <View className='space60' />
                        <View className='row-center'>
                            <Image source={require('~/src/image/logo_login.png')}
                                style={{ width: 185, height: 67 }}
                                resizeMode={'cover'}
                            />
                        </View>
                        <View className='space56' />
                        <RoundTextInput
                            value={this.state.userName}
                            error={this.state.errUserName}
                            onChangeText={text => this.setState({ userName: text, errUserName: '' })}
                            placeholder={I18n.t('account')}
                            autoCapitalize={'none'}
                        />
                        <View className='space16' />
                        <RoundTextInput
                            value={this.state.password}
                            error={this.state.errPassword}
                            onChangeText={text => this.setState({ password: text, errPassword: '' })}
                            placeholder={I18n.t('password')}
                            secureTextEntry={true}
                            autoCapitalize={'none'}
                        />
                        <View className='space40' />

                        <Button
                            onPress={this._handleLogin}
                            text={I18n.t('login')}
                        />
                        <View className='space40' />
                        <View className='row-space-between'>

                            <Checkbox
                                text={I18n.t('save_login')}
                                checked={this.state.saveLogin}
                                onPress={this._handlePressSaveLogin}
                            />
                            <TouchableOpacityHitSlop>
                                <Text className='error s13'>{I18n.t('forgot_password_question')}</Text>
                            </TouchableOpacityHitSlop>

                        </View>
                        {/* <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            keyboardShouldPersistTaps={"handled"}
                            enableOnAndroid={true}
                        >
                        </KeyboardAwareScrollView> */}
                        <View style={styles.registerContainer}>
                            <TouchableOpacityHitSlop onPress={this._handlePressRegister}>
                                <Text className='green'>{I18n.t('register_account')}</Text>
                            </TouchableOpacityHitSlop>
                        </View>
                    </View>

                </ImageBackground>
            </View>
        );
    }
}
export default connect(
    null,
    {
        signIn, createAccessToken
    }
)(Login);
