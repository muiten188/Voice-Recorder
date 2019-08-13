import React, { PureComponent } from "react";
import {
    FlatList,
    Image,
    Linking,
    TouchableOpacity,
    Platform,
    Clipboard
} from "react-native";
import ToastUtils from "~/src/utils/ToastUtils";
import {
    MAX_LENGTH_NAME,
    ROLES
} from "~/src/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { connect } from "react-redux";
import { COLORS, SURFACE_STYLES } from "~/src/themesnew/common";
import I18n from "~/src/I18n";
import { merchantIdSelector } from "~/src/store/selectors/merchant";
import {
    getPermissionDef,
    addPermission,
    getPermission,
    removePermission
} from "~/src/store/actions/permission";
import {
    removeStaff,
    getStaffList,
    updateStaff
} from "~/src/store/actions/merchant";
import { resetPassword } from "~/src/store/actions/auth";
import { userInfoSelector } from "~/src/store/selectors/auth";
import {
    TitleRowInput,
    View,
    Container,
    Toolbar,
    PopupConfirm,
    Button,
    Text
} from "~/src/themesnew/ThemeComponent";
import {
    permissionDefSelector,
    permissionSelector,
    currentUserPermissionIdSelector
} from "~/src/store/selectors/permission";
import styles from "./styles";
import {
    isValidPhoneNumer,
    chainParse,
    formatPhoneNumberWithoutAddZero,
    formatPhoneNumber,
    replacePatternString
} from "~/src/utils";
import LoadingModal from "~/src/components/LoadingModal";
import imgMess from "~/src/image/mess.png";
import imgCall from "~/src/image/call.png";
import imgTicker from "~/src/image/round_checkbox.png";
import lodash from 'lodash'

class StaffInfo extends PureComponent {
    constructor(props) {
        super(props);
        console.log("Props permission", props.permission);
        const staff = this.props.navigation.getParam("staff");
        this.state = {
            isEnable: false,
            permission: this._getPermissonStateFromProps(props.permission),
            showContext: false,
            loading: false,
            permissionState: 0,
            isMerchant: false,
            userName: "",
            phone: "",
            errPhone: "",
            name: "",
            errName: "",
            permissionState: false,
            popupDeleteStaffContent: "",
            popupResetStaffContent: "",
            password_default: "000000"
        };
        this.deletingStaff = "";
    }

    _load = () => {
        const {
            merchantId,
            getPermissionDef,
            getPermission,
            permission
        } = this.props;
        const { userInfo } = this.props;
        const userId = userInfo.userId;
        const staff = this.props.navigation.getParam("staff");
        if (staff && staff.userId) {
            this.setState({
                userName: staff.userName,
                phone: staff.phone,
                userId: staff.userId,
                name: staff.name
            });
            if (userId === staff.userId) {
                this.setState({
                    isMerchant: true
                });
            }
        }

        console.log("Staff", staff);
        getPermissionDef((err, data) => {
            console.log("getPermissionDef err", err);
            console.log("getPermissionDef data", data);
        });

        getPermission(merchantId, staff.userId, (err, data) => {
            console.log("getPermission err", err);
            console.log("getPermission data", data);
        });
    };

    _handleSave = lodash.throttle(() => {
        console.log("On Press Save", this.state.permission);
        const phoneNumber = this.state.phone.replace(/\s/g, "");
        const username = this.state.userName;
        const permissionKey = Object.keys(this.state.permission);
        let permissionList = [];
        for (let i = 0; i < permissionKey.length; i++) {
            if (this.state.permission[permissionKey[i]]) {
                permissionList.push(permissionKey[i]);
            }
        }
        const permissionIdList = permissionList.join(",");
        this.setState({ loading: true })
        this.props.updateStaff(
            this.state.name.trim(),
            phoneNumber,
            username,
            permissionIdList,
            (err, data) => {
                console.log("Add Staff Err", err);
                console.log("Add Staff Data", data);
                if (chainParse(data, ["updated", "result"])) {
                    ToastUtils.showSuccessToast(
                        replacePatternString(
                            I18n.t("update_staff_success"),
                            `"${username}"`
                        )
                    );
                    this.props.navigation.navigate("StaffManager");
                    this.props.getStaffList(this.props.merchantId);
                } else if (data && data.code) {
                    this.setState({ loading: false, errPhone: data.msg });
                } else {
                    this.setState({ loading: false });
                }
            }
        );
    }, 500);

    _handlePressDelete = () => {
        const warnMessage = replacePatternString(
            I18n.t("warn_delete_staff"),
            `"${this.state.userName}"`
            // `"${"000000"}"`
        );

        this.setState(
            {
                popupDeleteStaffContent: warnMessage,
                showContext: false
            },
            () => {
                this.popupConfirmDelete && this.popupConfirmDelete.open();
            }
        );

        // }
    };

    _handlePressResetPassword = () => {
        const warnMessage = replacePatternString(
            I18n.t("warning_reset_password_staff"),
            `"${this.state.userName}"`
        );
        const warnMessage2 = replacePatternString(
            I18n.t("warning_reset_password_staff_end"),
            `"${this.state.password_default}"`
        );
        this.setState(
            {
                showContext: false,
                popupResetStaffContent: warnMessage + warnMessage2
            },
            () => {
                console.log("_handlePressResetPassword");
                this.popupConfirmReset && this.popupConfirmReset.open();
            }
        );
    };

    _resetPassword = () => {
        this.setState({ loading: true });
        const { resetPassword } = this.props;
        const staff = this.props.navigation.getParam("staff");
        resetPassword(staff.userId, (err, data) => {
            console.log("resetPassword err", err);
            console.log("resetPassword data", data);
            this.setState({ loading: false });
            if (data && data.updated && data.updated.result === true) {
                this.props.navigation.goBack();
                this.props.navigation.navigate("Toast", {
                    text: I18n.t("reset_password_success")
                });
            } else if (data && data.code) {
                this.props.navigation.navigate("Toast", {
                    text: I18n.t(data.msg)
                });
            }
        });
    };

    _deleteStaff = () => {
        this.setState({ loading: true });
        const { removeStaff, getStaffList, merchantId } = this.props;
        const staff = this.props.navigation.getParam("staff");
        removeStaff(staff.userId, (err, data) => {
            console.log("removeStaff err", err);
            console.log("removeStaff data", data);
            const statusCode = chainParse(data, ["httpHeaders", "status"]);
            this.setState({ loading: false });
            if (statusCode == 200) {
                ToastUtils.showSuccessToast(
                    replacePatternString(
                        I18n.t("delete_staff_success"),
                        `"${staff.userName}"`
                    )
                );
                this.props.navigation.goBack();
                getStaffList(merchantId);
            } else if (data && data.code) {
                ToastUtils.showErrorToast(data.msg)
            }
        });
    };

    componentDidMount() {
        this._load();
    }

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

    componentDidUpdate(prevProps) {
        if (prevProps.permission != this.props.permission) {
            this.setState({
                permission: this._getPermissonStateFromProps(this.props.permission)
            });
        }
    }

    _handleChangePermission = item => {
        const { currentUserPermissionId } = this.props;
        const canChangeRole = this._canChangeRole()
        if (!canChangeRole) return
        if(this.state.isMerchant)return
        const staff = this.props.navigation.getParam("staff");
        if (this.state.permission[item.id]) {
            this.setState({
                checkPermission: false,

                permission: {
                    // ...this.state.permission,
                    [item.id]: !this.state.permission[item.id]
                }
            });
        } else {
            this.setState({
                checkPermission: true,

                permission: {
                    // ...this.state.permission,
                    [item.id]: !this.state.permission[item.id]
                }
            });
        }
    };

    _renderPermissionItem = ({ item, index }) => {
        const { currentUserPermissionId } = this.props;
        const canChangeRole = this._canChangeRole(currentUserPermissionId, this.state.permission)

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
        const renderTicker = !canChangeRole ? <View /> : (this.state.permission[item.id] ? Ticker : notTicker);
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

    _handleOnChangeTextName = text => {
        this.setState({
            checkPermission: true
        });
        if (text === "") {
            this.setState({
                name: "",
                errName: I18n.t("err_obligatory_name")
            });
            return;
        } else {
            this.setState({
                name: text,
                errName: ""
            });
            return;
        }
    };

    _handleOnChangeTextPhone = text => {
        this.setState({
            checkPermission: true
        });
      
            this.setState({
                phone: text,
                errPhone: ""
            });
    };
    _handleOnBlurPhone=()=>{
        if (!isValidPhoneNumer(this.state.phone.replace(/\s/g, ""))) {
            this.setState({
                // phone: formatPhoneNumberWithoutAddZero(text.replace(/\s/g, "")),
                errPhone: I18n.t("err_invalid_phone_number_staff")
            });
            return;
        }
    }
    _handleOnPressCall = () => {
        const hotline = this.state.phone;
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

    _handleOnPressMess = () => {
        const hotline = this.state.phone;
        const url =
            Platform.OS === "android"
                ? "sms:" + hotline + "?body=yourMessage"
                : "sms:" + hotline;

        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    console.log("Unsupported url: " + url);
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch(err => console.error("An error occurred", err));
    };
    _handleOnPressCopyNumber = async () => {
        await Clipboard.setString(this.state.phone);
    };

    _canChangeRole = () => {
        const { currentUserPermissionId } = this.props;

        if (currentUserPermissionId == ROLES.OWNER) {
            return true
        } else {
            return false
        }
    }

    _canEditInfo = () => {
        const staff = this.props.navigation.getParam("staff");
        const { currentUserPermissionId, userInfo } = this.props;
        if (currentUserPermissionId == ROLES.OWNER) {
            return true
        } else if (currentUserPermissionId == ROLES.MANAGER) {
            if (this.state.permission[ROLES.SALE] || staff.userId == userInfo.userId) {
                return true
            }
            return false
        }
        return false
    }

    _canDelete = () => {
        const { currentUserPermissionId } = this.props;
        if (this.state.permission[ROLES.OWNER]) {
            return false
        } else if (this.state.permission[ROLES.MANAGER]) {
            if (currentUserPermissionId == ROLES.OWNER) {
                return true
            } else {
                return false
            }
        } else {
            if (currentUserPermissionId == ROLES.OWNER || currentUserPermissionId == ROLES.MANAGER) {
                return true
            }
            return false
        }

    }

    _getPermissionDefByRole = () => {
        const { currentUserPermissionId, permission, permissionDef } = this.props
        if (!permission || !permission[0]) return []
        const currentStaffPermissionId = permission[0].permissionId

        let filterRole = {}
        if (currentUserPermissionId == ROLES.OWNER) {
            if (currentStaffPermissionId == ROLES.OWNER) {
                filterRole = {
                    [ROLES.OWNER]: 1,
                    [ROLES.MANAGER]: 1,
                    [ROLES.SALE]: 1,
                }
            } else {
                filterRole = {
                    [ROLES.MANAGER]: 1,
                    [ROLES.SALE]: 1,
                }
            }
        } else if (currentUserPermissionId == ROLES.MANAGER) {
            if (currentStaffPermissionId == ROLES.OWNER) {
                filterRole = {
                    [ROLES.OWNER]: 1,
                }
            } else if (currentStaffPermissionId == ROLES.MANAGER) {
                filterRole = {
                    [ROLES.MANAGER]: 1,
                }
            } else if (currentStaffPermissionId == ROLES.SALE) {
                filterRole = {
                    [ROLES.SALE]: 1,
                }
            }
        }
        return permissionDef.filter(item => !!filterRole[item.id])
    }


    render() {
        const enableButton = !!(
            this.state.name &&
            !this.state.errPhone &&
            // this.state.phone &&
            this.state.userName &&
            this.state.checkPermission
        );
        const staff = this.props.navigation.getParam("staff");
        const permissionDefByRole = this._getPermissionDefByRole()
        const canEditInfo = this._canEditInfo()
        console.log('canEditInfo', canEditInfo)

        const showReset = (
            <TouchableOpacity
                style={{ position: "absolute", right: 0 }}
                onPress={this._handlePressResetPassword}
            >
                <View style={styles.btnReset}>
                    <Text style={styles.txtOption}>{I18n.t("reset_password")}</Text>
                </View>
            </TouchableOpacity>
        );
        const hide = <View />;

        const Reset = this.state.isMerchant || !canEditInfo ? hide : showReset;
        const rightText = !this.state.isMerchant && canEditInfo ? I18n.t("delete") : "";
        return (
            <Container
                style={[SURFACE_STYLES.flex, { backgroundColor: COLORS.WHITE }]}
            >
                <Toolbar
                    title={I18n.t("staff_info")}
                    rightText={rightText}
                    onPressRight={this._handlePressDelete}
                />
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={"handled"}
                    enableOnAndroid={true}
                >
                    <LoadingModal visible={this.state.loading} />
                    <PopupConfirm
                        ref={ref => (this.popupConfirmDelete = ref)}
                        content={this.state.popupDeleteStaffContent}
                        onPressYes={this._deleteStaff}
                        onPressNo={() => { }}
                    />

                    <PopupConfirm
                        ref={ref => (this.popupConfirmReset = ref)}
                        content={this.state.popupResetStaffContent}
                        onPressYes={this._resetPassword}
                        onPressNo={() => { }}
                    />

                    <View
                        style={[
                            SURFACE_STYLES.flex,
                            { backgroundColor: COLORS.FEATURE_BACKGROUND }
                        ]}
                    >
                        <View
                            className="pv16"
                            style={{
                                paddingLeft: 24,
                                paddingRight: 16,
                                flexDirection: "row"
                            }}
                        >
                            <View className="flex">
                                <Text style={styles.headerText}>{I18n.t("account")}</Text>
                                <Text style={styles.txtUserName}>{staff.userName}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.btnMess}
                                onPress={this._handleOnPressMess}
                            >
                                <Image source={imgMess} style={{ width: 24, height: 24 }} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btnCall}
                                onPress={this._handleOnPressCall}
                            >
                                <Image source={imgCall} style={{ width: 24, height: 24 }} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.block}>
                            <TitleRowInput
                                title={I18n.t("full_name")}
                                value={this.state.name}
                                onChangeText={this._handleOnChangeTextName}
                                maxLength={MAX_LENGTH_NAME}
                                hasError={!!this.state.errName}
                                errorText={this.state.errName}
                                editable={canEditInfo}
                            />
                            <View className="space8" />
                            <View className='row-start white' >
                                <TitleRowInput
                                    title={I18n.t("supplier_phone_1")}
                                    value={formatPhoneNumberWithoutAddZero(this.state.phone)}
                                    maxLength={12}
                                    keyboardType="number-pad"
                                    onChangeText={this._handleOnChangeTextPhone}
                                    hasError={!!this.state.errPhone}
                                    errorText={this.state.errPhone}
                                    editable={canEditInfo}
                                    borderRight
                                    onBlur={this._handleOnBlurPhone}
                                />
                                <TouchableOpacity
                                    onPress={this._handleOnPressCopyNumber}
                                // style={{ position: "absolute", right: 0 }}
                                >
                                    <View style={styles.btnCopy}>
                                        <Text style={styles.txtOption}>
                                            {I18n.t("copy_number")}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View className="space8" />
                            <View style={{ flexDirection: "row" }}>
                                <TitleRowInput
                                // keyboardType={'none'}
                                    title={I18n.t("password")}
                                    value={"******"}
                                    secureTextEntry={true}
                                    maxLength={10}
                                    onChangeText={this._handleOnChangeTextPhone}
                                    editable={false}
                                />
                                {Reset}
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
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={false}
                                extraData={this.state.permission}
                                data={permissionDefByRole}
                                renderItem={this._renderPermissionItem}
                                keyExtractor={item => item.id + ""}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {!!canEditInfo && <View className='bottom'>
                    <Button
                        text={I18n.t('save_change')}
                        disabled={this.state.disableSave || !enableButton}
                        onPress={this._handleSave}
                        style={SURFACE_STYLES.flex}
                    />
                </View>}
            </Container>
        );
    }
}

export default connect(
    (state, props) => {
        const staff = props.navigation.getParam("staff");
        return {
            merchantId: merchantIdSelector(state),
            permissionDef: permissionDefSelector(state),
            permission: permissionSelector(state, staff.userId),
            userInfo: userInfoSelector(state),
            currentUserPermissionId: currentUserPermissionIdSelector(state),
        };
    },
    {
        getPermissionDef,
        addPermission,
        getPermission,
        removePermission,
        removeStaff,
        getStaffList,
        resetPassword,
        updateStaff
    }
)(StaffInfo);
