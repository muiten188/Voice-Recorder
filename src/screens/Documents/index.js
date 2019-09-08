import React, { Component } from "react"
import { View, Text, GradientToolbar } from "~/src/themes/ThemeComponent";
import I18n from '~/src/I18n'

export default class Documents extends Component {
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
                    onPressLeft={this._handlePressLeftMenu}
                    leftIcon={require('~/src/image/menu.png')}
                    title={I18n.t('document_title')}
                />
                <Text>Documents</Text>

            </View>
        );
    }
}