import React, { Component } from "react";
import { Image, Linking, TouchableOpacity, Platform } from 'react-native'
import { SURFACE_STYLES } from "~/src/themes/common";
import I18n from "~/src/I18n";
import {
    TitleRowInput as TextInput,
    Toolbar, Text, Button, View,
    Container
} from "~/src/themes/ThemeComponent";
import {
    createMerchant,
    getListMerchant,
    removeMerchant
} from "~/src/store/actions/merchant";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
    chainParse,
    formatPhoneNumberWithoutAddZero,
    isValidPhoneNumer,
    replacePatternString
} from "~/src/utils";
import LoadingModal from "~/src/components/LoadingModal";
import { FORM_MODE } from "~/src/constants";
import { merchantSelector } from "~/src/store/selectors/merchant";
import {
    saveSupplier,
    getListSupplier,
    deleteSupplier
} from "~/src/store/actions/supplier";
import ToastUtils from '~/src/utils/ToastUtils'
import imgMess from "~/src/image/mess.png";
import imgCall from "~/src/image/call.png";
import styles from './styles'

class SupplierInfo extends Component {

    constructor(props) {
        super(props);
        const supplierInfo = props.navigation.getParam("supplier");
        console.log("supplierInfo", supplierInfo);
        const id = chainParse(supplierInfo, ["id"]) || "";
        this.state = {
            mode: props.navigation.getParam("mode") || FORM_MODE.ADD,
            showContext: false,
            loading: false,
            disableSave: id ? true : false,
            supplierId: chainParse(supplierInfo, ["id"]) || "",
            supplierName: chainParse(supplierInfo, ["name"]) || "",
            supplierUserName: chainParse(supplierInfo, ["trader"]) || "",
            phone1: chainParse(supplierInfo, ["phone1"]) || "",
            phone2: chainParse(supplierInfo, ["phone2"]) || "",
            errPhone1: "",
            errPhone2: "",
            note: chainParse(supplierInfo, ["note"]) || "",
            supplierItems: chainParse(supplierInfo, ["items"]) || "",
            address: chainParse(supplierInfo, ["address"]) || ""
        };

    }

    _handlePressMore = () => {
        console.log("Handle Press More");
        this.setState({ showContext: true });
    };

    _handleSave = async () => {
        const phone1 = this.state.phone1.replace(/\s/g, "");
        const phone2 = this.state.phone2.replace(/\s/g, "");
        if (phone1 && !isValidPhoneNumer(phone1)) {
            this.setState({ errPhone1: I18n.t("err_supplier_phone") });
            return;
        }
        const { saveSupplier, getListSupplier } = this.props;
        const requestObj = {
            supplierId: this.state.supplierId,
            name: this.state.supplierName.trim(),
            trader: this.state.supplierUserName.trim(),
            phone1,
            phone2,
            address: this.state.address.trim(),
            items: this.state.supplierItems.trim(),
            note: this.state.note.trim()
        };
        console.log("Request Obj", requestObj);
        this.setState({ loading: true });
        saveSupplier(requestObj, (err, data) => {
            console.log("saveSupplier Err", err);
            console.log("saveSupplier Data", data);
            if (chainParse(data, ["httpHeaders", "status"]) == 200) {
                this.setState({ loading: false });
                getListSupplier();
                // Update
                if (this.state.supplierId) {
                    ToastUtils.showSuccessToast(replacePatternString(I18n.t('update_supplier_success'), `"${this.state.supplierName.trim()}"`))
                } else {
                    // Create
                    ToastUtils.showSuccessToast(replacePatternString(I18n.t('add_supplier_success'), `"${this.state.supplierName.trim()}"`))
                }
                this.props.navigation.goBack();
            } else {
                this.setState({ loading: false });
            }
        });
    };

    componentDidMount() {

    }


    _delete = () => {
        console.log("Delete");
        const { deleteSupplier, getListSupplier } = this.props;
        this.setState({ loading: true });
        deleteSupplier(this.state.supplierId, (err, data) => {
            console.log("deleteSupplier Err", err);
            console.log("deleteSupplier Data", data);
            if (chainParse(data, ["httpHeaders", "status"]) == 200) {
                this.setState({ loading: false });
                this.props.navigation.goBack();
                getListSupplier();
                this.props.navigation.navigate("Toast", {
                    text: I18n.t("delete_supplier_success")
                });
            } else if (data && data.code) {
                this.props.navigation.navigate("Toast", { text: data.msg });
            }
        });
    };

    _handleOnChangeTextSupplierName = text => {
        this.setState({ supplierName: text, disableSave: false });
    };

    _handleOnChangeTextPhone = text => {
        this.setState({
            phone1: formatPhoneNumberWithoutAddZero(text),
            errPhone1: "",
            disableSave: false
        });
    };

    _handleOnChangeTextSupplierItems = text => {
        this.setState({ supplierItems: text, disableSave: false });
    };
    _handleOnChangeTextAddress = text => {
        this.setState({ address: text, disableSave: false });
    };

    _handlePressCancel = () => {
        this.props.navigation.goBack()
    }

    _handleOnPressCall = () => {
        const hotline = this.state.phone1;
        if (!hotline) return
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
        const hotline = this.state.phone1;
        if (!hotline) return
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

    _renderForm = () => {
        const enableButton = !!(
            this.state.supplierName
        );

        console.log('Id', this.state.supplierId)
        const toolbarTitle = this.state.supplierId ? I18n.t('update_supplier') : I18n.t('add_supplier')
        const buttonTitle = this.state.supplierId ? I18n.t('save_change') : I18n.t('done')
        const mode = this.props.navigation.getParam("mode", FORM_MODE.ADD)

        return (
            <View className='flex background'>
                <Toolbar
                    title={toolbarTitle}
                    rightText={I18n.t('cancel')}
                    onPressRight={this._handlePressCancel}
                />
                <KeyboardAwareScrollView keyboardShouldPersistTaps={"handled"}>
                    <View>
                        {(mode == FORM_MODE.EDIT) ?
                            <View
                                className="row-start pv16 pl24 pr16">
                                <View className="flex">
                                    <Text className='s12 textBlack'>{I18n.t("supplier_name")}</Text>
                                    <Text className='s15 textBlack bold' style={{ marginTop: 5 }}>{this.state.supplierName}</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.btnMess, { opacity: this.state.phone1 ? 1 : 0.3 }]}
                                    onPress={this._handleOnPressMess}
                                >
                                    <Image source={imgMess} style={{ width: 24, height: 24, }} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.btnCall, { opacity: this.state.phone1 ? 1 : 0.3 }]}
                                    onPress={this._handleOnPressCall}
                                >
                                    <Image source={imgCall} style={{ width: 24, height: 24 }} />
                                </TouchableOpacity>
                            </View>
                            :
                            <View className='space12' />
                        }
                        <TextInput
                            title={I18n.t("supplier_name")}
                            isRequire={true}
                            descriptionIcon={"store"}
                            iconRight={"close"}
                            showIconRight={!!this.state.supplierName}
                            onChangeText={this._handleOnChangeTextSupplierName}
                            value={this.state.supplierName}
                            onPressIconRight={() => this.setState({ supplierName: "" })}
                            maxLength={80}
                        />
                        <View style={SURFACE_STYLES.space10} />
                        <TextInput
                            title={I18n.t("supplier_phone_1")}
                            descriptionIcon={"phone"}
                            iconRight={"close"}
                            showIconRight={!!this.state.phone1}
                            onChangeText={this._handleOnChangeTextPhone}
                            value={formatPhoneNumberWithoutAddZero(this.state.phone1)}
                            onPressIconRight={() =>
                                this.setState({ phone1: "", errPhone1: "" })
                            }
                            keyboardType={"number-pad"}
                            maxLength={12}
                            isRequire={true}
                            errorText={this.state.errPhone1}
                            hasError={!!this.state.errPhone1}
                        />

                        <View style={SURFACE_STYLES.space10} />

                        <TextInput
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            title={I18n.t("supplier_items")}
                            descriptionIcon={"shopping"}
                            iconRight={"close"}
                            showIconRight={!!this.state.supplierItems}
                            onChangeText={this._handleOnChangeTextSupplierItems}
                            value={this.state.supplierItems}
                            onPressIconRight={() => this.setState({ supplierItems: "" })}
                            maxLength={512}
                            isRequire={true}
                        />

                        <TextInput
                            style={{ marginTop: 1 }}
                            multiline={true}
                            // numberOfLines={2}
                            styleTextInput={{ height: 48, padding:0 }}
                            // height={76.5}
                            numberOfLines={3}
                            title={I18n.t("address")}
                            descriptionIcon={"map-legend"}
                            iconRight={"close"}
                            showIconRight={this.state.address}
                            onChangeText={this._handleOnChangeTextAddress}
                            value={this.state.address}
                            onPressIconRight={() => this.setState({ address: "" })}
                            maxLength={512}
                            isRequire={true}
                        />

                        <View style={SURFACE_STYLES.bottomButtonSpace} />
                    </View>
                </KeyboardAwareScrollView>
                <View className='bottom'>
                    <Button
                        onPress={this._handleSave}
                        text={buttonTitle}
                        disabled={this.state.disableSave || !enableButton}
                        style={SURFACE_STYLES.flex}
                    />
                </View>
                {/* <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        position: "absolute",
                        zIndex: 10,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        ...SURFACE_STYLES.rowCenter,
                        width: "100%"
                    }}
                    onPress={this._handleSave}
                    disabled={this.state.disableSave || !enableButton ? true : false}
                >
                    <View
                        style={[
                            styles.viewSave,
                            {
                                backgroundColor:
                                    this.state.disableSave || !enableButton
                                        ? COLORS.DISABLE_BUTTON
                                        : COLORS.PRIMARY
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styles.labelSave,
                                {
                                    color:
                                        this.state.disableSave || !enableButton
                                            ? COLORS.BACKDROP
                                            : COLORS.WHITE
                                }
                            ]}
                        >
                            {this.state.supplierId
                                ? I18n.t("save_change")
                                : I18n.t("add_supplier")}
                        </Text>
                    </View>
                </TouchableOpacity> */}
            </View>
        );
    };

    render() {
        return (
            <Container>
                {this._renderForm()}
                <LoadingModal visible={this.state.loading} />
            </Container>
        );
    }
}

export default connect(
    state => ({
        merchantInfo: merchantSelector(state)
    }),
    {
        createMerchant,
        getListMerchant,
        removeMerchant,
        saveSupplier,
        getListSupplier,
        deleteSupplier
    }
)(SupplierInfo);
