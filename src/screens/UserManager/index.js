import React, { Component } from "react"
import { View, Text, GradientToolbar } from "~/src/themes/ThemeComponent";
import I18n from '~/src/I18n'

export default class UserManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    _handlePressLeftMenu = () => {
        this.props.navigation.openDrawer()
    }


    render() {
        return (
            <View className="flex background">
                <GradientToolbar
                    leftIcon={require('~/src/image/menu.png')}
                    title={I18n.t('user_manager_title')}
                    onPressLeft={this._handlePressLeftMenu}
                />
                <Text>User Manager</Text>

            </View>

        );
    }
}