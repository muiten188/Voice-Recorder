import React, { Component } from "react";
import {
  Surface,
  Text,
  SilverButton as Button,
  Toolbar,
  OutlinedTextInput as TextInput
} from "~/src/themes/ThemeComponent";
import { connect } from "react-redux";
import I18n from "~/src/I18n";
import {
  toNormalCharacter,
  isValidPhoneNumer,
  replacePatternString,
  formatPhoneNumberWithoutAddZero,
  scaleWidth,
  shouldDisablePress,
  isValidEmail,
  isValidPassword,
  sha256,
  isValidUserName,
  isValidName,
  isValidTenantCode
} from "~/src/utils";
import PopupConfirm from "~/src/components/PopupConfirm";
import { DEVICE_WIDTH, DEVICE_HEIGHT, COLORS } from "~/src/themes/common";
import OTPInput from "~/src/components/OTPInput2";
import {
  StatusBar,
  ImageBackground,
  Image,
  View,
  BackHandler
} from "react-native";
import {
  OTP_COUNTDOWN_TIME,
  PASSWORD_LENGTH,
  MIN_LENGTH,
  MAX_LENGTH_TENANTCODE,
  MAX_LENGTH_NAME,
  MAX_LENGTH_EMAIL
} from "~/src/constants";
import OTPCountdown from "~/src/components/OTPCountdown";
import {
  createOTPToken,
  verifyOTPToken,
  signUp,
  checkExistUser,
  checkExistTenant
} from "~/src/store/actions/auth";
import LoadingModal from "~/src/components/LoadingModal";
import md5 from "md5";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackActions, NavigationActions } from "react-navigation";
const LOGO_WIDTH = 108;
const LOGO_HEIGHT = 78.3;
const LOGO_CONTAINER_HEIGHT = 130;
const SHOP_WIDTH = 276.7;
const SHOP_HEIGHT = 300.7;
const SHOP_PADDING_RIGHT = 46;
const INPUT_BLOCK_TOP = 300;
const INPUT_BLOCK_TOP2 = 300;
const INPUT_BLOCK_TOP3 = 300;
const HORIZONTAL_PADDING = scaleWidth(70);
const INPUT_WIDTH = DEVICE_WIDTH - 2 * HORIZONTAL_PADDING;
import { saveTenantCode, saveUserName } from "~/src/utils/AsyncStoreUtils";

const STEP = {
  TENANT: "TENANT",
  INFO: "INFO"
};

const DEFAULT_INPUT_VALUE = {
  otp: "",
  lableTenantCode: I18n.t("tenant_code"),
  name: "",
  password: "",
  repassword: "",
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
      ...DEFAULT_INPUT_VALUE,
      step: STEP.PHONE,
      phone: props.phone || "",
      username: props.username || "",
      showPassword: false,
      showRepassword: false,
      loading: false,
      otpKey: new Date().getTime()
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
        errOTP: ""
      });
    }
    return true;
  };

  _onChangePhoneNumber = text => {
    this.setState({
      username: text,
      errUserName: ""
    });
    // this.setState({ phone: text, errPhone: "" }, () => {
    //   setTimeout(() => {
    //     if (!!this.state.errPhone && isValidPhoneNumer(text)) {
    //       this.setState({ phone: text.replace(/\D/g, ""), errPhone: "" });
    //     } else {
    //       this.setState({ phone: text.replace(/\D/g, "") });
    //     }
    //   }, 0);
    // });
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

  _onCancelPhone = () => {};

  _handlePressContinueTenant = () => {
    const isValidTenantCode = /^([0-9a-zA-Z])+$/.test(
      toNormalCharacter(this.state.tenantCode)
    );
    const isValidTenantName = /^([0-9a-zA-Z]|\s)+$/.test(
      toNormalCharacter(this.state.tenantName)
    );
    if (this.state.tenantCode.length < MIN_LENGTH) {
      this.setState({
        errTenantCode: I18n.t("err_tenant_code_minimum_6")
      });
      return;
    }

    if (this.state.tenantCode.length > MAX_LENGTH_TENANTCODE) {
      this.setState({
        errTenantCode: I18n.t("err_tenant_code_maximum_32")
      });
      return;
    }
    if (!isValidTenantCode) {
      this.setState({
        errTenantCode: I18n.t("err_tenant_code_special_character")
      });
      return;
    } else if (!isValidTenantName) {
      this.setState({
        errTenantName: I18n.t("err_tenant_name_special_character")
      });
      return;
    }

    this.setState({ loading: true });
    this.props.checkExistTenant(this.state.tenantCode, (err, data) => {
      console.log("Err Exist Tenant", err);
      console.log("Data Exist Tenant", data);
      if (data && data.updated) {
        if (data.updated.result) {
          this.setState({ loading: false });
          this.popupAlreadyHaveAccount && this.popupAlreadyHaveAccount.open();
        } else {
          this.setState({ loading: false, step: STEP.INFO });
          // this.popupConfirm && this.popupConfirm.open()
        }
      } else {
        this.setState({ loading: false, errPhone: I18n.t("err_general") });
      }
    });
  };

  // _handleResendOTP = () => {
  //     this.setState({ otpKey: new Date().getTime() }, () => {
  //         if (this.state.loading) return
  //         this.setState({ loading: true })
  //         this.props.createOTPToken(this.state.phone, (err, data) => {
  //             console.log('Data OTP', data)
  //             if (data == "true") {
  //                 this.setState({ loading: false })
  //             } else if (data && data.code && data.msg) {
  //                 this.setState({ errOTP: data.msg, loading: false })
  //             } else {
  //                 this.setState({ errOTP: I18n.t('err_general'), loading: false })
  //             }
  //         })
  //     })
  // }

  _handleBlurName = () => {
    this.setState({ name: this.state.name.trim() });
  };

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
  _handleOnChangeTextTenantName = text => {
    if(text.length>=MAX_LENGTH_NAME){
      return;
    }
    if (text === "") {
      this.setState({
        tenantName: "",
        errTenantName: I18n.t("err_obligatory_tenant_name")
      });
      return;
    } else if (!isValidName(text)) {
      this.setState({
        tenantName: text,
        errTenantName: I18n.t("err_invalid_tenant_name")
      });
    } else {
      this.setState({
        tenantName: text,
        errTenantName: "",
        lableTenantCode: "",
        tenantCode: toNormalCharacter(text).replace(/[^A-Z0-9]/ig, "")
      });
    }
  };
  _handleOnChangeTextName = text => {
    if(text.length>=MAX_LENGTH_NAME){
      return;
    }
    if (text === "") {
      this.setState({
        name: "",
        errName: I18n.t("err_obligatory_name")
      });
      return;
    } else if (!isValidName(text)) {
      this.setState({
        name: text,
        errName: I18n.t("err_invalid_name")
      });
      return;
    } else {
      this.setState({
        name: text,
        errName: ""
      });
    }
  };
  _handleOnChangeEmail = text => {
    if (text === "" || text === " ") {
      this.setState({
        email: "",
        errEmail: ""
        // errEmail:I18n.t("err_obligatory_email")
      });
      return;
    } else if (!isValidEmail(this.state.email)) {
      this.setState({ email: text, errEmail: I18n.t("err_invalid_email") });
      return;
    } else {
      this.setState({
        email: text,
        errEmail: ""
      });
    }
  };
  _handleOnChangeTextUserName = text => {
    if(text.length>=MAX_LENGTH_TENANTCODE){
      return;
    }
    if (text === "") {
      this.setState({
        username: "",
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
  _handleOnChangeTextPhoneNumber = text => {
    if (text === "") {
      this.setState({
        phone: formatPhoneNumberWithoutAddZero(text),
        errPhone: I18n.t("err_obligatory_phone_number")
      });
      return;
    }
    if (!isValidPhoneNumer(text.replace(/\s/g, ""))) {
      this.setState({
        phone: formatPhoneNumberWithoutAddZero(text.replace(/\s/g, "")),
        errPhone: I18n.t("err_invalid_phone_number")
      });
      return;
    } else {
      this.setState({
        phone: formatPhoneNumberWithoutAddZero(text.replace(/\s/g, "")),
        errPhone: ""
      });
      return;
    }
  };

  _renderStepTenant = () => {
    const enableContinuePhoneButton = !!(
      this.state.tenantName &&
      this.state.tenantName.trim() &&
      this.state.tenantCode &&
      this.state.tenantCode.trim()
    );

    return (
      <Surface themeable={false} flex>
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
              top: -INPUT_BLOCK_TOP3,
              paddingHorizontal: HORIZONTAL_PADDING
            }}
          >
            <View style={{ paddingVertical: 10 }}>
              <Text white description t={"hint_input_tenant_info"} />
            </View>
            <Surface space8 />
            <TextInput
              label={I18n.t("tenant_name")}
              blue
              onChangeText={text => this._handleOnChangeTextTenantName(text)}
              value={this.state.tenantName}
              hasError={!!this.state.errTenantName}
              errorText={this.state.errTenantName}
              maxLength={80}
              width={INPUT_WIDTH}
            />
            <Surface space8 />
            <TextInput
              label={this.state.lableTenantCode}
              blue
              editable={false}
              onChangeText={text => this._handleOnChangeTextTenantCode(text)}
              value={this.state.tenantCode}
              hasError={!!this.state.errTenantCode}
              errorText={this.state.errTenantCode}
              maxLength={50}
              width={INPUT_WIDTH}
            />

            <Surface space16 themeable={false} />
            <Surface themeable={false} rowCenter style={{ width: "100%" }}>
              <Text>
                <Text white info center t={"i_agree"} />
                <Text white info center bold t={"term"} />
              </Text>
            </Surface>
            <Surface space16 themeable={false} />
            <Button
              enable={!!enableContinuePhoneButton}
              gradientButton={true}
              textStyle={{ color: COLORS.BLUE }}
              round
              t={"register"}
              full
              onPress={this._handlePressContinueTenant}
              buttonTextDisableStyle={{ color: "rgba(0, 0, 0, 1)" }}
            />
          </Surface>
        </KeyboardAwareScrollView>
      </Surface>
    );
  };

  _renderStepInfo = () => {
    const enableButtonFinish = !!(
      this.state.name &&
      this.state.name.trim() &&
      this.state.username &&
      this.state.username.trim() &&
        this.state.phone &&
        this.state.phone.trim() &&
      this.state.password &&
      this.state.password.trim() &&
      this.state.repassword &&
      this.state.repassword.trim() 
      // this.state.email &&
      // this.state.email.trim()
    );

    // console.log('this.state.autoCompletePosition', this.state.autoCompletePosition)

    return (
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
            top: -INPUT_BLOCK_TOP3,
            paddingHorizontal: HORIZONTAL_PADDING
          }}
        >
          <View style={{ paddingVertical: 10 }}>
            <Text white description t={"hint_input_user_info"} />
          </View>
          <Surface space8 />
          <TextInput
            label={I18n.t("full_name")}
            blue
            // onChangeText={text => this.setState({ name: text, errName: "" })}
            onChangeText={text => this._handleOnChangeTextName(text)}
            value={this.state.name}
            hasError={!!this.state.errName}
            errorText={this.state.errName}
            maxLength={50}
            onBlur={this._handleBlurName}
            width={INPUT_WIDTH}
          />
          <Surface space8 />
          <TextInput
            label={I18n.t("username")}
            // keyboardType="number-pad"
            onChangeText={text => this._handleOnChangeTextUserName(text)}
            value={this.state.username}
            hasError={!!this.state.errUserName}
            errorText={this.state.errUserName}
            width={INPUT_WIDTH}
            ref={ref => (this.phoneInput = ref)}
          />
          <Surface space8 />
          <TextInput
            label={I18n.t("phone")}
            // keyboardType='number-pad'
            onChangeText={text => this._handleOnChangeTextPhoneNumber(text)}
            value={this.state.phone}
            hasError={!!this.state.errPhone}
            errorText={this.state.errPhone}
            width={INPUT_WIDTH}
            ref={ref => (this.phoneInput = ref)}
            maxLength={12}

          />
          <Surface space8 />

          <TextInput
            label={I18n.t("email")}
            blue
            // onChangeText={text => this.setState({ email: text, errEmail: "" })}
            onChangeText={text => this._handleOnChangeEmail(text)}
            value={this.state.email}
            hasError={!!this.state.errEmail}
            errorText={this.state.errEmail}
            maxLength={50}
            width={INPUT_WIDTH}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={MAX_LENGTH_EMAIL}
          />
          <Surface space8 />
          <TextInput
            width={INPUT_WIDTH}
            label={I18n.t("hint_input_password")}
            onChangeText={this._handleChangePassword}
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
          <Surface space8 />
          <TextInput
            width={INPUT_WIDTH}
            descriptionIcon={"GB_pass2"}
            label={I18n.t("hint_reinput_password")}
            blue
            onChangeText={this._handleChangeRepassword}
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
          <Surface space8 />

          <Button
            enable={!!enableButtonFinish}
            gradientButton={true}
            round
            t={"finish"}
            full
            onPress={this._handlePressFinish}
            textStyle={{ color: COLORS.BLUE }}
            buttonTextDisableStyle={{ color: "rgba(0, 0, 0, 1)" }}
          />
        </Surface>
      </KeyboardAwareScrollView>
    );
  };

  // _handlePressContinueOTP = () => {
  //     if (shouldDisablePress('disableContinueOTP')) return
  //     if (this.state.loading) return false
  //     this.setState({ loading: true })
  //     this.props.verifyOTPToken(this.state.otp, (err, data) => {
  //         console.log('Err Verify Token', err)
  //         console.log('Data OTP Token', data)
  //         if (data && data.otpToken) {
  //             this.otpToken = data.otpToken
  //         }
  //         if (data.status == 0) {
  //             this.setState({ loading: false, step: STEP.PASSWORD })
  //             return
  //         } else if (data.status == 1) {
  //             this.setState({ loading: false, errOTP: I18n.t('err_invalid_otp') })
  //             return
  //         } else if (data.status == 2) {
  //             this.setState({ loading: false, errOTP: I18n.t('err_otp_expire') })
  //             return
  //         }
  //         this.setState({ loading: false })
  //     })

  // }

  // _renderStepOTP = () => {
  //     const enableButtonContinueOTP = !!(this.state.otp && this.state.otp.length >= 4)
  //     return (
  //         <Surface themeable={false} flex>
  //             <KeyboardAwareScrollView
  //                 showsVerticalScrollIndicator={false}
  //                 bounces={false}
  //                 keyboardShouldPersistTaps={'handled'}
  //                 enableOnAndroid={true}
  //             >
  //                 {this._renderLogo()}
  //                 <Surface themeable={false} flex style={{ top: -INPUT_BLOCK_TOP, paddingHorizontal: HORIZONTAL_PADDING }}>
  //                     <Surface rowCenter>
  //                         <Text white description center><Text description t={'hint_input_opt'} /> {formatPhoneNumberWithoutAddZero(this.state.phone)}</Text>
  //                     </Surface>
  //                     <OTPInput
  //                         autofocusShow={true}
  //                         numberDigit={4}
  //                         onChange={text => this.setState({ otp: text, errOTP: '' })}
  //                         onAutoFill={() => { }}
  //                         hasError={!!this.state.errOTP}
  //                         errorText={this.state.errOTP}
  //                     />
  //                     <Surface space16 themeable={false} />
  //                     <Button
  //                         enable={!!enableButtonContinueOTP}
  //                         gradientButton={true}
  //                         round
  //                         t={'continue'}
  //                         full
  //                         onPress={this._handlePressContinueOTP}
  //                         textStyle={{ color: COLORS.DARK_BLUE }}
  //                     />
  //                     <Surface space8 themeable={false} />
  //                     <Surface themeable={false} fullWidth rowCenter>
  //                         <OTPCountdown time={OTP_COUNTDOWN_TIME} onResend={this._handleResendOTP} key={this.state.otpKey} />
  //                     </Surface>
  //                 </Surface>
  //             </KeyboardAwareScrollView>
  //         </Surface>
  //     )
  // }

  // _handlePressFinishPassword = () => {
  //     if (this.disableFinishButton) return
  //     if (this.state.password != this.state.repassword) {
  //         this.setState({ errRepassword: I18n.t('err_invalid_repassword') })
  //         return
  //     }
  //     if (!(/^([a-zA-Z]|\s)+$/.test(toNormalCharacter(this.state.name)))) {
  //         this.setState({ errName: I18n.t('err_format_username') })
  //         return
  //     }
  //     if (this.state.loading) return
  //     this.setState({ loading: true })
  //     this.disableFinishButton = true
  //     this.props.signUp(this.state.name, md5(this.state.password), this.otpToken, (err, data) => {
  //         console.log('Err Register', err)
  //         console.log('Data Register', data)
  //         setTimeout(() => {
  //             this.disableFinishButton = false
  //         }, 500)
  //         if (data && data.accessToken) {
  //             this.setState({ loading: false })
  //             const resetAction = StackActions.reset({
  //                 index: 0,
  //                 actions: [NavigationActions.navigate({ routeName: 'Home' })],
  //             });
  //             this.props.navigation.dispatch(resetAction)
  //         } else {
  //             this.setState({ loading: false, errRepassword: I18n.t('err_general') })
  //         }
  //     })
  // }

  _handlePressFinish = () => {
    if (
      this.state.errName ||
      this.state.errUserName ||
      this.state.errEmail ||
      this.state.errPassword ||
      this.state.errRepassword||
      this.state.errPhone
    ) {
      return;
    }
    // if (this.disableFinishButton) return;

    // if (!isValidName(this.state.name)) {
    //   this.setState({
    //     errName: I18n.t("err_invalid_name_length")
    //   });
    // }

    // if (!isValidUserName(this.state.username)) {
    //   this.setState({ errUserName: I18n.t("err_invalid_user_name") });
    // } else if (!isValidEmail(this.state.email)) {
    //   this.setState({ errEmail: I18n.t("err_invalid_email") });
    //   return;
    // }

    if (this.state.loading) return;
    this.setState({ loading: true });
    this.disableFinishButton = true;
    const userObj = {
      name: this.state.name,
      password: sha256(this.state.password),
      userName: this.state.username.replace(/\s/g, ""),
      email: this.state.email,
      type: 1,
      tenantCode: this.state.tenantCode,
      tenantName: this.state.tenantName
    };
    this.props.signUp(userObj, (err, data) => {
      saveTenantCode(this.state.tenantCode);
      saveUserName(this.state.username);
      console.log("Err Register", err);
      console.log("Data Register", data);
      setTimeout(() => {
        this.disableFinishButton = false;
      }, 500);
      if (data && data.accessToken) {
        this.setState({ loading: false });
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "Home" })],
          key: undefined
        });
        this.props.navigation.dispatch(resetAction);
      } else {
        this.setState({ loading: false, errRepassword: I18n.t("err_general") });
      }
    });
  };

  _handleChangePassword = text => {
    if (text === "") {
      this.setState({
        password: text,
        errPassword: I18n.t("err_obligatory_password")
      });
      return;
    } else if (!isValidPassword(this.state.password)) {
      this.setState({
        password: text,
        errPassword: I18n.t("err_invalid_password_complexity")
      });
      return;
    } else {
      this.setState({ password: text, errRepassword: "", errPassword: "" });
      return;
    }
  };

  _handleChangeRepassword = text => {
    if (text === "") {
      this.setState({
        repassword: text,
        errRepassword: I18n.t("err_obligatory_repassword")
      });
      return;
    } else if (text.length < 6) {
      this.setState({
        password: text,
        errPassword: I18n.t("err_invalid_password_complexity")
      });
      return;
    } else if (this.state.password != text) {
      this.setState({
        repassword: text,
        errRepassword: I18n.t("err_invalid_repassword")
      });
      return;
    } else {
      this.setState({ repassword: text, errRepassword: "", errPassword: "" });
      return;
    }
  };

  // _renderStepPassword = () => {
  //     const { placeholderTextColor, color, ...restStyle } = TEXT_INPUT_STYLES.white
  //     const enableButtonFinish = !!(this.state.password && this.state.repassword
  //         && this.state.password.length == PASSWORD_LENGTH && this.state.repassword.length == PASSWORD_LENGTH)

  //     return (
  //         <KeyboardAwareScrollView
  //             showsVerticalScrollIndicator={false}
  //             bounces={false}
  //             keyboardShouldPersistTaps={'handled'}
  //             enableOnAndroid={true}
  //         >
  //             {this._renderLogo()}
  //             <Surface themeable={false} flex style={{ top: -INPUT_BLOCK_TOP2, paddingHorizontal: HORIZONTAL_PADDING }}>
  //                 <Text white center description t={'hint_create_password'} />
  //                 <Surface space8 />

  //                 <TextInput
  //                     label={I18n.t('full_name')}
  //                     blue
  //                     onChangeText={text => this.setState({ name: text, errName: '' })}
  //                     value={this.state.name}
  //                     hasError={!!this.state.errName}
  //                     errorText={this.state.errName}
  //                     maxLength={50}
  //                     onBlur={this._handleBlurName}
  //                     width={INPUT_WIDTH}
  //                 />
  //                 <Surface space8 />
  //                 <TextInput
  //                     width={INPUT_WIDTH}
  //                     label={I18n.t('hint_input_password')}
  //                     keyboardType='number-pad'
  //                     onChangeText={this._handleChangePassword}
  //                     value={this.state.password}
  //                     iconRight={this.state.showPassword ? 'GB_eye_show' : 'GB_eye_hide'}
  //                     onPressIconRight={() => this.setState({ showPassword: !this.state.showPassword })}
  //                     secureTextEntry={!this.state.showPassword}
  //                     maxLength={PASSWORD_LENGTH}
  //                 />
  //                 <Surface space8 />
  //                 <TextInput
  //                     width={INPUT_WIDTH}
  //                     descriptionIcon={'GB_pass2'}
  //                     label={I18n.t('hint_reinput_password')}
  //                     blue
  //                     keyboardType='number-pad'
  //                     onChangeText={this._handleChangeRepassword}
  //                     value={this.state.repassword}
  //                     iconRight={this.state.showRepassword ? 'GB_eye_show' : 'GB_eye_hide'}
  //                     onPressIconRight={() => this.setState({ showRepassword: !this.state.showRepassword })}
  //                     secureTextEntry={!this.state.showRepassword}
  //                     hasError={!!this.state.errRepassword}
  //                     errorText={this.state.errRepassword}
  //                     maxLength={PASSWORD_LENGTH}
  //                 />
  //                 <Surface space16 themeable={false} />
  //                 <Button
  //                     enable={!!enableButtonFinish}
  //                     gradientButton={true}
  //                     round
  //                     t={'finish'}
  //                     full onPress={this._handlePressFinishPassword}
  //                     textStyle={{ color: COLORS.BLUE }}
  //                 />

  //             </Surface>
  //         </KeyboardAwareScrollView>
  //     )
  // }

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
    const popupConfirmSendOTPContent = replacePatternString(
      I18n.t("confirm_send_otp"),
      formatPhoneNumberWithoutAddZero(this.state.phone)
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
        <Surface themeable={false} flex>
          <PopupConfirm
            animationType="none"
            content={popupConfirmSendOTPContent}
            titleT={"register_account"}
            textNoT={"cancel"}
            textYesT={"agree"}
            onPressYes={this._onConfirmPhone}
            ref={ref => (this.popupConfirm = ref)}
          />
          <PopupConfirm
            animationType="none"
            contentT={"already_have_account_please_login"}
            titleT={"register_account"}
            textYesT={"login"}
            onPressYes={this._handlePressLogin}
            ref={ref => (this.popupAlreadyHaveAccount = ref)}
          />
          <LoadingModal visible={this.state.loading} />

          {/* <Toolbar transparent={true} /> */}
          {this._render()}
        </Surface>
      </ImageBackground>
    );
  }
}
export default connect(
  null,
  { createOTPToken, verifyOTPToken, signUp, checkExistUser, checkExistTenant }
)(Register);
