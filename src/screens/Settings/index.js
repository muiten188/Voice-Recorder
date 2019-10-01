import React, { Component } from "react"
import { GradientToolbar, View, DropdownInput, ScrollView } from "~/src/themes/ThemeComponent";
import I18n from '~/src/I18n'

const CHANEL_DATA = [
    { id: 1, name: 'Mono chanel' },
    { id: 2, name: 'Stereo chanel' }
]
export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chanel: 1
        }
    }

    _handlePressLeftMenu = () => {
        this.props.navigation.openDrawer()
    }

    _handleChooseChanel = (item) => {
        if (item.id != this.state.chanel) {
            this.setState({ chanel: item.id })
        }
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
                <ScrollView>
                    <View>
                        <DropdownInput
                            value={this.state.chanel}
                            values={CHANEL_DATA}
                            popupTitle={I18n.t('choose')}
                            onPressItem={this._handleChooseChanel}
                        />
                    </View>
                </ScrollView>
            </View>

        );
    }
}