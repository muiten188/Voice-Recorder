import React, { Component } from "react";
import {
  Surface,
  // Text,
  SilverButton as Button,
  Toolbar
  // OutlinedTextInput as TextInput
} from "~/src/themes/ThemeComponent";
import Icon from "react-native-vector-icons/EvilIcons";
import AsyncStorage from "@react-native-community/async-storage";

import { TextInput } from "~/src/themes/ThemeComponent";
import { connect } from "react-redux";
import I18n from "~/src/I18n";
import {
  toNormalCharacter,
  isValidPhoneNumer,
  replacePatternString,
  formatPhoneNumberWithoutAddZero,
  scaleHeight,
  scaleWidth,
  shouldDisablePress,
  chainParse,
  isValidEmail,
  isValidPassword,
  sha256,
  isValidUserName,
  formatPhoneNumber,
  isValidName,
  iseValidPassWord,
  isValidTenantCode,
  formatTenantCode
} from "~/src/utils";

import PopupConfirm from "~/src/components/PopupConfirm";
import { TEXT_INPUT_STYLES } from "~/src/themes/common";
import {
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  COLORS,
  SURFACE_STYLES
} from "~/src/themes/common";
import OTPInput from "~/src/components/OTPInput2";
import {
  StatusBar,
  ImageBackground,
  Image,
  SafeAreaView,
  BackHandler,
  View,
  Text,
  FlatList
} from "react-native";
import {
  OTP_COUNTDOWN_TIME,
  PASSWORD_LENGTH,
  GOOGLE_API_KEY,
  MIN_LENGTH,
  MAX_LENGTH_NAME,
  MAX_LENGTH_TENANTCODE,
  MAX_LENGTH_EMAIL
} from "~/src/constants";
import OTPCountdown from "~/src/components/OTPCountdown";
import {
  createOTPToken,
  verifyOTPToken,
  signUp,
  checkExistUser,
  checkExistTenant,
  genTenantCode
} from "~/src/store/actions/auth";
import LoadingModal from "~/src/components/LoadingModal";
import md5 from "md5";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackActions, NavigationActions } from "react-navigation";
import { TouchableRipple } from "react-native-paper";
import Linearicon from "~/src/components/Linearicon";
const LOGO_WIDTH = scaleHeight(108);
const LOGO_HEIGHT = scaleHeight(78.3);
const LOGO_CONTAINER_HEIGHT = scaleHeight(180);
const SHOP_WIDTH = scaleHeight(276.7);
const SHOP_HEIGHT = scaleHeight(300.7);
const SHOP_PADDING_RIGHT = scaleHeight(46);
const INPUT_BLOCK_TOP = scaleHeight(50);
const INPUT_BLOCK_TOP2 = scaleHeight(150);
const INPUT_BLOCK_TOP3 = scaleHeight(300);
const HORIZONTAL_PADDING = 56;
const INPUT_WIDTH = DEVICE_WIDTH - 2 * HORIZONTAL_PADDING;
import styles from "./styles";
import lodash from "lodash";
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

  _onCancelPhone = () => {};

  _handlePressContinueTenant = () => {
    // if (!this.state.name || !this.state.tenantName || !this.state.phone) {
    // if (!this.state.name) {
    //   this.setState({
    //     errName: I18n.t("err_obligatory_name")
    //   });
    // }
    // if (!this.state.tenantName) {
    //   this.setState({
    //     errTenantName: I18n.t("err_obligatory_tenant_name")
    //   });
    // }
    // if (!this.state.phone) {
    //   this.setState({
    //     errPhone: I18n.t("err_obligatory_phone_number")
    //   });
    // }
    // // if(!isValidEmail())
    // // }
    // if (this.state.email != "") {
    //   if (!isValidEmail(this.state.email)) {
    //     this.setState({ errEmail: I18n.t("err_invalid_email") });
    //   }
    // }

    // if (!isValidPhoneNumer(this.state.phone.replace(/\s/g, ""))) {
    //   this.setState({
    //     errPhone: I18n.t("err_invalid_phone_number")
    //   });
    // }

    // if (this.state.tenantCode.length > MAX_LENGTH_TENANTCODE) {
    //   this.setState({
    //     errTenantCode: I18n.t("err_tenant_code_maximum_32")
    //   });
    //   return;
    // }
    // if (!isValidTenantCode) {
    //   this.setState({
    //     errTenantCode: I18n.t("err_tenant_code_special_character")
    //   });
    //   return;
    // }
    this._handleBlurName()
    this._handleBlurTenantName()
    this._handleOnBlurEmail()
    this._handleOnBlurPhoneNumber()
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
          // this.popupConfirm && this.popupConfirm.open()
        }
      } else {
        this.setState({ loading: false, errPhone: I18n.t("err_general") });
      }
    });
  };

  _handleResendOTP = () => {
    this.setState({ otpKey: new Date().getTime() }, () => {
      if (this.state.loading) return;
      this.setState({ loading: true });
      this.props.createOTPToken(this.state.phone, (err, data) => {
        console.log("Data OTP", data);
        if (data == "true") {
          this.setState({ loading: false });
        } else if (data && data.code && data.msg) {
          this.setState({ errOTP: data.msg, loading: false });
        } else {
          this.setState({ errOTP: I18n.t("err_general"), loading: false });
        }
      });
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
      <Surface>
        <Surface
          style={{
            backgroundColor: COLORS.PRIMARY,
            height: LOGO_CONTAINER_HEIGHT,
            paddingBottom: 20,
            flexDirection: "row",
            alignItems: "center"
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
          {/* <Image
            source={{ uri: "logo" }}
            style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT }}
          /> */}
        </Surface>
        <View style={{ width: SHOP_WIDTH, height: SHOP_HEIGHT }} />
      </Surface>
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
    if (this.state.tenantName === "") {
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
    const enableContinuePhoneButton = !!(
      this.state.tenantName &&
      this.state.tenantName.trim() &&
      this.state.tenantCode &&
      this.state.tenantCode.trim()
    );

    return (
      <Surface
        key="steptenant"
        style={{ backgroundColor: COLORS.WHITE }}
        themeable={false}
        flex
      >
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
            {/* <View style={{ paddingVertical: 10 }}>
              <Text white description t={"hint_input_tenant_info"} />
            </View> */}

            <View style={{ width: "100%", alignItems: "center" }}>
              <Text style={styles.textTitle}>
                {I18n.t("header_name_step_tenant")}
              </Text>
            </View>
            <Surface style={{ height: 26 }} />

            <TextInput
              label={I18n.t("full_name")}
              blue
              onChangeText={text => this._handleOnChangeTextName(text)}
              value={this.state.name}
              hasError={!!this.state.errName}
              errorText={this.state.errName}
              maxLength={MAX_LENGTH_NAME}
              onBlur={this._handleBlurName}
              width={INPUT_WIDTH}
            />
            <Surface space8 />
            <TextInput
              label={I18n.t("tenant_name")}
              // blue
              onChangeText={text => this._handleOnChangeTextTenantName(text)}
              value={this.state.tenantName}
              hasError={!!this.state.errTenantName}
              errorText={this.state.errTenantName}
              maxLength={MAX_LENGTH_NAME}
              width={INPUT_WIDTH}
              onBlur={this._handleBlurTenantName}
            />
            <Surface space8 />
            <TextInput
              label={I18n.t("email")}
              onBlur={this._handleOnBlurEmail}
              onChangeText={text => this._handleOnChangeEmail(text)}
              value={this.state.email}
              hasError={!!this.state.errEmail}
              errorText={this.state.errEmail}
              width={INPUT_WIDTH}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={MAX_LENGTH_EMAIL}
            />

            <Surface space8 />
            <TextInput
              label={I18n.t("phone")}
              keyboardType="number-pad"
              onChangeText={text => this._handleOnChangeTextPhoneNumber(text)}
              value={formatPhoneNumberWithoutAddZero(this.state.phone)}
              onBlur={this._handleOnBlurPhoneNumber}
              hasError={!!this.state.errPhone}
              errorText={this.state.errPhone}
              width={INPUT_WIDTH}
              ref={ref => (this.phoneInput = ref)}
              maxLength={12}
            />

            {/* <TextInput
              label={this.state.lableTenantCode}
              blue
              editable={false}
              onChangeText={text => this.setState({ tenantCode: text })}
              value={this.state.tenantCode}
              hasError={!!this.state.errTenantCode}
              errorText={this.state.errTenantCode}
              maxLength={MAX_LENGTH_TENANTCODE}
              width={INPUT_WIDTH}
            />
            <Surface space16 themeable={false} /> */}
            <Surface themeable={false} rowCenter style={{ width: "100%" }}>
              <Text>
                <Text white info center t={"i_agree"} />
                <Text white info center bold t={"term"} />
              </Text>
            </Surface>
            <Surface space16 themeable={false} />
            <Button
              // enable={!!enableContinuePhoneButton}
              // gradientButton={true}
              style={{ borderRadius: 4 }}
              textStyle={{ color: COLORS.WHITE, fontWeight: "bold" }}
              round
              t={"continue"}
              full
              // buttonDisableStyle={{backgroundColor:"red"}}
              onPress={this._handlePressContinueTenant}
              buttonTextDisableStyle={{ color: "rgba(0, 0, 0, 1)" }}
            />
          </Surface>
        </KeyboardAwareScrollView>
      </Surface>
    );
  };

  _handlePressFinish = () => {
   
    this._handleOnBlurUserName()
    this._handleOnBlurPassword()
    this._handleOnBlurRePassword()
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
      // la: this.state.lat,
      // lo: this.state.long,
      // tenantAddress: this.state.tenantAddress
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

  _measureAddressInput = () => {
    setTimeout(() => {
      console.log("Address Input Ref", this.addressInputContainer);
      if (!!this.addressInputContainer) {
        this.addressInputContainer.measure(
          (x, y, width, height, pageX, pageY) => {
            console.log(
              "Measure addressInput",
              x,
              y,
              width,
              height,
              pageX,
              pageY
            );
            this.setState({
              autoCompletePosition: {
                x: pageX,
                y: pageY + 10,
                width
              }
            });
          }
        );
      }
    }, 200);
  };

  _queryPlaceAutoComplete = lodash.debounce(text => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${
      this.state.tenantAddress
    }&language=vi&key=${GOOGLE_API_KEY}`;
    console.log("PlaceAutoComplete URL", url);
    fetch(url)
      .then(response => response.json())
      .then(responseJSON => {
        if (responseJSON.status == "OK") {
          console.log("Response JSON", responseJSON);
          this.setState({
            autoCompleteData: responseJSON.predictions,
            showingAutoComplete: true
          });
        }
      });
  }, 300);

  _handleChangeAddress = text => {
    this.setState({ tenantAddress: text, errTenantAddress: "" }, () => {
      this._queryPlaceAutoComplete(this.state.tenantAddress);
    });
  };

  _queryPlaceByPlaceId = placeId => {
    console.log("Place Id", placeId);
    const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}`;
    console.log("Place Detail Url", url);
    fetch(url)
      .then(response => response.json())
      .then(responseJSON => {
        if (responseJSON.status == "OK") {
          console.log("Response JSON", responseJSON);
          const lat = chainParse(responseJSON, [
            "result",
            "geometry",
            "location",
            "lat"
          ]);
          const long = chainParse(responseJSON, [
            "result",
            "geometry",
            "location",
            "lng"
          ]);
          console.log("Lat Long", lat, long);
          this.setState({ lat, long });
        }
      });
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
  _handlePressAutoCompleteItem = item => {
    console.log("_handlePressAutoCompleteItem", item);
    this.setState(
      { showingAutoComplete: false, tenantAddress: item.description },
      () => {
        this._queryPlaceByPlaceId(item.place_id);
      }
    );
  };

  _renderAutoCompleteItem = ({ item }) => {
    return (
      <TouchableRipple onPress={() => this._handlePressAutoCompleteItem(item)}>
        <View style={styles.autoCompleteItem}>
          <Text style={styles.autoCompleteText}>{item.description}</Text>
        </View>
      </TouchableRipple>
    );
  };

  _renderStepInfo = () => {
    console.log(this.state.repassword);
    // this.state.email &&
    // this.state.email.trim()

    // console.log('this.state.autoCompletePosition', this.state.autoCompletePosition)

    return (
      <Surface
        key="stepinfo"
        style={{ backgroundColor: COLORS.WHITE }}
        themeable={false}
        flex
      >
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
            {/* <View style={{ paddingVertical: 10 }}>
            <Text white description t={"hint_input_user_info"} />
          </View>
          <Surface space8 /> */}
            <View style={{ width: "100%", alignItems: "center" }}>
              <Text style={styles.textTitle}>
                {I18n.t("header_name_step_info")}
              </Text>
            </View>
            <Surface style={{ height: 26 }} />
            <TextInput
              label={I18n.t("username")}
              // keyboardType='number-pad'
              onChangeText={text => this._handleOnChangeTextUserName(text)}
              onBlur={this._handleOnBlurUserName}
              value={this.state.username}
              hasError={!!this.state.errUserName}
              errorText={this.state.errUserName}
              width={INPUT_WIDTH}
              ref={ref => (this.nameInput = ref)}
              maxLength={MAX_LENGTH_TENANTCODE}
            />
            <Surface space8 />

            <Surface space8 />
            <TextInput
              width={INPUT_WIDTH}
              label={I18n.t("hint_input_password")}
              onChangeText={this._handleChangePassword}
              onBlur={this._handleOnBlurPassword}
              value={this.state.password}
              iconRight={
                this.state.showPassword ? "GB_eye_show" : "GB_eye_hide"
              }
              onPressIconRight={() =>
                this.setState({ showPassword: !this.state.showPassword })
              }
              secureTextEntry={!this.state.showPassword}
              hasError={!!this.state.errPassword}
              errorText={this.state.errPassword}
              maxLength={PASSWORD_LENGTH}
            />
            <Surface space8 />
            <Surface space8 />

            <TextInput
              width={INPUT_WIDTH}
              descriptionIcon={"GB_pass2"}
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
            <Surface space8 />

            <Button
              style={{ borderRadius: 4 }}
              textStyle={{ color: COLORS.WHITE, fontWeight: "bold" }}
              round
              t={"register"}
              full
              onPress={this._handlePressFinish}
            />
          </Surface>
          {this.state.showingAutoComplete &&
            this.state.autoCompleteData &&
            this.state.autoCompleteData.length > 0 && (
              <View
                style={{
                  ...styles.autoCompleteContainer,
                  position: "absolute",
                  top: this.state.autoCompletePosition.y,
                  left: this.state.autoCompletePosition.x,
                  width: this.state.autoCompletePosition.width,
                  zIndex: 100
                }}
              >
                <FlatList
                  extraData={this.state.autoCompleteData}
                  data={this.state.autoCompleteData}
                  renderItem={this._renderAutoCompleteItem}
                  keyExtractor={item => item.place_id}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
        </KeyboardAwareScrollView>
      </Surface>
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
        <SafeAreaView style={SURFACE_STYLES.flex}>
          <Surface themeable={false} flex>
            {/* <TouchableRipple
              onPress={this._handleBack}
              style={{ position: "absolute", top: 0, left: 0, zIndex: 1000 }}
            >
              <View
                style={[
                  SURFACE_STYLES.rowCenter,
                  { paddingHorizontal: 16, height: 54 }
                ]}
              >
                <Linearicon
                  name="chevron-left"
                  style={{ fontSize: 20, color: COLORS.WHITE }}
                />
              </View>
            </TouchableRipple> */}
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
        </SafeAreaView>
      </ImageBackground>
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
