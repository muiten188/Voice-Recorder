// Screens
import Home from "~/src/screens/Home";
import {
    createStackNavigator,
    createAppContainer,
    createDrawerNavigator
} from "react-navigation";

import { Platform, Animated, Easing } from "react-native";
import { COLORS } from "~/src/themesnew/common";
import Drawer from '~/src/components/Drawer'

const DrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: () => ({
                headerMode: "none",
                header: null
            })
        },
    },
    {
        hideStatusBar: false,
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
