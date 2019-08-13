import React, { Component } from "react";
import { StyleSheet } from 'react-native'
import { connect } from "react-redux";
import { COLORS } from "~/src/themesnew/common";
import I18n from "~/src/I18n";
import { changePassword } from "~/src/store/actions/auth";
import { logout } from "~/src/store/actions/common";
import LoadingModal from "~/src/components/LoadingModal";
import { isValidPassword, sha256 } from "~/src/utils";
import { PASSWORD_LENGTH } from "~/src/constants";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Container, SingleRowInput, Toolbar, View, Button } from '~/src/themesnew/ThemeComponent'

class ChangePassword extends Component {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            oldPassdword: "",
            newPassword: "",
            reNewPassword: "",
            errOldPassword: "",
            errNewPassword: "",
            errReNewPassword: "",
            loading: false
        };
    }

    _changePassword = () => {
        if (!isValidPassword(this.state.newPassword)) {
            this.setState({
                errNewPassword: I18n.t("err_invalid_password_complexity")
            });
            return;
        } else if (this.state.newPassword != this.state.reNewPassword) {
            this.setState({ errReNewPassword: I18n.t("err_renew_password") });
            return;
        }
        const { changePassword } = this.props;
        this.setState({ loading: true });
        changePassword(
            sha256(this.state.oldPassdword),
            sha256(this.state.newPassword),
            (err, data) => {
                console.log("changePassword err", err);
                console.log("changePassword data", data);
                if (data.code && data.code == 1005) {
                    this.setState({ errOldPassword: data.msg, loading: false });
                } else if (data.code && data.code == 1009) {
                    this.setState({
                        errNewPassword: I18n.t("err_new_password_policy"),
                        loading: false
                    });
                } else if (data && data.updated && data.updated.result === true) {
                    this.setState({ loading: false });
                    // this.props.navigation.goBack();
                    const { logout } = this.props;
                    logout();
                    this.props.navigation.navigate("Toast", {
                        text: I18n.t("change_password_success")
                    });
                } else {
                    this.setState({ loading: false });
                }
            }
        );
    };
    _handleOnChangeTextOldPassword = text => {
        if (text === "") {
            this.setState({
                oldPassdword: text,
                errOldPassword: I18n.t("err_obligatory_old_password_second")
            });
            return;
        }
        if (!isValidPassword(text)) {
            this.setState({
                oldPassdword: text,
                errOldPassword: I18n.t("err_invalid_password_second")
            });
            return;
        } else {
            this.setState({
                oldPassdword: text,
                errOldPassword: ""
            });
            return;
        }
    };
    _handleOnChangeTextNewPassword = text => {
        if (text === "") {
            this.setState({
                newPassword: text,
                errNewPassword: I18n.t("err_obligatory_new_password_second")
            });
            return;
        }
        if (!isValidPassword(text)) {
            this.setState({
                newPassword: text,
                errNewPassword: I18n.t("err_invalid_password_second")
            });
            return;
        } else {
            this.setState({
                newPassword: text,
                errNewPassword: ""
            });
            return;
        }
    };

    _handleOnChangeTextReNewPassword = text => {
        if (text === "") {
            this.setState({
                reNewPassword: text,
                errReNewPassword: I18n.t("err_obligatory_re_new_password_second")
            });
            return;
        }
        if (!isValidPassword(text)) {
            this.setState({
                reNewPassword: text,
                errReNewPassword: I18n.t("err_invalid_password_second")
            });
            return;
        }
        else if (text !== this.state.newPassword) {
            this.setState({
                reNewPassword: text,
                errReNewPassword: I18n.t("err_invalid_re_password")
            })
        }
        else {
            this.setState({
                reNewPassword: text,
                errReNewPassword: ""
            });
            return;
        }
    };

    render() {
        const enableButton = !!(
            this.state.oldPassdword &&
            this.state.newPassword &&
            this.state.reNewPassword &&
            !this.state.errNewPassword &&
            !this.state.errOldPassword &&
            !this.state.errReNewPassword
        );
        return (
            <Container>
                <LoadingModal visible={this.state.loading} />
                <Toolbar
                    title={I18n.t('change_password')}
                />
                <View className='flex background'>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View style={{ width: '100%', height: 70 }} />

                        <SingleRowInput
                            onChangeText={this._handleOnChangeTextOldPassword}
                            value={this.state.oldPassdword}
                            maxLength={PASSWORD_LENGTH}
                            placeholder={I18n.t('input_info')}
                            secureTextEntry={true}
                            error={this.state.errOldPassword}
                            label={I18n.t('old_password')}
                        />
                        {/* <View className='row-start white'>
                            <View className='leftLabel'>
                                <Text className='s12 textBlack'>{I18n.t('old_password')}</Text>
                            </View>
                            <View className='ph16 flex pt16 border-left2' style={{ paddingBottom: !!this.state.errOldPassword ? 0 : 16 }}>
                                <TextInput
                                    onChangeText={this._handleOnChangeTextOldPassword}
                                    value={this.state.oldPassdword}
                                    style={styles.textInput}
                                    selectionColor={COLORS.CERULEAN}
                                    maxLength={PASSWORD_LENGTH}
                                    placeholder={I18n.t('input_info')}
                                    secureTextEntry={true}
                                />
                                {!!this.state.errOldPassword && <Text className='error pv8'>{this.state.errOldPassword}</Text>}
                            </View>
                        </View> */}

                        <View className='space8' />
                        {/* <View className='row-start white border-bottom2'>
                            <View className='leftLabel'>
                                <Text className='s12 textBlack'>{I18n.t('new_password')}</Text>
                            </View>
                            <View className='ph16 flex pt16 border-left2' style={{ paddingBottom: !!this.state.errNewPassword ? 0 : 16 }}>
                                <TextInput
                                    onChangeText={this._handleOnChangeTextNewPassword}
                                    value={this.state.newPassword}
                                    style={styles.textInput}
                                    selectionColor={COLORS.CERULEAN}
                                    maxLength={PASSWORD_LENGTH}
                                    placeholder={I18n.t('hint_type_password')}
                                    secureTextEntry={true}
                                />
                                {!!this.state.errNewPassword && <Text className='error pv8'>{this.state.errNewPassword}</Text>}
                            </View>
                        </View> */}
                        <View className='border-bottom2'>
                            <SingleRowInput
                                onChangeText={this._handleOnChangeTextNewPassword}
                                value={this.state.newPassword}
                                maxLength={PASSWORD_LENGTH}
                                placeholder={I18n.t('hint_type_password')}
                                secureTextEntry={true}
                                label={I18n.t('new_password')}
                                error={this.state.errNewPassword}
                            />
                        </View>

                        <SingleRowInput
                            onChangeText={this._handleOnChangeTextReNewPassword}
                            value={this.state.reNewPassword}
                            maxLength={PASSWORD_LENGTH}
                            placeholder={I18n.t('hint_retype_password')}
                            secureTextEntry={true}
                            label={I18n.t('retype_new_password')}
                            error={this.state.errReNewPassword}
                        />

                        {/* <View className='row-start white'>
                            <View className='leftLabel'>
                                <Text className='s12 textBlack'>{I18n.t('retype_new_password')}</Text>
                            </View>
                            <View className='ph16 flex pt16 border-left2' style={{ paddingBottom: !!this.state.errReNewPassword ? 0 : 16 }}>
                                <TextInput
                                    onChangeText={this._handleOnChangeTextReNewPassword}
                                    value={this.state.reNewPassword}
                                    style={styles.textInput}
                                    selectionColor={COLORS.CERULEAN}
                                    maxLength={PASSWORD_LENGTH}
                                    placeholder={I18n.t('hint_retype_password')}
                                    secureTextEntry={true}
                                />
                                {!!this.state.errReNewPassword && <Text className='error pv8'>{this.state.errReNewPassword}</Text>}
                            </View>
                        </View> */}

                    </KeyboardAwareScrollView>
                    <View className='bottom'>
                        <Button
                            onPress={this._changePassword}
                            text={I18n.t('update')}
                            style={{ flex: 1 }}
                            disabled={!enableButton}
                        />
                    </View>
                </View>
            </Container>
        );
    }
}

export default connect(
    null,
    { changePassword, logout }
)(ChangePassword);

const styles = StyleSheet.create({
    textInput: {
        fontSize: 14,
        height: 16,
        flex: 1,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0
    }
})
