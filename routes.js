import React, { Component } from "react";
import { Image, Text } from "react-native";
import imgHomeIcon from "~/src/image/tabbottom/imgHomeIcon.png";
import imgHomeFocus from "~/src/image/tabbottom/imgHomeFocus.png";
import imgAccountant from "~/src/image/tabbottom/imgAccountant.png";
import imgAcountantFocus from "~/src/image/tabbottom/imgAcountantFocus.png";
import imgOrder from "~/src/image/tabbottom/imgOrder.png";
import imgOrderFocus from "~/src/image/tabbottom/imgOrderFocus.png";
import imgSetting from "~/src/image/tabbottom/imgSetting.png";
import imgSettingFocus from "~/src/image/tabbottom/imgSettingFocus.png";

// Screens
import Activities from "~/src/screens/Activities"
import Intro from "~/src/screens/Intro"
import Welcome from "~/src/screens/Welcome";
import Accountant from "~/src/screens/Accountant";
import Home from "~/src/screens/Home";
import Store from "~/src/screens/Store";
import QRScanner from "~/src/screens/QRScanner";
import QRScannerInfo from "~/src/screens/QRScannerInfo";
import QRScannerPaySuccess from "~/src/screens/QRScannerPaySuccess";
import QRCode from "~/src/screens/QRCode";
import Login from "~/src/screens/Login";
import StoreInfo from "~/src/screens/StoreInfo";
import Register from "~/src/screens/Register";
import Webview from "~/src/screens/Webview";
import AuthLoading from "~/src/screens/AuthLoading";
import Toast from "~/src/screens/Toast";
import AddressPicker from "~/src/screens/AddressPicker";
import MerchantChooser from "~/src/screens/MerchantChooser";
import StaffManager from "~/src/screens/StaffManager";
import AddStaff from "~/src/screens/AddStaff";
import StaffInfo from "~/src/screens/StaffInfo";
import ContactChooser from "~/src/screens/ContactChooser";
import ProductManager from "~/src/screens/ProductManager";
import ProductInfo from "~/src/screens/ProductInfo";
import ProvincePicker from "~/src/screens/ProvincePicker";
import DistrictPicker from "~/src/screens/DistrictPicker";
import WardPicker from "~/src/screens/WardPicker";
import MerchantManager from "~/src/screens/MerchantManager";
import ShippingManager from "~/src/screens/ShippingManager";
import ProductVariantChooser from "~/src/screens/ProductVariantChooser";
import ProductVariantPrice from "~/src/screens/ProductVariantPrice";
import Notification from "~/src/screens/Notification";
import ProductBarcodeScanner from "~/src/screens/ProductBarcodeScanner";
import MenuProductSelector from "~/src/screens/MenuProductSelector";
import ChangePassword from "~/src/screens/ChangePassword";
import CostList from "~/src/screens/CostList";
import CostManage from "~/src/screens/CostManage"
import AddCost from "~/src/screens/AddCost";
import CostInfo from "~/src/screens/CostInfo";
import AddCostGroup from "~/src/screens/AddCostGroup"

import SupplierManager from "~/src/screens/SupplierManager";
import SupplierInfo from "~/src/screens/SupplierInfo";
import StoreConfig from "~/src/screens/StoreConfig";
import DebtManage from "~/src/screens/DebtManage";
import AddDebt from "~/src/screens/AddDebt";
import DebtInfo from "~/src/screens/DebtInfo";
// New Design Screen
import ChooseCostGroup from "~/src/screens/ChooseCostGroup"
import AddMenu from "~/src/screens/AddMenu";
import DebtList from "~/src/screens/DebtList";
import UpdateMenu from "~/src/screens/UpdateMenu";
import ProductMenuDelete from "~/src/screens/ProductMenuDelete";
import ProductMenuSort from "~/src/screens/ProductMenuSort";
import MenuChooseProduct from "~/src/screens/MenuChooseProduct";
import FloorTableManager from "~/src/screens/FloorTableManager";
import FloorTableInfo from "~/src/screens/FloorTableInfo";
import FloorTableDelete from "~/src/screens/FloorTableDelete";
import FloorTableSort from '~/src/screens/FloorTableSort';
import CreateOrder from '~/src/screens/CreateOrder'
import OrderDetail from '~/src/screens/OrderDetail'
import OrderPay from '~/src/screens/OrderPay'
import OrderList from '~/src/screens/OrderList'
import ChooseAddProduct from '~/src/screens/ChooseAddProduct'
import DiscountManager from '~/src/screens/DiscountManager'
import DiscountInfo from '~/src/screens/DiscountInfo'
import DiscountProductSelector from '~/src/screens/DiscountProductSelector'
import AccountInfo from '~/src/screens/AccountInfo'
import TermAndCondition from '~/src/screens/TermAndCondition'
import TopProductList from '~/src/screens/TopProductList'

import {
    createStackNavigator,
    createAppContainer,
} from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import { Platform, Animated, Easing } from "react-native";
import { COLORS } from "~/src/themes/common";
import I18n from "~/src/I18n";

const HomeNavigator = createMaterialBottomTabNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: () => ({
                title: I18n.t("home"),

                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <Image source={imgHomeFocus} style={styles.icon} />
                    ) : (
                            <Image source={imgHomeIcon} style={styles.icon} />
                        )
            })
        },

        OrderList: {
            screen: OrderList,
            navigationOptions: () => ({
                title: I18n.t("title_order"),
                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <Image source={imgOrderFocus} style={styles.icon} />
                    ) : (
                            <Image source={imgOrder} style={styles.icon} />
                        )
            })
        },
        Accountant: {
            screen: Accountant,
            initialRouteName: CostList,
            navigationOptions: () => ({
                title: I18n.t("title_accountant"),
                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <Image source={imgAcountantFocus} style={styles.icon} />
                    ) : (
                            <Image source={imgAccountant} style={styles.icon} />
                        )
            })
        },

        Store: {
            screen: Store,
            navigationOptions: () => ({
                title: I18n.t("title_setting"),
                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <Image source={imgSettingFocus} style={styles.icon} />
                    ) : (
                            <Image source={imgSetting} style={styles.icon} />
                        )
            })
        }
    },
    {
        initialRouteName: "Home",
        activeColor: COLORS.BLUE,
        inactiveColor: COLORS.DARK_GRAY,
        shifting: false,
        labeled: true,
        animationEnabled: true,
        barStyle: {
            backgroundColor: COLORS.WHITE,
            borderTopWidth: Platform.OS == "ios" ? 0.5 : 0,
            borderTopColor:
                Platform.OS == "ios" ? "rgba(0, 0, 0, 0.2)" : "transparent",
            overflow: "hidden"
        },
        style: {
            backgroundColor: "transparent"
        }
    }
);


const HomeNavigatorEmployee = createMaterialBottomTabNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: () => ({
                title: I18n.t("home"),
                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <Image source={imgHomeFocus} style={styles.icon} />
                    ) : (
                            <Image source={imgHomeIcon} style={styles.icon} />
                        )
            })
        },

        OrderList: {
            screen: OrderList,
            navigationOptions: () => ({
                title: I18n.t("title_order"),
                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <Image source={imgOrderFocus} style={styles.icon} />
                    ) : (
                            <Image source={imgOrder} style={styles.icon} />
                        )
            })
        },
        Store: {
            screen: Store,
            navigationOptions: () => ({
                title: I18n.t("title_setting"),
                tabBarIcon: ({ focused }) =>
                    focused ? (
                        <Image source={imgSettingFocus} style={styles.icon} />
                    ) : (
                            <Image source={imgSetting} style={styles.icon} />
                        )
            })
        }
    },
    {
        initialRouteName: "Home",
        activeColor: COLORS.BLUE,
        inactiveColor: COLORS.DARK_GRAY,
        shifting: false,
        labeled: true,
        animationEnabled: true,
        barStyle: {
            backgroundColor: COLORS.WHITE,
            borderTopWidth: Platform.OS == "ios" ? 0.5 : 0,
            borderTopColor:
                Platform.OS == "ios" ? "rgba(0, 0, 0, 0.2)" : "transparent",
            overflow: "hidden"
        },
        style: {
            backgroundColor: "transparent"
        }
    }
);

const styles = {
    icon: {
        width: 21,
        height: 21
    },
    label: {
        fontSize: 12,
        fontWeight: "bold",
        marginTop: "auto",
        marginBottom: 20
    }
};


const AppNavigator = createStackNavigator(
    {
        Welcome,
        QRScanner,
        QRScannerInfo,
        QRCode,
        StoreInfo,
        AddressPicker,
        MerchantChooser,
        StaffManager,
        AddStaff,
        StaffInfo,
        ContactChooser,
        ProductManager,
        ProductInfo,
        ProvincePicker,
        DistrictPicker,
        WardPicker,
        MerchantManager,
        ShippingManager,
        ProductVariantChooser,
        ProductVariantChooser,
        ProductVariantPrice,
        Notification,
        ProductBarcodeScanner,
        MenuProductSelector,
        ChangePassword,
        CostList,
        CostManage,
        CostInfo,
        StoreConfig,
        DebtInfo,
        DebtManage,
        // New screen
        AddMenu,
        UpdateMenu,
        ProductMenuDelete,
        ProductMenuSort,
        MenuChooseProduct,
        FloorTableManager,
        FloorTableInfo,
        FloorTableDelete,
        CreateOrder,
        OrderDetail,
        OrderPay,
        OrderList,
        ChooseAddProduct,
        FloorTableSort,
        DiscountManager,
        DiscountInfo,
        DiscountProductSelector,
        TermAndCondition,
        AddCostGroup,
        ChooseCostGroup,
        TopProductList,
        AddDebt: {
            screen: AddDebt,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },

        DebtList: {
            screen: DebtList,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        AccountInfo,
        Activities: {
            screen: Activities,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        Intro: {
            screen: Intro,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        AddStaff: {
            screen: AddStaff,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },

        StaffInfo: {
            screen: StaffInfo,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },

        StaffManager: {
            screen: StaffManager,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },

        SupplierInfo: {
            screen: SupplierInfo,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },

        SupplierManager: {
            screen: SupplierManager,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        AddCost: {
            screen: AddCost,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        Login: {
            screen: Login,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        Register: {
            screen: Register,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        WebView: {
            screen: Webview,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        AuthLoading: {
            screen: AuthLoading,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        Home: {
            screen: HomeNavigator,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        QRScannerPaySuccess: {
            screen: QRScannerPaySuccess,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        Home: {
            screen: HomeNavigator,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        HomeEmployee: {
            screen: HomeNavigatorEmployee,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
    },
    {
        initialRouteName: "AuthLoading",
        headerMode: "float",
        transitionConfig: () => {
            if (Platform.OS == "android") {
                return {
                    transitionSpec: {
                        duration: 300,
                        easing: Easing.out(Easing.poly(4)),
                        timing: Animated.timing
                    },
                    screenInterpolator: sceneProps => {
                        const { layout, position, scene } = sceneProps;
                        const { index } = scene;

                        const width = layout.initWidth;
                        const translateX = position.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [width, 0, 0]
                        });

                        const opacity = position.interpolate({
                            inputRange: [index - 1, index - 0.99, index],
                            outputRange: [0, 1, 1]
                        });

                        return { opacity, transform: [{ translateX }] };
                    }
                };
            }
            return {};
        },
        navigationOptions: {
            gesturesEnabled: true
        }
    }
);

const RootNavigator = createStackNavigator(
    {
        Main: {
            screen: AppNavigator
        },
        Toast: {
            screen: Toast
        }
    },
    {
        mode: "modal",
        headerMode: "none",
        initialRouteName: "Main",
        transparentCard: true,
        cardStyle: {
            backgroundColor: "transparent",
            opacity: 1
        },
        transitionConfig: () => ({
            transitionSpec: {
                duration: 0,
                timing: Animated.timing,
                easing: Easing.step0
            }
        })
    }
);

export default (AppContainer = createAppContainer(RootNavigator));
