// Screens

import {
    createStackNavigator,
    createAppContainer,
    createDrawerNavigator
} from "react-navigation";

import { Platform, Animated, Easing } from "react-native";
import { COLORS } from "~/src/themes/common";

import AuthLoading from '~/src/screens/AuthLoading'
// Drawer screens
import Drawer from '~/src/components/Drawer'
import Home from "~/src/screens/Home";
import Documents from '~/src/screens/Documents'
import UserManager from '~/src/screens/UserManager'
import Settings from '~/src/screens/Settings'
// Stack screens
import Login from '~/src/screens/Login'
import Intro from '~/src/screens/Intro'
import Record from '~/src/screens/Record'
import Profile from '~/src/screens/Profile'
import ChangePassword from '~/src/screens/ChangePassword'
import Player from '~/src/screens/Player'
import UserInfo from '~/src/screens/UserInfo'
import Files from '~/src/screens/Files'


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
        Files: {
            screen: Files
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
        AuthLoading,
        Drawer: {
            screen: DrawerNavigator,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
        Record,
        Login,
        Intro,
        Profile,
        ChangePassword,
        Player,
        UserInfo
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

export default (AppContainer = createAppContainer(AppNavigator));
