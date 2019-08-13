import React, { Component } from "react";
import { Image, TouchableOpacity } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { connect } from "react-redux";
import {
    COLORS,
    SURFACE_STYLES
} from "~/src/themesnew/common";
import { Text, View } from "~/src/themesnew/ThemeComponent";
import { formatMoney } from "~/src/utils";
import I18n from "~/src/I18n";
import { statisticSelector } from "~/src/store/selectors/home";
import { withNavigation } from "react-navigation";
import { logout } from "~/src/store/actions/common";
import { numberUnreadNotificationSelector } from "~/src/store/selectors/notification";
import styles from "./styles";
import imgLogoApp from "~/src/image/imgLogoApp.png";
import imgNotifiIcon from "~/src/image/home/imgNotifiIcon.png";
import { isEmployeeSelector } from "~/src/store/selectors/permission";
import {
    updateOrderTab,
} from '~/src/store/actions/order'
import { ORDER_TAB } from '~/src/constants'

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    _handlePressNotification = () => {
        console.log("_handlePressNotification");
        this.props.navigation.navigate("Notification");
    };

    _handlePressRevenue = () => {
        const { isEmployee } = this.props
        if (isEmployee) return
        this.props.navigation.navigate('Chart')
    }

    _handlePressWaitingOrder = () => {
        const { updateOrderTab } = this.props
        this.props.navigation.navigate('OrderList')
        updateOrderTab(ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY)
    }

    _handlePressCompleteOrder = () => {
        const { updateOrderTab } = this.props
        this.props.navigation.navigate('OrderList')
        updateOrderTab(ORDER_TAB.ORDER_OFFLINE_PAID)
    }

    render = () => {
        const { numberUnreadNotification, statistic, isEmployee } = this.props;

        return (
            <View style={styles.containerHeader}>
                <View style={{ height: 153, marginHorizontal: 16 }}>
                    <View
                        style={[
                            SURFACE_STYLES.rowSpacebetween,
                            { marginTop: 31, justifyContent: "center" }
                        ]}
                    >
                        <Image source={imgLogoApp} style={{ width: 49, height: 52 }} />
                        <View style={{ position: "absolute", right: 0 }}>
                            {!!numberUnreadNotification && <View style={styles.badgeView} pointerEvents={'none'}>
                                <Text className='bold white s11'>{numberUnreadNotification}</Text>
                            </View>}
                            <TouchableRipple

                                onPress={this._handlePressNotification}
                                rippleColor={COLORS.RIPPLE}
                            >
                                <Image source={imgNotifiIcon} style={{ width: 46, height: 46 }} />
                            </TouchableRipple>
                        </View>

                    </View>

                    {/* View 3 order  */}
                    <TouchableOpacity onPress={this._handlePressRevenue}>
                        <View className='column-center'>
                            <Text className='s12 bold whiteBlue'>{I18n.t("revenue_day")}</Text>
                            <Text className='bold s30 lh40 white'>
                                {(statistic.totalTransactionAmount) ? formatMoney(statistic.totalTransactionAmount) : '--'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View className='row-start mt24'>
                        <TouchableOpacity onPress={this._handlePressWaitingOrder} style={{ flex: 1 }}>

                            <View className='column-center'>
                                <Text className='s12 bold whiteBlue'>{I18n.t("waiting_order")}</Text>
                                <Text className='bold s30 lh40 white'>
                                    {statistic.numTransactionPending || '--'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._handlePressCompleteOrder} style={{ flex: 1 }}>
                            <View className='column-center'>
                                <Text className='s12 bold whiteBlue'>{I18n.t("paid_order")}</Text>
                                <Text className='bold s30 lh40 white'>
                                    {statistic.numTransactionCompleted || '--'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
}

export default withNavigation(
    connect(state => ({
        numberUnreadNotification: numberUnreadNotificationSelector(state),
        statistic: statisticSelector(state),
        isEmployee: isEmployeeSelector(state)
    }), { logout, updateOrderTab })(Header)
);
