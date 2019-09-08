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
                    avatar='https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fewedit.files.wordpress.com%2F2016%2F10%2Fdr-strange.jpg&w=400&c=sc&poi=face&q=85'
                />
                <Text>Settings</Text>
            </View>

        );
    }
}