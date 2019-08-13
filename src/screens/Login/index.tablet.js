import React, { Component } from "react";
import {
  Surface,
  SilverButton as Button,
  Toolbar,
  Text,
  OutlinedTextInput as TextInput,
  RadioGroup
} from "~/src/themes/ThemeComponent";
import { DefaultTheme, TouchableRipple } from "react-native-paper";
import {
  ImageBackground,
  StatusBar,
  Platform,
  Linking,
  BackHandler,
  Image,
  View
  // AsyncStorage
} from "react-native";

import { saveTenantCode, saveUserName } from "~/src/utils/AsyncStoreUtils";

import { connect } from "react-redux";
import I18n from "~/src/I18n";
import {
  DEFAULT_PUSH_ANIMATION,
  DEFAULT_POP_ANIMATION,
  COLORS,
  DEVICE_WIDTH,
  DEVICE_HEIGHT
} from "~/src/themes/common";
import {
  PASSWORD_LENGTH,
  MASTER_ROLE,
  MIN_LENGTH,
  MAX_LENGTH_TENANTCODE,
  MAX_LENGTH_NAME
} from "~/src/constants";
import PopupConfirm from "~/src/components/PopupConfirm";
import {
  scaleWidth,
  scaleHeight,
  replacePatternString,
  formatPhoneNumber,
  isValidUserName,
  isValidPhoneNumer,
  showToast,
  shouldDisablePress,
  chainParse,
  sha256,
  isValidTenantCode,
  isValidPassWord
} from "~/src/utils";
import LoadingModal from "~/src/components/LoadingModal";
import { getListMerchant } from "~/src/store/actions/merchant";
import { getPermission } from "~/src/store/actions/permission";
import md5 from "md5";
import { signIn } from "~/src/store/actions/auth";
import { StackActions, NavigationActions } from "react-navigation";
import Ripple from "react-native-material-ripple";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const LOGO_WIDTH = 108;
const LOGO_HEIGHT = 78.3;
const LOGO_CONTAINER_HEIGHT = 130;
const SHOP_WIDTH = 276.7;
const SHOP_HEIGHT = 300.7;
const SHOP_PADDING_RIGHT = 46;
const INPUT_BLOCK_TOP = 300;
const HORIZONTAL_PADDING = scaleWidth(70);
const INPUT_WIDTH = DEVICE_WIDTH - 2 * HORIZONTAL_PADDING;
import APIManager from "~/src/store/api/APIManager";
import {
  APP_MODE,
  APP_MODE_DEF,
  API_ENDPOINT
} from "~/src/store/api/constants";

class Login extends Component {
  static get options() {
    if (Platform.OS == "android") {
      return {
        animations: {
          push: DEFAULT_PUSH_ANIMATION,
          pop: DEFAULT_POP_ANIMATION
        }
      };
    }
    return {};
  }

  constructor(props) {
    super(props);
    this.state = {
      phone: props.phone || "",
      username: props.username || "",
      password: "",
      secure: true,
      showFingerprint: false,
      loading: false,
      errPass: "",
      errPhone: "",
      tenantCode: "",
      errTenantCode: "",
      hintUserName: I18n.t("username"),
      hintTenantCode: I18n.t("tenant_code")
    };
  }

  _handlePressLogin = () => {
    if (this.disableLoginButton) return;
    // const phoneNumber = this.state.phone.replace(/\s/g, "");
    const username = this.state.username.replace(/\s/g, "");
    const tenantCode = this.state.tenantCode;
    if (!isValidTenantCode(tenantCode)) {
      this.setState({
        errTenantCode: I18n.t("err_invalid_tenant_code")
      });
      return;
    }
    if (!isValidUserName(username)) {
      this.setState({
        errUserName: I18n.t("err_invalid_user_name")
      });
      return;
    }

    // if (!isValidPhoneNumer(username)) {
    //     this.setState({ errPhone: I18n.t("err_invalid_phone_number") });
    //     return;
    // }
    this.setState({ loading: true });
    this.disableLoginButton = true;
    const { signIn, getListMerchant, getPermission } = this.props;
    signIn(
      this.state.tenantCode.trim(),
      username,
      sha256(this.state.password),
      (err, userData) => {
        console.log("Err SignIn", err);
        console.log("Data SignIn", userData);
        setTimeout(() => {
          this.disableLoginButton = false;
        }, 500);
        if (userData && userData.accessToken) {
          getListMerchant((errMerchant, dataMerchant) => {
            console.log("List Merchant err", errMerchant);
            console.log("List Merchant data", dataMerchant);
            const merchantList = chainParse(dataMerchant, [
              "updated",
              "result"
            ]);
            if (!merchantList || !merchantList[0]) {
              this.setState({ loading: false, errPass: I18n.t("err_general") });
            } else {
              merchantId = merchantList[0].merchant.id;
              getPermission(
                merchantId,
                userData.userId,
                (errPermission, dataPermission) => {
                  console.log("getPermission err", errPermission);
                  console.log("getPermission data", dataPermission);
                  const statusCode = chainParse(dataPermission, [
                    "httpHeaders",
                    "status"
                  ]);
                  if (statusCode == 200) {
                    const permissionArr =
                      chainParse(dataPermission, ["updated", "result"]) || [];
                    const isMaster = permissionArr.find(
                      item =>
                        item.userId == userData.userId &&
                        item.permissionId == MASTER_ROLE
                    );
                    saveTenantCode(tenantCode);
                    saveUserName(username);
                    const routeName = isMaster ? "Home" : "Home";
                    const resetAction = StackActions.reset({
                      index: 0,
                      actions: [NavigationActions.navigate({ routeName })],
                      key: undefined
                    });
                    this.props.navigation.dispatch(resetAction);
                  } else {
                    this.setState({
                      loading: false,
                      errPass: I18n.t("err_general")
                    });
                  }
                }
              );
            }
          });
        } else if (userData && userData.code == 1008) {
          this.setState({ loading: false });
          this.popupNotRegister && this.popupNotRegister.open();
          return;
        } else if (userData && userData.code == 1002) {
          this.setState({
            loading: false,
            errPass: I18n.t("err_invalid_tenant_user_or_password")
          });
        } else if (userData && userData.code == 1007) {
          this.setState({ loading: false });
          this.popupBanned && this.popupBanned.open();
          return;
        } else if (userData && userData.code == 1004) {
          this.setState({
            loading: false,

            errPass: I18n.t("err_invalid_password")
          });
        } else if (userData && userData.code == 1006) {
          this.setState(
            {
              loading: false
            },
            () => {
              this.popupUserSuspend && this.popupUserSuspend.open();
            }
          );
        } else if (userData && userData.code && userData.msg) {
          this.setState({ loading: false, errPass: userData.msg });
        } else {
          this.setState({ loading: false, errPass: I18n.t("err_general") });
        }
      }
    );
  };

  _handlePressRegister = () => {
    if (shouldDisablePress("disableRegisterButton")) return;
    this.props.navigation.navigate("Register", {
      phone: this.state.phone,
      username: this.state.username
    });
  };

  _handlePressForgotPassword = () => {
    this.popupForgotPassword && this.popupForgotPassword.open();
  };

  _onAuthenticateFingerprintSuccess = () => {
    // alert('YOLO')
    this._handlePressLogin();
  };

  _handleCallHotline = () => {
    const hotline = I18n.t("hotline");
    const url = "tel: " + hotline;
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  _handleBack = () => {
    this.props.navigation.goBack();
  };
  _getProfileLogin() {
    AsyncStorage.getItem("tenantCode")
      .then(value => {
        if (value === null || value === "") {
          this.setState({
            tenantCode: ""
          });
        } else {
          this.setState({
            tenantCode: value,
            // hintTenantCode: ""
          });
        }
      })
      .done();
    AsyncStorage.getItem("userName")
      .then(value => {
        if (value === null || value === "") {
          this.setState({
            username: ""
          });
        } else {
          this.setState({
            username: value,
            // hintUserName: ""
          });
        }
      })
      .done();
  }
  componentDidMount() {
    this._getProfileLogin();
    console.log("Authenticate Props", this.props);
    BackHandler.addEventListener("hardwareBackPress", this._handleBack);
    const { message, navigation } = this.props;
    const isBanned = navigation.getParam("isBanned");
    const isExpired = navigation.getParam("isExpired");
    const isResetPassWord = navigation.getParam("isResetPassWord");
    if (message) {
      showToast(message);
    } else if (isBanned) {
      this.popupBanned && this.popupBanned.open();
    } else if (isExpired) {
      showToast(I18n.t("err_session_expire"));
    } else if (isResetPassWord) {
      showToast(I18n.t("err_reset_password"));
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._handleBack);
  }

  _renderLogo = () => {
    return (
      <Surface>
        <Surface
          style={{
            height: LOGO_CONTAINER_HEIGHT,
            paddingBottom: 20,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end"
          }}
        >
          <Image
            source={{ uri: "logo" }}
            style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }}
          />
        </Surface>
        <Surface rowEnd style={{ paddingRight: SHOP_PADDING_RIGHT }}>
          <ImageBackground
            source={{ uri: "shop" }}
            style={{ width: SHOP_WIDTH, height: SHOP_HEIGHT }}
          />
        </Surface>
      </Surface>
    );
  };

  _handlePressRegister = () => {
    if (shouldDisablePress("disableRegisterButton")) return;
    this.props.navigation.navigate("Register", {
      phone: this.state.phone,
      username: this.state.username
    });
  };
  _onChangeTextPhone = value => {
    // const temp = formatPhoneNumberWithoutAddZero(value)
    this.setState({
      username: value
    });
  };

  _handlePressDebug = () => {
    console.log("DEBUG");
    APIManager.getInstance().then(apiConfig => {
      this.setState({ env: apiConfig.name }, () => {
        this.popupDebug && this.popupDebug.open();
      });
    });
  };

  _handleOkDebug = () => {
    APIManager.save(this.state.env);
  };

  _handleChangeEnv = item => {
    console.log("_handleChangeEnv", item);
    this.setState({ env: item.id });
  };

  _renderDebug = () => {
    if (APP_MODE == APP_MODE_DEF.RELEASE) {
      return <View />;
    }
    return (
      <TouchableRipple
        onPress={this._handlePressDebug}
        style={{
          position: "absolute",
          top: 20,
          right: 5,
          borderRadius: 10,
          padding: 10,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 2000
        }}
      >
        <Text style={{ color: COLORS.WHITE }}>DEBUG</Text>
      </TouchableRipple>
    );
  };

  _onChangeTextTenantCode = text => {
    if (text.length >= MAX_LENGTH_TENANTCODE) {
      return;
    }
    if (text === "") {
      this.setState({
        tenantCode: text,
        errTenantCode: I18n.t("err_obligatory_user_name")
      });
      return;
    }
    if (!isValidTenantCode(text)) {
      this.setState({
        tenantCode: text,
        errTenantCode: I18n.t("err_invalid_tenant_code")
      });
      return;
    } else {
      this.setState({
        tenantCode: text,
        errTenantCode: ""
      });
    }
  };
  _onChangeTextUserName = text => {
    if (text.length >= MAX_LENGTH_TENANTCODE) {
      return;
    }
    // const username = this.state.username;
    if (text === "") {
      this.setState({
        username: text,
        errUserName: I18n.t("err_obligatory_user_name")
      });
      return;
    }
    if (!isValidUserName(text)) {
      this.setState({
        username: text,
        errUserName: I18n.t("err_invalid_user_name")
      });
      return;
    } else {
      this.setState({
        username: text,
        errUserName: ""
      });
      return;
    }
  };
  _onChangeTextPassword = text => {
    if (text === "") {
      this.setState({
        username: text,
        errPass: I18n.t("err_obligatory_password_second")
      });
      return;
    }
    if (!isValidPassWord(text)) {
      this.setState({
        password: text,
        errPass: I18n.t("err_invalid_password_second")
      });
      return;
    } else {
      this.setState({
        password: text,
        errPass: ""
      });
      return;
    }
  };
  render() {
    const enableLoginButton = !!(
      this.state.username &&
      this.state.username.trim() &&
      this.state.password &&
      this.state.tenantCode &&
      this.state.tenantCode.trim()
    );
    const forgotPasswordContent = replacePatternString(
      I18n.t("forgot_password_popup_content"),
      formatPhoneNumber(I18n.t("hotline"))
    );
    const userSuspendContent = replacePatternString(
      I18n.t("account_suspend_popup_content"),
      formatPhoneNumber(I18n.t("hotline"))
    );
    return (
      <ImageBackground
        source={{ uri: "background" }}
        style={{ flex: 1 }}
        resizeMode={"cover"}
      >
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent={true}
        />
        <LoadingModal visible={this.state.loading} />
        {/* <Toolbar transparent={true} /> */}
        <PopupConfirm
          animationType="none"
          content={forgotPasswordContent}
          titleT={"forgot_password"}
          textYesT={"call"}
          textNoT={'cancel'}
          onPressYes={this._handleCallHotline}
          ref={ref => (this.popupForgotPassword = ref)}
        />

        <PopupConfirm
          animationType="none"
          contentT={"phone_not_register_content"}
          titleT={"user_not_register"}
          textYesT={"register"}
          onPressYes={this._handlePressRegister}
          ref={ref => (this.popupNotRegister = ref)}
        />

        <PopupConfirm
          animationType="none"
          contentT={"merchant_banned_content"}
          titleT={"merchant_banned_title"}
          textYesT={"close"}
          onPressYes={() => {}}
          ref={ref => (this.popupBanned = ref)}
        />

        <PopupConfirm
          animationType="none"
          content={userSuspendContent}
          titleT={"account_suspend"}
          textYesT={"call"}
          textNoT={"cancel"}
          onPressYes={this._handleCallHotline}
          ref={ref => (this.popupUserSuspend = ref)}
        />

        <PopupConfirm
          animationType="none"
          titleT={"choose_env"}
          textYesT={"ok"}
          textNoT={"cancel"}
          onPressYes={this._handleOkDebug}
          ref={ref => (this.popupDebug = ref)}
        >
          <RadioGroup
            options={Object.values(API_ENDPOINT).map(item => ({
              id: item.name,
              title: item.name
            }))}
            value={this.state.env}
            onSelect={this._handleChangeEnv}
          />
        </PopupConfirm>
        {this._renderDebug()}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps={"handled"}
          enableOnAndroid={true}
        >
          {this._renderLogo()}
          <Surface
            themeable={false}
            flex
            style={{
              top: -INPUT_BLOCK_TOP,
              paddingHorizontal: HORIZONTAL_PADDING
            }}
          >
            <TextInput
              label={this.state.tenantCode}
              blue
              ref="tenantCode"
              onChangeText={text => this._onChangeTextTenantCode(text)}
              value={this.state.tenantCode}
              hasError={!!this.state.errTenantCode}
              errorText={this.state.errTenantCode}
              maxLength={MAX_LENGTH_TENANTCODE}
              width={INPUT_WIDTH}
            />
            <Surface space8 />
            <TextInput
              label={this.state.username}
              // keyboardType='number-pad'
              // onChangeText={text => this.setState({ phone: text })}
              onChangeText={text => this._onChangeTextUserName(text)}
              value={this.state.username}
              hasError={!!this.state.errPhone}
              errorText={this.state.errPhone}
              width={INPUT_WIDTH}
              maxLength={MAX_LENGTH_TENANTCODE}
            />
            <Surface space16 themeable={false} />
            <TextInput
              label={I18n.t("password")}
              onChangeText={text => this._onChangeTextPassword(text)}
              value={this.state.password}
              secureTextEntry={this.state.secure}
              hasError={!!this.state.errPass}
              errorText={this.state.errPass}
              width={INPUT_WIDTH}
              maxLength={PASSWORD_LENGTH}
            />

            <Surface space16 themeable={false} />
            <Button
              round
              full
              noPadding
              t={"login"}
              onPress={this._handlePressLogin}
              enable={!!enableLoginButton}
              gradientButton={true}
              textStyle={{ color: COLORS.BLUE }}
              buttonTextDisableStyle={{ color: "rgba(0, 0, 0, 1)" }}
            />
            <Surface space8 themeable={false} />
            <Surface rowCenter>
              <Ripple
                rippleColor={COLORS.WHITE}
                onPress={this._handlePressForgotPassword}
              >
                <Surface style={{ padding: 10 }}>
                  <Text darkBlue description t={"forgot_password"} />
                </Surface>
              </Ripple>
            </Surface>
            <Surface space16 themeable={false} />
            <Surface
              themeable={false}
              rowSpacebetween
              style={{ width: "100%" }}
            >
              <Text white description t={"dont_have_account"} />
              <Button
                flat
                noPadding
                t={"register"}
                textStyle={{ color: COLORS.DARK_BLUE }}
                onPress={this._handlePressRegister}
              />
            </Surface>
          </Surface>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}
export default connect(
  null,
  { signIn, getListMerchant, getPermission }
)(Login);
