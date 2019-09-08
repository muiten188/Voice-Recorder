import React, { Component } from "react"
import { GradientToolbar, View, Text } from "~/src/themes/ThemeComponent";
import I18n from '~/src/I18n'

export default class Settings extends Component {
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
                    title={I18n.t('setting_title')}
                    onPressLeft={this._handlePressLeftMenu}
                />
                <Text>Settings</Text>
            </View>

        );
    }
}