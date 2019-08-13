import React, { PureComponent } from "react";
import {
    FlatList,
    InteractionManager,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    Platform
} from "react-native";
import { connect } from "react-redux";
import Accordion from "react-native-collapsible/Accordion";
import {
    View,
    Toolbar,
    Container,
    Text,
    PopupConfirm,
    Button,
    SearchInput

} from "~/src/themesnew/ThemeComponent";
import { SURFACE_STYLES, COLORS } from "~/src/themesnew/common";
import I18n from "~/src/I18n";
import { getStaffList, removeStaff } from "~/src/store/actions/merchant";
import styles from "./styles";
import imgChevronRight from "~/src/image/chevron_right_gray.png";
import imgDelete from "~/src/image/delete2.png";
import imgDeleteActive from "~/src/image/delete_active.png";
import imgDeleteItem from "~/src/image/delete_red.png";
import { userInfoSelector } from "~/src/store/selectors/auth";

import {
    merchantIdSelector,
    staffListSelector
} from "~/src/store/selectors/merchant";
import {
    formatPhoneNumber,
    replacePatternString,
    chainParse
} from "~/src/utils";
import { getPermissionDef } from "~/src/store/actions/permission";
import {
    permissionDefSelector,
    currentUserPermissionIdSelector
} from "~/src/store/selectors/permission";
import { ROLES } from "~/src/constants";
import ToastUtils from "~/src/utils/ToastUtils";
import LoadingModal from "~/src/components/LoadingModal";

class StaffManager extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingFull: false,
            activeSections: [0],
            showDelete: false,
            popupDeleteStaffContent: "",
            selectedStaffId: "",
            userId: ""
        };
        this.selectedStaffName = "";
    }

    getSelected = () => {
        return this.state.selected;
    };

    _handlePress = item => {
        console.log("Press Staff Item", item);
        if (this.state.showDelete) return;
        this.props.navigation.navigate("StaffInfo", {
            staff: item
        });
    };

    _handlePressDeleteItem = item => {
        this.setState({
            selectedStaffId: item.userId
        });
        this.selectedStaffName = item.userName;
        const warnMessage = replacePatternString(
            I18n.t("warn_delete_staff"),
            `"${item.userName}"`
        );
        this.setState(
            {
                popupDeleteStaffContent: warnMessage
            },
            () => {
                this.popupDeleteStaff && this.popupDeleteStaff.open();
            }
        );
    };

    _load = (refreshing = false) => {
        const { merchantId, userInfo, getPermissionDef } = this.props;
        if (refreshing) {
            this.setState({ loading: true });
        }
        this.props.getStaffList(merchantId, (err, data) => {
            console.log("Staff List Err", err);
            console.log("Staff List Data", data);
            this.setState({ loading: false });
        });
        getPermissionDef((err, data) => {
            console.log("getPermissionDef err", err);
            console.log("getPermissionDef data", data);
        });
    };

    _refresh = () => {
        this._load(true);
    };

    formatListStaff = staffList => {
        const { permissionDef } = this.props;
        let list = [];
        if (permissionDef) {
            for (let i = 0; i < permissionDef.length; i++) {
                list.push({
                    title: permissionDef[i].title,
                    id: permissionDef[i].id,
                    data: []
                });
            }
        }

        if (staffList && staffList.length > 0) {
            for (let i = 0; i < staffList.length; i++) {
                for (let j = 0; j < list.length; j++) {
                    if (staffList[i].listPermission[0].id === list[j].id) {
                        list[j].data.push(staffList[i])
                    }
                }
            }
        }

        return list;
    };

    componentDidMount() {
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS == "android") {
            StatusBar.setBackgroundColor(COLORS.WHITE);
        }
        console.log("Staff Manager", this.props);
        const { staffList, userInfo } = this.props;
        if (userInfo && userInfo.userId) {
            this.setState({
                userId: userInfo.userId
            });
        }
        const showRefresh = !staffList || staffList.length == 0;
        this._load(showRefresh);
    }

    _handleAddStaff = () => {
        InteractionManager.runAfterInteractions(() => {
            console.log("Add Staff");
            this.props.navigation.navigate("AddStaff");
        });
    };

    _renderHeader = (section, index, isActive, sections) => {
        const numProduct = section && section.data ? section.data.length : 0;
        return (
            <View className="row-start border-bottom ph24 pv14 white">
                <View className="row-start flex">
                    <View
                        className="row-start flex"
                        style={{
                            paddingRight: 9,
                            borderRightColor: "transparent",
                            borderRightWidth: 1
                        }}
                    >
                        <Text className="flex">
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: COLORS.TEXT_BLACK,
                                    lineHeight: 20
                                }}
                            >
                                {section.title}{" "}
                            </Text>
                            <Text className="caption">
                                ({numProduct} {I18n.t("account").toLowerCase()})
              </Text>
                        </Text>
                    </View>
                    <Image
                        source={require("~/src/image/chevron_down.png")}
                        style={{
                            marginLeft: 12,
                            width: 10,
                            height: 6,
                            backgroundColor: COLORS.WHITE,
                            transform: [{ rotate: isActive ? "180deg" : "0deg" }]
                        }}
                    />
                </View>
            </View>
        );
    };

    _updateSections = activeSections => {
        console.log("activeSections", activeSections);
        this.setState({ activeSections });
    };

    _renderDelete = item => {
        const { currentUserPermissionId } = this.props;
        const itemUserPermissionId =
            item && item.listPermission && item.listPermission[0]
                ? item.listPermission[0].id
                : "";
        let canDelete = false;
        if (currentUserPermissionId == ROLES.OWNER) {
            if (itemUserPermissionId != ROLES.OWNER) {
                canDelete = true;
            }
        } else if (currentUserPermissionId == ROLES.MANAGER) {
            if (itemUserPermissionId == ROLES.SALE) {
                canDelete = true;
            }
        }

        if (this.state.showDelete && canDelete) {
            return (
                <TouchableOpacity onPress={() => this._handlePressDeleteItem(item)}>
                    <View>
                        <Image
                            source={imgDeleteItem}
                            style={{ width: 24, height: 24, marginRight: 24 }}
                        />
                    </View>
                </TouchableOpacity>
            );
        } else {
            return <View />;
        }
    };

    _renderStaffItem = ({ item, index, section }) => {
        return (
            // <Text>{item.name}</Text>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this._handlePress(item)}
            >
                <View className="white  flex" style={{ paddingLeft: 24 }}>
                    <View
                        className="border-bottom2 "
                        style={{
                            paddingRight: 24,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        {this._renderDelete(item)}
                        <View className="flex pv12">
                            <Text numberOfLines={1} style={styles.txtItemName}>
                                {item.name}
                            </Text>
                            <Text style={styles.txtItemNumber}>{item.phone}</Text>
                        </View>
                        <Image source={imgChevronRight} style={{ height: 10, width: 6 }} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    _renderContent = section => {
        return (
            <FlatList
                data={section.data}
                renderItem={({ item, index }) =>
                    this._renderStaffItem({ item, index, section })
                }
                keyExtractor={item => "" + item.userId}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                extraData={this.state.showDelete}
            />
        );
    };

    _deleteStaff = () => {
        const { removeStaff, getStaffList, merchantId } = this.props;
        const staff = this.props.navigation.getParam("staff");
        this.setState({ loadingFull: true });
        removeStaff(this.state.selectedStaffId, (err, data) => {
            console.log("removeStaff err", err);
            console.log("removeStaff data", data);
            const statusCode = chainParse(data, ["httpHeaders", "status"]);
            this.setState({ loadingFull: false });
            if (statusCode == 200) {
                this.setState({ showDelete: false });
                getStaffList(merchantId);
                ToastUtils.showSuccessToast(
                    replacePatternString(
                        I18n.t("delete_staff_success"),
                        `"${this.selectedStaffName}"`
                    )
                );
            } else if (data && data.code) {
                ToastUtils.showErrorToast(data.msg);
            }
        });
    };

    _handleOnPressDelete = () => {
        if (!this.state.showDelete) {
            this.setState({
                showDelete: !this.state.showDelete,
                activeSections: [0, 1, 2]
            })
        } else {
            this.setState({
                showDelete: !this.state.showDelete
            })
        }
    };

    render() {
        const { staffList, permissionDef } = this.props;
        return (
            <Container style={{ backgroundColor: COLORS.FEATURE_BACKGROUND }}>
                <LoadingModal visible={this.state.loadingFull} />
                <Toolbar title={I18n.t("manage_staff")} />
                <ScrollView
                    style={{
                        width: "100%",
                        flex: 1,
                        backgroundColor: COLORS.FEATURE_BACKGROUND
                    }}
                >
                    <View style={SURFACE_STYLES.flex}>
                        <PopupConfirm
                            ref={ref => (this.popupDeleteStaff = ref)}
                            content={this.state.popupDeleteStaffContent}
                            onPressYes={this._deleteStaff}
                            onPressNo={() => (this.selectedStaffId = "")}
                        />
                        <View style={styles.viewHeader} className="pv8 row-start">
                            <SearchInput
                                label={I18n.t("search_staff")}
                                onChangeText={this._handleChangeTextSearch}
                                value={this.state.valueSearch}
                                visible={!this.state.visibleDateInput}
                                onPressClear={this._handleOnPressCleanTextSearch}
                            />
                            {/* <Text style={styles.txtHeader}>{I18n.t("category_list")}</Text> */}
                            <TouchableOpacity
                                style={{ marginLeft: 33, marginTop: 'auto', marginBottom: 4 }}
                                onPress={this._handleOnPressDelete}
                            >
                                <Image
                                    source={this.state.showDelete ? imgDeleteActive : imgDelete}
                                    style={{ width: 24, height: 24 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{ backgroundColor: COLORS.FEATURE_BACKGROUND, flex: 1 }}
                        >
                            <View className="space12" />
                            <Accordion
                                sections={this.formatListStaff(staffList)}
                                // sections={staffList}
                                activeSections={this.state.activeSections}
                                renderHeader={this._renderHeader}
                                renderContent={this._renderContent}
                                onChange={this._updateSections}
                                sectionContainerStyle={{ marginBottom: 8 }}
                                touchableComponent={TouchableOpacity}
                                expandMultiple={true}
                                extraData={this.state.showDelete}
                            />
                        </View>
                    </View>
                </ScrollView>
                <Button
                    onPress={this._handleAddStaff}
                    className="bottom"
                    text={I18n.t("add_staff")}
                />
            </Container>
        );
    }
}

export default connect(
    state => ({
        merchantId: merchantIdSelector(state),
        staffList: staffListSelector(state),
        userInfo: userInfoSelector(state),
        permissionDef: permissionDefSelector(state),

        currentUserPermissionId: currentUserPermissionIdSelector(state)
    }),
    { getStaffList, removeStaff, getPermissionDef }
)(StaffManager);
