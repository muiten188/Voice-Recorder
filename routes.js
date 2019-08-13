// Screens
import Home from "~/src/screens/Home";
import {
    createStackNavigator,
    createAppContainer,
} from "react-navigation";

import { Platform, Animated, Easing } from "react-native";


const AppNavigator = createStackNavigator(
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
        initialRouteName: "Home",
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
