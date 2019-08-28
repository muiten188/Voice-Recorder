import React, { Component } from "react";
import {
    Alert,
    SectionList,
    TouchableOpacity,
    StatusBar,
    Platform
} from "react-native";
import { TouchableRipple } from "react-native-paper";
import styles from "./styles";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import I18n from "~/src/I18n";
import { logout } from "~/src/store/actions/common";
import { merchantSelector } from "~/src/store/selectors/merchant";
import { FORM_MODE } from "~/src/constants";
import Header from "./Header";
import { userInfoSelector } from "~/src/store/selectors/auth";
import { COLORS } from '~/src/themes/common'
import { Text, View, Container } from '~/src/themes/ThemeComponent'
import DeviceInfo from 'react-native-device-info'
const VERSION = DeviceInfo.getVersion()
import { isEmployeeSelector } from "~/src/store/selectors/permission";


class Store extends Component {
    constructor(props) {
        super(props);

        this.data = [
            {
                id: 1,
                title: I18n.t("info").toUpperCase(),
                showForEmployee: true,
                data: [
                    {
                        id: 14,
                        name: I18n.t("account_info"),
                        showForEmployee: true
                    },
                    {
                        id: 1,
                        name: I18n.t("store_info"),
                        showForEmployee: false
                    }
                ]
            },
            {
                id: 2,
                title: I18n.t("config_store").toUpperCase(),
                showForEmployee: false,
                data: [
                    {
                        id: 4,
                        name: I18n.t("product"),
                    },
                    {
                        id: 9,
                        name: I18n.t("floor_table"),
                    },
                    {
                        id: 2,
                        name: I18n.t("Staff"),
                    },
                ]
            },
            {
                id: 3,
                title: I18n.t("accounting").toUpperCase(),
                showForEmployee: false,
                data: [
                    {
                        id: 6,
                        name: I18n.t("manage_expenses"),
                    },
                    {
                        id: 7,
                        name: I18n.t("debt_manage_title"),
                    }
                ]
            },
            {
                id: 4,
                title: I18n.t("additional").toUpperCase(),
                showForEmployee: true,
                data: [
                    {
                        id: 11,
                        name: I18n.t("supplier"),
                    },
                    {
                        id: 5,
                        name: I18n.t("discount"),
                        showForEmployee: false,
                    },

                    {
                        id: 15,
                        name: I18n.t("term_and_condition"),
                        showForEmployee: true,
                    },
                    {
                        id: -1,
                        showForEmployee: true,
                    }
                ]
            }
        ];

        this.didFocusListener = props.navigation.addListener(
            "didFocus",
            this.componentDidFocus
        )
    }

    _handlePressItem = item => {
        if (item.id == 1) {
            const { merchantInfo } = this.props;
            this.props.navigation.navigate("StoreInfo", {
                mode:
                    !merchantInfo || Object.keys(merchantInfo).length == 0
                        ? FORM_MODE.ADD
                        : FORM_MODE.VIEW
            }); //StoreInfo
        } else if (item.id == 2) {
            this.props.navigation.navigate("StaffManager");
        } else if (item.id == 3) {
            this.props.navigation.navigate("ProductMenu");
        } else if (item.id == 4) {
            this.props.navigation.navigate("ProductManager");
        } else if (item.id == 5) {
            this.props.navigation.navigate("DiscountManager");
        } else if (item.id === 6) {
            this.props.navigation.navigate("CostManage");
        } else if (item.id == 7) {
            this.props.navigation.navigate("DebtManage");
        } else if (item.id == 9) {
            this.props.navigation.navigate("FloorTableManager");
        } else if (item.id == 11) {
            this.props.navigation.navigate("SupplierManager");
        } else if (item.id == 12) {
            this.props.navigation.navigate("PrinterConfig");
        } else if (item.id == 13) {
            this.props.navigation.navigate("QRCodeConfig");
        } else if (item.id == 14) {
            this.props.navigation.navigate('AccountInfo')
        } else if (item.id == 15) {
            this.props.navigation.navigate('TermAndCondition')
        }
    };

    _renderItem = ({ item, index, section }) => {
        if (item.id == -1) {
            return this._renderLogoutBtn()
        }
        const { isEmployee } = this.props
        if (isEmployee && (!section.showForEmployee || !item.showForEmployee)) {
            return <View />
        }

        const showBorder = index < section.data.length - 1;
        const className = showBorder ? 'row-space-between mh24 pv12 border-bottom2' : 'row-space-between mh24 pv12'
        return (
            <TouchableRipple
                key={item.id}
                onPress={() => this._handlePressItem(item)}
                rippleColor={COLORS.RIPPLE}
            >
                <View
                    className={className}
                >
                    <Text>{item.name}</Text>
                    <Icon name={"chevron-right"} size={16} color={COLORS.BLACK} />
                </View>
            </TouchableRipple>
        );
    };

    _renderHeader = ({ section: { title, showForEmployee } }) => {
        const { isEmployee } = this.props
        if (isEmployee && !showForEmployee) return <View />
        return (
            <View className='ph24 pt16 pb8 background'>
                <Text className='caption'>{title}</Text>
            </View>
        );
    };

    _handlePressLogout = () => {
        Alert.alert(I18n.t("confirm"), I18n.t("warn_logout"), [
            {
                text: I18n.t("cancel")
            },
            {
                text: I18n.t("confirm"),
                onPress: () => {
                    this.props.logout()
                }
            }
        ])
    }

    _renderLogoutBtn = () => {
        return (
            <View>
                <TouchableOpacity
                    onPress={this._handlePressLogout}
                    style={styles.btnLogOut}
                >
                    <Text style={styles.labelButton}>{I18n.t("label_logout")}</Text>
                </TouchableOpacity>
                <View className='row-cener pb16'>
                    <Text className='gray center'>{I18n.t('version')} {VERSION}</Text>
                </View>
            </View>

        )
    }

    componentDidFocus = () => {
        StatusBar.setBarStyle('light-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.CERULEAN)
        }
    }

    render() {
        return (
            <Container blue>
                <View className='flex background'>
                    <SectionList
                        renderItem={this._renderItem}
                        renderSectionHeader={this._renderHeader}
                        sections={this.data}
                        keyExtractor={(item, index) => item.id + "" + index}
                        ListHeaderComponent={<Header />}
                        style={{ backgroundColor: COLORS.WHITE }}
                    />
                </View>

            </Container>
        )
    }
}

export default connect(
    state => ({
        merchantInfo: merchantSelector(state),
        userInfo: userInfoSelector(state),
        isEmployee: isEmployeeSelector(state),
    }),
    { logout }
)(Store);
