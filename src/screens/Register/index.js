import React, { Component } from "react";
import { SilverButton as Button } from "~/src/themes/ThemeComponent";
import AsyncStorage from "@react-native-community/async-storage";

import {
  TextInput,
  View,
  Text,
  Container
} from "~/src/themes/ThemeComponent";
import { connect } from "react-redux";
import I18n from "~/src/I18n";
import {
  toNormalCharacter,
  isValidPhoneNumer,
  formatPhoneNumberWithoutAddZero,
  shouldDisablePress,
  isValidEmail,
  isValidPassword,
  sha256,
  isValidUserName
} from "~/src/utils";

import PopupConfirm from "~/src/components/PopupConfirm";
import { COLORS } from "~/src/themes/common";
import { Image, BackHandler } from "react-native";
import {
  PASSWORD_LENGTH,
  MAX_LENGTH_NAME,
  MAX_LENGTH_TENANTCODE,
  MAX_LENGTH_EMAIL
} from "~/src/constants";
import {
  createOTPToken,
  verifyOTPToken,
  signUp,
  checkExistUser,
  checkExistTenant,
  genTenantCode
} from "~/src/store/actions/auth";
import LoadingModal from "~/src/components/LoadingModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackActions, NavigationActions } from "react-navigation";
import { TouchableRipple } from "react-native-paper";

import styles from "./styles";
import { saveTenantCode, saveUserName } from "~/src/utils/AsyncStoreUtils";
import imgBack from "~/src/image/imgBackWhite.png";
const STEP = {
  TENANT: "TENANT",
  INFO: "INFO"
};

const DEFAULT_INPUT_VALUE = {
  step: STEP.TENANT,
  lableTenantCode: I18n.t("tenant_code"),

  otp: "",
  name: "",
  password: "",
  repassword: "",
  phone: "",
  errPhone: "",
  errUserName: "",
  errOTP: "",
  errName: "",
  errPassword: "",
  errRepassword: "",
  showPassword: false,
  showRepassword: false,
  email: "",
  errEmail: "",
  tenantCode: "",
  errTenantCode: "",
  tenantName: "",
  errTenantName: "",
  tenantAddress: "",
  errTenantAddress: "",
  lat: "",
  long: ""
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: props.phone || "",
      username: props.username || "",
      ...DEFAULT_INPUT_VALUE,
      loading: false,
      otpKey: new Date().getTime(),
      autoCompletePosition: { width: 0, x: 0, y: 0 },
      showingAutoComplete: false,
      autoCompleteData: []
    };
    this.otpToken = "";
    this.didFocusListener = props.navigation.addListener(
      "didFocus",
      this.componentDidFocus
    );
  }

  _handleBack = () => {
    if (this.state.step == STEP.TENANT) {
      this.props.navigation.goBack();
    } else if (this.state.step == STEP.INFO) {
      this.setState({
        step: STEP.TENANT,
        otp: "",
        errOTP: "",
        errUserName: "",
        username: "",
        password: "",
        errPassword: "",
        repassword: "",
        errRepassword: ""
      });
    }
    return true;
  };

  _onConfirmPhone = () => {
    if (this.state.loading) return;
    this.setState({ loading: true });
    this.props.createOTPToken(this.state.phone, (err, data) => {
      console.log("Data OTP", data);
      if (data && data.result === true) {
        this.setState({ loading: false, step: STEP.OTP });
      } else if (data && data.code && data.msg) {
        this.setState({ errPhone: data.msg, loading: false });
      } else {
        this.setState({ errPhone: I18n.t("err_general"), loading: false });
      }
    });
  };

  _handlePressContinueTenant = () => {
    this._handleBlurName();
    this._handleBlurTenantName();
    this._handleOnBlurEmail();
    this._handleOnBlurPhoneNumber();
    if (
      this.state.errName ||
      this.state.errTenantName ||
      this.state.errTenantCode ||
      this.state.errPhone ||
      this.state.errEmail
    ) {
      return;
    }

    this.setState({ loading: true });
    this.props.checkExistTenant(this.state.tenantCode, (err, data) => {
      console.log(this.state.repassword);
      console.log("Err Exist Tenant", err);
      console.log("Data Exist Tenant", data);
      if (data && data.updated) {
        if (data.updated.result) {
          this.setState({
            loading: false,
            username: "",
            errUserName: "",
            password: "",
            errPassword: "",
            repassword: "",
            errRepassword: ""
          });

          this.popupAlreadyHaveAccount && this.popupAlreadyHaveAccount.open();
        } else {
          this.setState({ loading: false, step: STEP.INFO });
        }
      } else {
        this.setState({ loading: false, errPhone: I18n.t("err_general") });
      }
    });
  };

  _handleBlurName = () => {
    if (this.state.name === "") {
      this.setState({
        name: "",
        errName: I18n.t("err_obligatory_name")
      });
      return;
    }
    this.setState({ name: this.state.name.trim() });
  };

  _renderLogo = () => {
    return (
      <View style={{ backgroundColor: COLORS.PRIMARY }}>
        <View
          style={{
            height: 105,
            paddingTop: 10,
            paddingBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            }}
          >
            <Text
              style={{
                color: COLORS.TEXT_BLUE_WHITE,
                fontSize: 18,
                fontWeight: "bold",
                lineHeight: 24
              }}
            >
              {I18n.t("header_create_acount")}
            </Text>
            <TouchableRipple
              onPress={this._handleBack}
              style={{ left: "4.3%", position: "absolute" }}
            >
              <Image source={imgBack} style={{ width: 46, height: 46 }} />
            </TouchableRipple>
          </View>
        </View>
      </View>
    );
  };

  _handleOnChangeTextUserName = text => {
    this.setState({
      username: text,
      errUserName: ""
    });
  };
  _handleOnBlurUserName = () => {
    if (this.state.username === "") {
      this.setState({
        errUserName: I18n.t("err_obligatory_user_name")
      });
      return;
    }
    if (!isValidUserName(this.state.username)) {
      this.setState({
        errUserName: I18n.t("err_invalid_user_name")
      });
      return;
    }
  };
  _handleOnChangeTextTenantName = text => {
    this.setState({
      tenantName: text,
      errTenantName: ""
    });
  };
  _handleBlurTenantName = () => {
    if (this.state.tenantName === "" || this.state.tenantName.trim() == "") {
      this.setState({
        tenantName: "",
        tenantCode: "",
        errTenantName: I18n.t("err_obligatory_tenant_name")
      });
      return;
    }
    this.props.genTenantCode(
      toNormalCharacter(this.state.tenantName).replace(/[^A-Za-z0-9]/gi, ""),
      (err, data) => {
        console.log(data);
        if (data) {
          if (data.updated) {
            this.setState({
              tenantCode: data.updated.tenantCode
            });
          }
        }
      }
    );
  };

  _renderStepTenant = () => {
    return (
      <KeyboardAwareScrollView
        key="tenant"
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps={"handled"}
        enableOnAndroid={true}
      >
        {this._renderLogo()}

        <View className="white flex ph56">
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.textTitle}>
              {I18n.t("header_name_step_tenant")}
            </Text>
          </View>
          <View className="space26" />
          <TextInput
            label={I18n.t("full_name")}
            blue
            onFocus={() => this.setState({ errName: "" })}
            suggestText={I18n.t("suggest_name")}
            onChangeText={text => this._handleOnChangeTextName(text)}
            value={this.state.name}
            hasError={!!this.state.errName}
            errorText={this.state.errName}
            maxLength={MAX_LENGTH_NAME}
            onBlur={this._handleBlurName}
            // width={INPUT_WIDTH}
          />
          <View className="space16" />
          <TextInput
            label={I18n.t("tenant_name")}
            onFocus={() => this.setState({ errTenantName: "" })}
            suggestText={I18n.t("suggest_tenant_name")}
            onChangeText={text => this._handleOnChangeTextTenantName(text)}
            value={this.state.tenantName}
            hasError={!!this.state.errTenantName}
            errorText={this.state.errTenantName}
            maxLength={MAX_LENGTH_NAME}
            // width={INPUT_WIDTH}
            onBlur={this._handleBlurTenantName}
          />
          <View className="space16" />

          <TextInput
            label={I18n.t("email")}
            onFocus={() => this.setState({ errEmail: "" })}
            suggestText={I18n.t("suggest_email")}
            onBlur={this._handleOnBlurEmail}
            onChangeText={text => this._handleOnChangeEmail(text)}
            value={this.state.email}
            hasError={!!this.state.errEmail}
            errorText={this.state.errEmail}
            // width={INPUT_WIDTH}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={MAX_LENGTH_EMAIL}
          />
          <View className="space16" />

          <TextInput
            label={I18n.t("phone")}
            suggestText={I18n.t("suggest_phone")}
            onFocus={() => this.setState({ errPhone: "" })}
            keyboardType="number-pad"
            onChangeText={text => this._handleOnChangeTextPhoneNumber(text)}
            value={formatPhoneNumberWithoutAddZero(this.state.phone)}
            onBlur={this._handleOnBlurPhoneNumber}
            hasError={!!this.state.errPhone}
            errorText={this.state.errPhone}
            // width={INPUT_WIDTH}
            ref={ref => (this.phoneInput = ref)}
            maxLength={12}
          />

          <View className="space16" />
          <Button
            style={{ borderRadius: 4 }}
            textStyle={{ color: COLORS.WHITE, fontWeight: "bold" }}
            round
            t={"continue"}
            full
            onPress={this._handlePressContinueTenant}
            buttonTextDisableStyle={{ color: "rgba(0, 0, 0, 1)" }}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  };

  _handlePressFinish = () => {
    this._handleOnBlurUserName();
    this._handleOnBlurPassword();
    this._handleOnBlurRePassword();
    if (
      this.state.errUserName ||
      this.state.errPassword ||
      this.state.errRepassword
    ) {
      return;
    }

    if (this.state.loading) return;
    this.setState({ loading: true });
    this.disableFinishButton = true;
    const userObj = {
      name: this.state.name.trim(),
      password: sha256(this.state.password),
      userName: this.state.username.replace(/\s/g, ""),
      email: this.state.email,
      type: 1,
      phone: this.state.phone.replace(/\s/g, ""),
      tenantCode: this.state.tenantCode,
      tenantName: this.state.tenantName.trim()
    };
    this.props.signUp(userObj, (err, data) => {
      console.log("Err Register", err);
      console.log("Data Register", data);
      setTimeout(() => {
        this.disableFinishButton = false;
      }, 500);
      if (data && data.accessToken) {
        saveTenantCode(this.state.tenantCode);
        saveUserName(this.state.username);
        AsyncStorage.setItem("guide", "false", (err, data) => {
          this.setState({ loading: false });
          const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Home" })],
            key: undefined
          });
          this.props.navigation.dispatch(resetAction);
        });
      } else {
        this.setState({ loading: false, errRepassword: I18n.t("err_general") });
      }
    });
  };
  _handleOnChangeEmail = text => {
    if (text === " ") {
      this.setState({
        email: "",
        errEmail: ""
      });
      return;
    } else {
      this.setState({
        email: text,
        errEmail: ""
      });
    }
  };
  _handleOnBlurEmail = () => {
    if (this.state.email === "") {
      this.setState({
        email: "",
        errEmail: ""
      });
    } else if (!isValidEmail(this.state.email)) {
      this.setState({ errEmail: I18n.t("err_invalid_email") });
      return;
    }
  };

  _handleChangePassword = text => {
    this.setState({ password: text, errPassword: "" });
  };
  _handleOnBlurPassword = () => {
    if (this.state.password === "") {
      this.setState({
        errPassword: I18n.t("err_obligatory_password")
      });
      return;
    } else if (this.state.password.length < 6) {
      this.setState({
        errPassword: I18n.t("err_invalid_password_complexity")
      });
      return;
    } else if (!isValidPassword(this.state.password)) {
      this.setState({
        errPassword: I18n.t("err_invalid_password_complexity")
      });
      return;
    }
  };
  _handleOnChangeTextName = text => {
    this.setState({
      name: text,
      errName: ""
    });
  };
  _handleChangeRepassword = text => {
    this.setState({ repassword: text, errRepassword: "" });
    return;
  };
  _handleOnBlurRePassword = () => {
    if (this.state.repassword === "") {
      this.setState({
        errRepassword: I18n.t("err_obligatory_repassword")
      });
      return;
    } else if (
      !isValidPassword(this.state.repassword) ||
      this.state.repassword.length < 6
    ) {
      this.setState({
        errRepassword: I18n.t("err_invalid_password_complexity")
      });
      return;
    } else if (this.state.password != this.state.repassword) {
      this.setState({
        errRepassword: I18n.t("err_invalid_repassword")
      });
      return;
    }
  };

  _handleOnChangeTextPhoneNumber = text => {
    this.setState({
      phone: formatPhoneNumberWithoutAddZero(text.replace(/\s/g, "")),
      errPhone: ""
    });
  };
  _handleOnBlurPhoneNumber = () => {
    if (this.state.phone === "") {
      this.setState({
        errPhone: I18n.t("err_obligatory_phone_number")
      });
      return;
    }
    if (!isValidPhoneNumer(this.state.phone.replace(/\s/g, ""))) {
      this.setState({
        errPhone: I18n.t("err_invalid_phone_number")
      });
      return;
    }
  };

  _renderStepInfo = () => {
    console.log(this.state.repassword);

    return (
      <KeyboardAwareScrollView
      key="info"
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps={"handled"}
        enableOnAndroid={true}
      >
        {this._renderLogo()}

        <View className="flex ph56">
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.textTitle}>
              {I18n.t("header_name_step_info")}
            </Text>
          </View>
          <View className="space26" />
          <TextInput
            label={I18n.t("username")}
            onFocus={() => this.setState({ errUserName: "" })}
            suggestText={I18n.t("suggest_username")}
            onChangeText={text => this._handleOnChangeTextUserName(text)}
            onBlur={this._handleOnBlurUserName}
            value={this.state.username}
            hasError={!!this.state.errUserName}
            errorText={this.state.errUserName}
            // width={INPUT_WIDTH}
            ref={ref => (this.nameInput = ref)}
            maxLength={MAX_LENGTH_TENANTCODE}
          />

          <View className="space16" />
          <TextInput
            // width={INPUT_WIDTH}
            onFocus={() => this.setState({ errPassword: "" })}
            suggestText={I18n.t("suggest_password")}
            label={I18n.t("hint_input_password")}
            onChangeText={this._handleChangePassword}
            onBlur={this._handleOnBlurPassword}
            value={this.state.password}
            iconRight={this.state.showPassword ? "GB_eye_show" : "GB_eye_hide"}
            onPressIconRight={() =>
              this.setState({ showPassword: !this.state.showPassword })
            }
            secureTextEntry={!this.state.showPassword}
            hasError={!!this.state.errPassword}
            errorText={this.state.errPassword}
            maxLength={PASSWORD_LENGTH}
          />

          <View className="space16" />
          <TextInput
            // width={INPUT_WIDTH}
            descriptionIcon={"GB_pass2"}
            onFocus={() => this.setState({ errRepassword: "" })}
            suggestText={I18n.t("suggest_password")}
            label={I18n.t("hint_reinput_password")}
            onChangeText={this._handleChangeRepassword}
            onBlur={this._handleOnBlurRePassword}
            value={this.state.repassword}
            iconRight={
              this.state.showRepassword ? "GB_eye_show" : "GB_eye_hide"
            }
            onPressIconRight={() =>
              this.setState({ showRepassword: !this.state.showRepassword })
            }
            secureTextEntry={!this.state.showRepassword}
            hasError={!!this.state.errRepassword}
            errorText={this.state.errRepassword}
            maxLength={PASSWORD_LENGTH}
          />
          <View className="space32" />
          <Button
            style={{ borderRadius: 4 }}
            textStyle={{ color: COLORS.WHITE, fontWeight: "bold" }}
            round
            t={"register"}
            full
            onPress={this._handlePressFinish}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  };

  _handlePressLogin = () => {
    if (shouldDisablePress("disableGoToLogin")) return;
    this.props.navigation.navigate("Login");
  };

  componentDidFocus = () => {
    const phone = this.props.navigation.getParam("phone");
    if (phone) {
      this.phoneInput && this.phoneInput._animatePlaceholder();
      setTimeout(() => {
        this.setState({ phone });
      }, 20);
    }
  };

  componentDidMount() {
    console.log("Register DId Mount", this.props);
    BackHandler.addEventListener("hardwareBackPress", this._handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this._handleBack);
  }

  _render = () => {
    switch (this.state.step) {
      case STEP.TENANT:
      default:
        return this._renderStepTenant();
      case STEP.INFO:
        return this._renderStepInfo();
    }
  };

  render() {
    return (
      <Container blue>
        <View className="flex white">
          <PopupConfirm
            animationType="none"
            contentT={"already_have_account_please_login"}
            titleT={"register_account"}
            textYesT={"login"}
            onPressYes={this._handlePressLogin}
            ref={ref => (this.popupAlreadyHaveAccount = ref)}
          />
          <LoadingModal visible={this.state.loading} />

          {this._render()}
        </View>
      </Container>
    );
  }
}
export default connect(
  null,
  {
    createOTPToken,
    verifyOTPToken,
    signUp,
    checkExistUser,
    checkExistTenant,
    genTenantCode
  }
)(Register);
