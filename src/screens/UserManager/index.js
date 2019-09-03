import React, { Component } from "react"
import { View, Text, GradientToolbar } from "~/src/themes/ThemeComponent";
import I18n from '~/src/I18n'

export default class UserManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        return (
            <View className="flex background">
                <GradientToolbar
                    title={I18n.t('user_manager_title')}
                />
                <Text>User Manager</Text>

            </View>

        );
    }
}