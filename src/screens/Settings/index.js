import React, { Component } from "react"
import { GradientToolbar, View, Text } from "~/src/themes/ThemeComponent";
import I18n from '~/src/I18n'

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        return (

                <View className="flex background">
                    <GradientToolbar 
                        title={I18n.t('setting_title')}
                    />
                    <Text>Settings</Text>
                </View>

        );
    }
}