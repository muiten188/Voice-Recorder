import React, { Component } from "react";
import { View, Text, Platform } from "react-native";
import {
    createMaterialTopTabNavigator,
    createAppContainer,
    withNavigation,
    createStackNavigator
} from "react-navigation";
import I18n from "~/src/I18n";

import { COLORS } from "~/src/themes/common";
import CostManage from "~/src/screens/CostManage";
import DebtManage from "~/src/screens/DebtManage";
import Chart from "~/src/screens/Chart";

export const Stack = createMaterialTopTabNavigator(
    {
        CostManage: {
            screen: CostManage,
            navigationOptions: {
                // headerTitleStyle: { marginTop: 50 },
                tabBarLabel: ({ focused }) =>
                    focused ? (
                        <Text style={[styles.label, { color: COLORS.PRIMARY, fontWeight: "bold" }]}>
                            {I18n.t("cost_manage_title")}
                        </Text>
                    ) : (
                            <Text style={[styles.label, { color: COLORS.BACKDROP }]}>
                                {I18n.t("cost_manage_title")}
                            </Text>
                        )
            }
        },
        DebtManage: {
            screen: DebtManage,
            navigationOptions: {
                // headerTitleStyle: { marginRight: "200" },
                tabBarLabel: ({ focused }) =>
                    focused ? (
                        <Text style={[styles.label, { color: COLORS.PRIMARY, fontWeight: "bold" }]}>
                            {I18n.t("debt_manage_title").toUpperCase()}
                        </Text>
                    ) : (
                            <Text style={[styles.label, { color: COLORS.BACKDROP }]}>
                                {I18n.t("debt_manage_title").toUpperCase()}
                            </Text>
                        )
            }
        },
        Chart: {
            screen: Chart,
            navigationOptions: {

                tabBarLabel: ({ focused }) =>
                    focused ? (
                        <Text style={[styles.label, { color: COLORS.PRIMARY, fontWeight: "bold" }]}>
                            {I18n.t("report").toUpperCase()}
                        </Text>
                    ) : (
                            <Text
                                style={[
                                    styles.label,
                                    { color: COLORS.BACKDROP }
                                ]}
                            >
                                {I18n.t("report").toUpperCase()}
                            </Text>
                        )
            }
        }
    },
    {
        tabBarPosition: "top",
        animationEnabled: false,
        lazy: true,
        swipeEnabled: false,
        barStyle: {
            backgroundColor: COLORS.WHITE,
            borderTopWidth: Platform.OS == "ios" ? 0.5 : 0,
            borderTopColor:
                Platform.OS == "ios" ? "rgba(0, 0, 0, 0.2)" : "transparent",
            height: 56,
            overflow: "hidden"
        },
        tabBarOptions: {
            indicatorStyle: { backgroundColor: COLORS.PRIMARY, height: 2 },
            style: {
                backgroundColor: COLORS.WHITE,
            },
            tabStyle: {
                height: 56,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            },
            labelStyle: {
                fontSize: 12,
                color: COLORS.BACKGROUND
            }
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
        lineHeight: 14,
        // marginTop: 30,
        // marginBottom: 10
    }
};
export default createAppContainer(Stack);
