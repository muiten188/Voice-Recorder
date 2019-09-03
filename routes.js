// Screens

import {
    createStackNavigator,
    createAppContainer,
    createDrawerNavigator
} from "react-navigation";

import { Platform, Animated, Easing } from "react-native";
import { COLORS } from "~/src/themes/common";
import Drawer from '~/src/components/Drawer'
import Home from "~/src/screens/Home";
import Documents from '~/src/screens/Documents'
import UserManager from '~/src/screens/UserManager'
import Settings from '~/src/screens/Settings'


import Login from '~/src/screens/Login'
import Intro from '~/src/screens/Intro'
import Record from '~/src/screens/Record'

const DrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: Home,
        },
        Documents: {
            screen: Documents,
        },
        UserManager: {
            screen: UserManager,
        },
        Settings: {
            screen: Settings,
        },
    },
    {
        hideStatusBar: true,
        drawerBackgroundColor: COLORS.WHITE,
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        contentOptions: {
            activeTintColor: '#fff',
            activeBackgroundColor: '#6b52ae',
        },
        contentComponent: Drawer,
    }
);

const AppNavigator = createStackNavigator(
    {
        Drawer: {
            screen: DrawerNavigator,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        Record: {
            screen: Record,
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
        Intro: {
            screen: Intro,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
    },
    {
        initialRouteName: "Drawer",
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

export default (AppContainer = createAppContainer(AppNavigator));
