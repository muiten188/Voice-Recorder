import React, { Component } from "react"
import { GradientToolbar, View, DropdownInput } from "~/src/themes/ThemeComponent";
import { ScrollView } from 'react-native'
import I18n from '~/src/I18n'

const CHANEL_DATA = [
    { value: 1, name: 'Mono chanel' },
    { value: 2, name: 'Stereo chanel' }
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
        if (item.value != this.state.chanel) {
            this.setState({ chanel: item.value })
        }
    }

    render() {
        return (
            <View className="flex white">
                <GradientToolbar
                    leftIcon={require('~/src/image/menu.png')}
                    title={I18n.t('setting_title')}
                    onPressLeft={this._handlePressLeftMenu}
                    avatar='https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fewedit.files.wordpress.com%2F2016%2F10%2Fdr-strange.jpg&w=400&c=sc&poi=face&q=85'
                />
                <ScrollView>
                    <View className='space16' />
                    <View className='ph16 pv12 white'>
                        <DropdownInput
                            label={I18n.t('chanel')}
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