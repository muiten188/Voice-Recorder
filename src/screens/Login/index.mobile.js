import React, { Component } from "react";
import {
  Surface,
  SilverButton as Button,
  // Toolbar,
  // Text,
  // OutlinedTextInput as TextInput,
  RadioGroup
} from "~/src/themes/ThemeComponent";

import {
  View,
  Text,
  TextInput2 as TextInput
} from "~/src/themesnew/ThemeComponent";
// import imgHomeIcon from "~/src/image/tabbottom/imgHomeIcon.png";
import imgHomeIcon from "~/src/image/imgHomeLogin.png";
import imgAvataIcon from "~/src/image/imgAvataIcon.png";
import imgPassWordIcon from "~/src/image/imgPassWordIcon.png";
import imgLogoApp from "~/src/image/imgLogoApp.png";
import imgCall from "~/src/image/imgCall.png";
import { DefaultTheme, TouchableRipple } from "react-native-paper";
import {
  ImageBackground,
  StatusBar,
  Platform,
  Linking,
  BackHandler,
  Image,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { connect } from "react-redux";
import I18n from "~/src/I18n";
import {
  DEFAULT_PUSH_ANIMATION,
  DEFAULT_POP_ANIMATION,
  DEVICE_WIDTH,
  DEVICE_HEIGHT
} from "~/src/themes/common";
import { COLORS } from "~/src/themesnew/common";
import styles from "./styles";
import {
  PASSWORD_LENGTH,
  MASTER_ROLE,
  ADMIN_TAB,
  NON_ADMIN_TAB,
  MIN_LENGTH,
  MAX_LENGTH_TENANTCODE,
  MAX_LENGTH_NAME,
  ROLES
} from "~/src/constants";
import PopupConfirm from "~/src/components/PopupConfirm2";
import {
  scaleWidth,
  scaleHeight,
  replacePatternString,
  formatPhoneNumber,
  formatPhoneNumberWithoutAddZero,
  isValidPhoneNumer,
  showToast,
  shouldDisablePress,
  chainParse,
  sha256,
  isValidUserName,
  isValidMail,
  isValidTenantCode,
  isValidPassWord
} from "~/src/utils";
import LoadingModal from "~/src/components/LoadingModal";
import md5 from "md5";
import { signIn } from "~/src/store/actions/auth";
import { getListMerchant } from "~/src/store/actions/merchant";
import { getPermission } from "~/src/store/actions/permission";
import { StackActions, NavigationActions } from "react-navigation";
import Ripple from "react-native-material-ripple";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DeviceInfo from "react-native-device-info";
const VERSION = DeviceInfo.getVersion();
const LOGO_WIDTH = 88;
const LOGO_HEIGHT = 94;
const LOGO_CONTAINER_HEIGHT = 334;
const SHOP_WIDTH = scaleHeight(276.7);
const SHOP_HEIGHT = scaleHeight(300.7);
const SHOP_PADDING_RIGHT = scaleHeight(46);
const INPUT_BLOCK_TOP = scaleHeight(150);
const HORIZONTAL_PADDING = 32;
const INPUT_WIDTH = DEVICE_WIDTH - 2 * HORIZONTAL_PADDING;
import APIManager from "~/src/store/api/APIManager";
import {
  APP_MODE,
  APP_MODE_DEF,
  API_ENDPOINT,
  SECRET_KEY
} from "~/src/store/api/constants";
import { saveTenantCode, saveUserName } from "~/src/utils/AsyncStoreUtils";

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
      userName: props.username || "",
      password: "",
      secure: true,
      showFingerprint: false,
      loading: false,
      errPass: "",
      errUserName: "",
      tenantCode: "",
      errTenantCode: "",
      env: "",
      hintUserName: I18n.t("username"),
      hintTenantCode: I18n.t("tenant_code"),
      focusTenantCode: false,
      focusUserName: false,
      showPopup: false
    };
  }

  _handlePressLogin = () => {
    if (this.disableLoginButton) return;
    // const phoneNumber = this.state.phone.replace(/\s/g, "");
    const username = this.state.userName.replace(/\s/g, "");
    const tenantCode = this.state.tenantCode;
    let flag=0
    if (!isValidTenantCode(tenantCode)) {
      this.setState({
        errTenantCode: I18n.t("err_invalid_tenant_code")
      });
      flag=1
      // return
    }
    if (!isValidUserName(username)) {
      this.setState({
        errUserName: I18n.t("err_invalid_user_name")
      });
      flag=1

    }
    if (!isValidPassWord(this.state.password)) {
      this.setState({
        errPass: I18n.t("err_invalid_password_second")
      });
      flag=1
    }
    if (
      !this.state.userName ||
      !this.state.tenantCode ||
      !this.state.password
    ) {
      if (!this.state.userName) {
        this.setState({
          errUserName: I18n.t("err_obligatory_user_name")
        });
      }
      if (!this.state.tenantCode) {
        this.setState({
          errTenantCode: I18n.t("err_obligatory_tenant_code")
        });
      }
      if (!this.state.password) {
        this.setState({
          errPass: I18n.t("err_obligatory_password_second")
        });
      }
      flag=1

    }
    if(flag===1){
      return;
    }
    

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
              const merchantId = merchantList[0].merchant.id;
              getPermission(
                merchantId,
                userData.userId,
                (permissionErr, permissionData) => {
                  console.log("getPermission err", permissionErr);
                  console.log("getPermission data", permissionData);
                  const permission = chainParse(permissionData, [
                    "updated",
                    "result"
                  ]);
                  if (!permission || permission.length == 0) {
                    this.setState({
                      loading: false,
                      errPass: I18n.t("err_general")
                    });
                  } else {
                    this.setState({ loading: false });

                    const permissionId = permission[0].permissionId;
                    const routeName =
                      permissionId == ROLES.SALE ? "HomeEmployee" : "Home";
                    saveTenantCode(tenantCode);
                    saveUserName(username);
                    const resetAction = StackActions.reset({
                      index: 0,
                      actions: [NavigationActions.navigate({ routeName })],
                      key: undefined
                    });
                    this.props.navigation.dispatch(resetAction);
                  }
                }
              );
            }
          });
        } else if (userData && userData.code == 1008) {
          this.setState({
            loading: false,
            errPass: I18n.t("err_invalid_tenant_user_or_password")
          });
          // this.popupNotRegister && this.popupNotRegister.open();
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
            errPass: I18n.t("err_invalid_tenant_user_or_password")
          });
        } else if (userData && userData.code == 1006) {
          this.setState({
            loading: false,
            errPass: I18n.t("account_suspend")
          });
        } else if (userData && userData.code && userData.msg) {
          this.setState({ loading: false, errPass: I18n.t("err_general") });
        } else {
          // this.setState({ loading: false, errPass: I18n.t("err_general") });
        }
      }
    );
  };

  _handlePressRegister = () => {
    if (shouldDisablePress("disableRegisterButton")) return;
    this.props.navigation.navigate("Register", {
      phone: this.state.phone
    });
  };

  _handlePressForgotPassword = () => {
    // this.userName.current.focus()
    this.setState({
      showPopup: true
    });
    this.popupForgotPassword && this.popupForgotPassword.open();
  };

  _onAuthenticateFingerprintSuccess = () => {
    // alert('YOLO')
    this._handlePressLogin();
  };

  _handleCallHotline = () => {
    this.setState({
      showPopup: false
    });
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
  _getProfileLogin = async () => {
    await AsyncStorage.getItem("tenantCode")
      .then(value => {
        if (value === null || value === "") {
          this.setState({
            focusTenantCode: false,

            tenantCode: ""
          });
        } else {
          // this.refs.tenantCode.props.onFocus()
          // this.textInput.onFocus();
          this.setState({
            tenantCode: value,
            focusTenantCode: true
            // hintTenantCode: ""
          });
        }
      })
      .done();
    await AsyncStorage.getItem("userName")
      .then(value => {
        if (value === null || value === "") {
          this.setState({
            userName: "",
            focusUserName: false
          });
        } else {
          this.setState({
            userName: value,
            focusUserName: true
            // hintUserName: ""
          });
        }
      })
      .done();
  };
  forgotPasswordBoss = replacePatternString(
    I18n.t("forgot_password_boss_popup"),
    formatPhoneNumber(I18n.t("hotline"))
  );

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
      <Surface style={{ backgroundColor: COLORS.FEATURE_BACKGROUND }}>
        <Surface
          style={{
            height: LOGO_CONTAINER_HEIGHT,
            // paddingBottom: 20,
            backgroundColor: COLORS.PRIMARY,
            alignItems: "center",
            // borderRadius:6
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6
            // alignItems: "flex-end"
          }}
        >
          <Image
            source={imgLogoApp}
            style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT, marginTop: 53 }}
          />
          <Text style={styles.textHeader}>{I18n.t("login_lower")}</Text>
        </Surface>
      </Surface>
    );
  };
  _renderPopup = () => {
    if (this.state.showPopup) {
      return (
        <View style={styles.viewPopupContainer}>
          <View style={styles.viewPopup}>
            <View style={{ width: "100%", alignItems: "center" }}>
              <Text style={styles.txtTitlePopup}>
                {I18n.t("forgot_password").toUpperCase()}
              </Text>
            </View>

            <View style={styles.lineHorizontal} />
            <View style={styles.viewBoss}>
              <Text style={styles.txtDetail}>
                <Text style={{ color: COLORS.PRIMARY, fontWeight: "bold" }}>
                  {I18n.t("if_boss")}
                </Text>
                {this.forgotPasswordBoss}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this._handleCallHotline}
              >
                <View style={styles.btnHotline}>
                  <Image style={styles.imgCall} source={imgCall} />
                  <Text style={styles.labelCall}>{I18n.t("call")} </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.viewStaff}>
              <Text style={styles.txtDetail}>
                <Text style={{ color: COLORS.PRIMARY, fontWeight: "bold" }}>
                  {I18n.t("if_staff")}
                </Text>
                {I18n.t("forgot_password_staff_popup")}
              </Text>
            </View>
            <View
              style={{ marginTop: 32, width: "100%", alignItems: "center" }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.setState({ showPopup: false })}
              >
                <View style={styles.btnUnderStand}>
                  <Text style={styles.labelUnderstand}>
                    {I18n.t("understand")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    return <View />;
  };
  _handlePressRegister = () => {
    this.props.navigation.navigate("Register");
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
    if(this.state.errPass== I18n.t("err_general")){
      this.setState({
        tenantCode: text,
        errTenantCode: "",
        errPass:""
      });
    }else{
      this.setState({
        tenantCode: text,
        errTenantCode: "",
      });
    }
    
  };
  _onChangeTextUserName = text => {
    if(this.state.errPass==I18n.t("err_general")){
      this.setState({
        userName: text,
        errUserName: "",
        errPass:""
      });
    }else{
      this.setState({
        userName: text,
        errUserName: "",
      });
    }
  };
  _onChangeTextPassword = text => {
    this.setState({
      password: text,
      errPass: ""
    });
  };
  onFocus = () => {};
  _handleOnBlurTenantCode = () => {
    if (this.state.tenantCode === "") {
      this.setState({
        errTenantCode: I18n.t("err_obligatory_tenant_code")
      });
      return;
    }
    if (!isValidTenantCode(this.state.tenantCode)) {
      this.setState({
        errTenantCode: I18n.t("err_invalid_tenant_code")
      });
      return;
    }
  };
  _handleOnBlurUserName = () => {
    if (this.state.userName === "") {
      this.setState({
        errUserName: I18n.t("err_obligatory_user_name")
      });
      return;
    }
    if (!isValidUserName(this.state.userName)) {
      this.setState({
        errUserName: I18n.t("err_invalid_user_name")
      });
      return;
    }
  };
  _handleOnBlurPassword = () => {
    if (this.state.password === "") {
      this.setState({
        errPass: I18n.t("err_obligatory_password_second")
      });
      return;
    }
    if (!isValidPassWord(this.state.password)) {
      this.setState({
        errPass: I18n.t("err_invalid_password_complexity")
      });
      return;
    }
  };
  render() {
    const userSuspendContent = replacePatternString(
      I18n.t("account_suspend_popup_content"),
      formatPhoneNumber(I18n.t("hotline"))
    );

    return (
      <Surface style={{ backgroundColor: COLORS.FEATURE_BACKGROUND, flex: 1 }}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent={true}
        />

        <LoadingModal visible={this.state.loading} />

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
              // top: -INPUT_BLOCK_TOP,
              backgroundColor: COLORS.WHITE,
              paddingHorizontal: HORIZONTAL_PADDING,
              marginHorizontal: 24,
              borderRadius: 6,
              top: -151
            }}
          >
            <View style={{ height: 32 }} />
            <TextInput
              label={this.state.hintTenantCode}
              sourceIconLeft={imgHomeIcon}
              onBlur={this._handleOnBlurTenantCode}
              onChangeText={text => this._onChangeTextTenantCode(text)}
              value={this.state.tenantCode}
              hasError={!!this.state.errTenantCode}
              errorText={this.state.errTenantCode}
              maxLength={MAX_LENGTH_TENANTCODE}
              width={INPUT_WIDTH}
            />
            <Surface space16 themeable={false} />

            <TextInput
              sourceIconLeft={imgAvataIcon}
              label={this.state.hintUserName}
              onChangeText={text => this._onChangeTextUserName(text)}
              value={this.state.userName}
              hasError={!!this.state.errUserName}
              errorText={this.state.errUserName}
              width={INPUT_WIDTH}
              maxLength={MAX_LENGTH_TENANTCODE}
              onBlur={this._handleOnBlurUserName}
            />
            <Surface space16 themeable={false} />
            <TextInput
              sourceIconLeft={imgPassWordIcon}
              label={I18n.t("password")}
              onChangeText={text => this._onChangeTextPassword(text)}
              value={this.state.password}
              secureTextEntry={this.state.secure}
              hasError={!!this.state.errPass}
              errorText={this.state.errPass}
              width={INPUT_WIDTH}
              onBlur={this._handleOnBlurPassword}
              maxLength={PASSWORD_LENGTH}
            />
            <View style={{ height: 32 }} />
            {/* <Surface space16 themeable={false} /> */}
            <Button
              round
              full
              noPadding
              t={"login"}
              style={{ borderRadius: 6 }}
              onPress={this._handlePressLogin}
              textStyle={{ color: COLORS.WHITE, fontWeight: "bold" }}
              buttonTextDisableStyle={{ color: "rgba(0, 0, 0, 1)" }}
            />
            <Surface space8 themeable={false} />
            <Surface rowCenter>
              <Ripple
                rippleColor={COLORS.WHITE}
                onPress={this._handlePressForgotPassword}
              >
                <Surface style={{ padding: 10 }}>
                  <Text style={{ color: COLORS.BLACK }}>
                    {I18n.t("forgot_password")}
                  </Text>
                </Surface>
              </Ripple>
            </Surface>
            <Surface space16 themeable={false} />
          </Surface>
          <View style={styles.viewRegister}>
            {(Platform.OS == 'android') && <View style={{width: '100%', flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{ color: COLORS.BLACK }}>
              {I18n.t("dont_have_account")}
            </Text>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderRadius: 6,
                marginTop: 12,
                backgroundColor: COLORS.BACKGROUND3,
                paddingVertical: 12,
                width: "100%"
              }}
              onPress={this._handlePressRegister}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 16,
                  fontWeight: "bold",
                  color: COLORS.PRIMARY
                }}
              >
                {I18n.t("register_free")}
              </Text>
            </TouchableOpacity>
            </View>}
            
            <Text
              style={{ marginTop: 8, marginBottom: 8 }}
              className="gray center"
            >
              {I18n.t("version")} {VERSION}
            </Text>
          </View>
        </KeyboardAwareScrollView>
        {this._renderPopup()}
      </Surface>
    );
  }
}
export default connect(
  null,
  { signIn, getListMerchant, getPermission }
)(Login);
