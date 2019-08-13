import React, { Component } from "react";
import { Platform, StatusBar } from "react-native";
import AccountantNavigator from "./AccountantNavigator";
import { Container } from "~/src/themesnew/ThemeComponent";
import { COLORS } from "~/src/themesnew/common";

export default class Accountant extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.didFocusListener = props.navigation.addListener(
            "didFocus",
            this.componentDidFocus
        );
    }
    static router = AccountantNavigator.router;
    static navigationOptions = AccountantNavigator.navigationOptions;

    componentDidFocus = async () => {
        console.log("Accountant Did Focus");
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }

    };

    render() {
        return (
            <Container>
                <AccountantNavigator navigation={this.props.navigation} />
            </Container>
        );
    }
}
