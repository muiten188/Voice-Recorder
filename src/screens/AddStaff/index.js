import React, { PureComponent } from "react";
import { FlatList, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";
import commonStyle, { SURFACE_STYLES } from "~/src/themes/common";
import { COLORS } from "~/src/themes/common";
import { TouchableRipple } from "react-native-paper";
import I18n from "~/src/I18n";
import ToastUtils from '~/src/utils/ToastUtils'
import imgTicker from "~/src/image/round_checkbox.png";

import {
    MIN_LENGTH,
    MAX_LENGTH_NAME,
    MAX_LENGTH_TENANTCODE,
    ROLES
} from "~/src/constants";
import { replacePatternString, formatPhoneNumberWithoutAddZero } from "~/src/utils";
import {
    Text,
    TitleRowInput as TextInput,
    Toolbar,
    View,
    Container,
    Button
} from "~/src/themes/ThemeComponent";
import {
    merchantListSelector,
    merchantIdSelector
} from "~/src/store/selectors/merchant";
import Radio from "~/src/themes/Radio";
import {
    getStaffList,
    addStaff,
    updateStaff
} from "~/src/store/actions/merchant";
import LoadingModal from "~/src/components/LoadingModal";

import {
    chainParse,
    isValidPhoneNumer,
    isValidUserName,
    isValidName
} from "~/src/utils";
import styles from "./styles";
import {
    permissionDefSelector,
    permissionSelector,
    currentUserPermissionIdSelector
} from "~/src/store/selectors/permission";
import { getPermissionDef } from "~/src/store/actions/permission";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { userInfoSelector } from "~/src/store/selectors/auth";
import { getUserInfo } from "~/src/store/actions/auth";
import lodash from 'lodash'

class AddStaff extends PureComponent {

    constructor(props) {
        super(props);
        const { merchantList } = props;
        this.state = {
            username: "",
            name: "",
            phone: "",
            errUserName: "",
            errPhone: "",
            errName: "",
            userId: "",
            selected:
                merchantList && merchantList.length > 0 ? merchantList[0].id : -1,
            loading: false,
            permission: this._getPermissonStateFromProps(props.permission),
            enableTextInput: true,
            isMerchant: false,
            checkPermission: false
        };
    }

    _handPress = item => {
        if (item.id != this.state.selected) {
            this.setState({ selected: item.id });
        }
    };

    _renderItem = ({ item, index }) => {
        return (
            <TouchableRipple onPress={() => this._handPress(item)}>
                <View
                    style={[
                        SURFACE_STYLES.rowAlignStart,
                        SURFACE_STYLES.borderBottom,
                        { paddingVertical: 10 }
                    ]}
                >
                    <Radio checked={item.id == this.state.selected} />
                    <View style={SURFACE_STYLES.flex}>
                        <Text style={{ color: COLORS.TEXT_BLACK }}>{item.fullName}</Text>
                        <Text style={{ color: COLORS.TEXT_GRAY }}>{item.address}</Text>
                    </View>
                </View>
            </TouchableRipple>
        );
    };

    _load = () => {
        const { getPermissionDef } = this.props;
        getPermissionDef((err, data) => {
            console.log("getPermissionDef err", err);
            console.log("getPermissionDef data", data);
        });
    };

    componentDidMount() {
        this._load();
        const username = this.props.navigation.getParam("username", "");
        const name = this.props.navigation.getParam("name", "");
        const phone = this.props.navigation.getParam("phone", "");
        const userId = this.props.navigation.getParam("userId", "");

        if (username !== "") {
            this.setState({
                enableTextInput: false,
                name: name,
                username: username,
                phone: phone,
                userId: userId,
                checkPermission: true
            });
        }
    }

    _handleSave = () => {
        console.log("On Press Save", this.state);
        const name = this.state.name;
        const phoneNumber = this.state.phone.replace(/\s/g, "");
        const username = this.state.username;
        if (!isValidUserName(username)) {
            this.setState({
                errUserName: I18n.t("err_invalid_user_name")
            });
            return;
        }
        if (name === "") {
            this.setState({
                errName: I18n.t("err_invalid_name")
            });
            return;
        }
        const permissionKey = Object.keys(this.state.permission);
        let permissionList = [];
        for (let i = 0; i < permissionKey.length; i++) {
            if (this.state.permission[permissionKey[i]]) {
                permissionList.push(permissionKey[i]);
            }
        }
        const permissionIdList = permissionList.join(",");
        const { selectedMerchantId } = this.props;
        this.setState({ loading: true });
        if (this.state.enableTextInput) {
            this.props.addStaff(
                this.state.name.trim(),
                phoneNumber,
                username,
                permissionIdList,
                (err, data) => {
                    console.log("Add Staff Err", err);
                    console.log("Add Staff Data", data);
                    if (chainParse(data, ["updated", "result"])) {
                        ToastUtils.showSuccessToast(replacePatternString(I18n.t("add_staff_success"), `"${username}"`))
                        this.props.navigation.goBack();
                        this.props.getStaffList(selectedMerchantId);
                    } else if (data && data.code) {
                        this.setState({ loading: false, errUserName: data.msg });
                    } else {
                        this.setState({ loading: false });
                    }
                }
            );
        } else {
            this.props.updateStaff(
                this.state.name,
                phoneNumber,
                username,
                permissionIdList,
                (err, data) => {
                    console.log("Add Staff Err", err);
                    console.log("Add Staff Data", data);
                    if (chainParse(data, ["updated", "result"])) {
                        const { currentUserInfo, getUserInfo } = this.props;
                        const userId = this.props.navigation.getParam("userId", "");
                        if (userId == currentUserInfo.userId) {
                            getUserInfo();
                        }
                        this.props.navigation.navigate("StaffManager");
                        this.props.getStaffList(selectedMerchantId);
                    } else if (data && data.code) {
                        this.setState({ loading: false, errPhone: data.msg });
                    } else {
                        this.setState({ loading: false });
                    }
                }
            );
        }
    };
    _getPermissonStateFromProps = permissionProps => {
        const permissionState = {};
        for (let i = 0; i < permissionProps.length; i++) {
            permissionState[permissionProps[i].permissionId] = true;
        }
        this.setState({
            permissionState
        });
        return permissionState;
    };
    _handleChangePermission = item => {
        const staff = this.props.navigation.getParam("staff", {});
        if (this.state.permission[item.id]) {
            this.setState({
                checkPermission: false,

                permission: {
                    [item.id]: !this.state.permission[item.id]
                }
            });
        } else {
            this.setState({
                checkPermission: true,

                permission: {
                    [item.id]: !this.state.permission[item.id]
                }
            });
        }
    };

    _renderPermissionItem = ({ item, index }) => {
        const notTicker = (
            <View
                style={{
                    borderRadius: 8,
                    width: 16,
                    height: 16,
                    borderWidth: 1,
                    borderColor: COLORS.BORDER_COLOR
                }}
            />
        );
        const Ticker = (
            <Image source={imgTicker} style={{ width: 16, height: 16 }} />
        );
        const renderTicker = this.state.permission[item.id] ? Ticker : notTicker;
        return (
            <TouchableOpacity onPress={() => this._handleChangePermission(item)}>
                <View style={{ paddingLeft: 24 }} className="white">
                    <View className="pv16 white border-bottom  row-start">
                        {renderTicker}
                        <Text style={styles.permissionText}>{item.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    _onChooseContact = (phone, contact) => {
        console.log("_onChooseContact", phone, contact);

        let givenName = chainParse(contact, ["givenName"]);
        givenName = givenName ? givenName + " " : "";
        let middleName = chainParse(contact, ["middleName"]);
        middleName = middleName ? middleName + " " : "";
        let familyName = chainParse(contact, ["familyName"]) || "";
        familyName = familyName ? familyName + " " : "";
        const name = givenName + middleName + familyName;
    };

    _handleOnChangeTextUserName = text => {
            this.setState({
                username: text,
                errUserName: ""
            });
    };
    _handleOnBlurUserName=()=>{
        if (this.state.username === "") {
            this.setState({
                errUserName: I18n.t("err_obligatory_user_name")
            });
            return;
        } else if (!isValidUserName(this.state.username)) {
            this.setState({
                errUserName: I18n.t("err_invalid_user_name")
            });
            return;
        }
    }
    _handleOnChangeTextName = text => {
            this.setState({
                name: text,
                errName: ""
            });
    };
    _handleBlurName=()=>{
        if (this.state.name === "") {
            this.setState({
                errName: I18n.t("err_obligatory_name")
            });
            return;
        } 
    }
    _handleOnChangeTextPhoneNumber = text => {
     
            this.setState({
                phone: formatPhoneNumberWithoutAddZero(text.replace(/\s/g, "")),
                errPhone: ""
            });
    };
    _handleBLurPhoneNumber=()=>{
        if(this.state.phone===""){
            return;
        }
        if (!isValidPhoneNumer(this.state.phone.replace(/\s/g, ""))) {
            this.setState({
                errPhone: I18n.t("err_invalid_phone_number_staff")
            });
            return;
        }
    }

    _getPermissionDefByRole = lodash.memoize((currentUserPermissionId, permissionDef) => {
        let filterRole = {}
        if (currentUserPermissionId == ROLES.OWNER) {
            filterRole = {
                [ROLES.MANAGER]: 1,
                [ROLES.SALE]: 1,
            }
        } else if (currentUserPermissionId == ROLES.MANAGER) {
            filterRole = {
                [ROLES.SALE]: 1,
            }
        }
        return permissionDef.filter(item => !!filterRole[item.id])
    })

    _handlePressCancel = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { permissionDef, currentUserPermissionId } = this.props;
        const enableBtn = !!(
            this.state.username &&
            this.state.name &&
            this.state.name.trim() &&
            this.state.checkPermission &&
            !this.state.errPhone
        );
        const permissionDefByRole = this._getPermissionDefByRole(currentUserPermissionId, permissionDef)

        return (
            <Container>
                <Toolbar title={I18n.t("add_staff")}
                    rightText={I18n.t('cancel')}
                    onPressRight={this._handlePressCancel}
                />
                <View className='flex background'>
                    <LoadingModal visible={this.state.loading} />
                    <KeyboardAwareScrollView
                        bounces={false}
                        keyboardShouldPersistTaps={"handled"}
                    >
                        <View>
                            <View className="space10" />

                            <TextInput
                                title={I18n.t("full_name")}
                                onChangeText={ this._handleOnChangeTextName}
                                value={this.state.name}
                                hasError={!!this.state.errName}
                                errorText={this.state.errName}
                                maxLength={MAX_LENGTH_NAME}
                                onBlur={this._handleBlurName}
                            />
                            <View className="space8" />

                            <TextInput
                                navigation={this.props.navigation}
                                title={I18n.t("phone_number_require")}
                                onChangeText={ this._handleOnChangeTextPhoneNumber}
                                value={formatPhoneNumberWithoutAddZero(this.state.phone)}
                                hasError={!!this.state.errPhone}
                                errorText={this.state.errPhone}
                                maxLength={12}
                                keyboardType={"number-pad"}
                                onBlur={this._handleBLurPhoneNumber}
                            />
                            <View className="space8" />

                            <TextInput
                                title={I18n.t("user_name_require")}
                                onChangeText={ this._handleOnChangeTextUserName}
                                value={this.state.username}
                                hasError={this.state.errUserName}
                                errorText={this.state.errUserName}
                                maxLength={MAX_LENGTH_TENANTCODE}
                                onBlur={this._handleOnBlurUserName}
                            />
                            <View className="row-start" style={{ marginTop: 1 }}>
                                <View
                                    className="pv16 ph24 "
                                    style={{
                                        width: 118,
                                        backgroundColor: COLORS.WHITE,
                                        height: 89
                                    }}
                                >
                                    <Text style={{ fontSize: 12, color: COLORS.TEXT_BLACK }}>
                                        {I18n.t("password")}
                                    </Text>
                                </View>
                                <View
                                    className="pv16"
                                    style={{
                                        marginLeft: 1,
                                        flex: 1,
                                        backgroundColor: COLORS.WHITE,
                                        height: 89,
                                        paddingLeft: 16,
                                        paddingRight: 24
                                    }}
                                >
                                    <Text
                                        numberOfLines={3}
                                        style={{ fontSize: 13, color: COLORS.TEXT_GRAY }}
                                    >
                                        {I18n.t("password_default")}
                                        <Text style={{ fontSize: 13, color: COLORS.TEXT_BLACK }}>000000,</Text>
                                        {I18n.t("note_add_staff")}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View
                            className="pv12 ph24 white border-bottom"
                            style={{ marginTop: 10 }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    lineHeight: 14,
                                    color: COLORS.TEXT_BLACK
                                }}
                            >
                                {I18n.t("permission")}
                            </Text>
                        </View>
                        <FlatList
                            extraData={this.state.permission}
                            data={permissionDefByRole}
                            renderItem={this._renderPermissionItem}
                            keyExtractor={item => item.id + ""}
                        />
                        {/* </View> */}
                    </KeyboardAwareScrollView>
                    <View className='bottom'>
                        <Button
                            onPress={this._handleSave}
                            text={I18n.t('done')}
                            disabled={this.state.disableSave || !enableBtn}
                            style={SURFACE_STYLES.flex}
                        />
                    </View>
                </View>
            </Container>
        );
    }
}

export default connect(
    (state, props) => {
        const userId = props.navigation.getParam("userId", "");
        return {
            merchantList: merchantListSelector(state),
            selectedMerchantId: merchantIdSelector(state),
            permissionDef: permissionDefSelector(state),
            currentUserInfo: userInfoSelector(state),
            currentUserPermissionId: currentUserPermissionIdSelector(state),
            permissionDef: permissionDefSelector(state),
            permission: permissionSelector(state, userId)
        };
    },
    { getStaffList, addStaff, updateStaff, getPermissionDef, getUserInfo }
)(AddStaff);
