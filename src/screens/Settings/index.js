import React, { Component } from "react"
import { GradientToolbar, View, DropdownInput } from "~/src/themes/ThemeComponent";
import { ScrollView } from 'react-native'
import I18n from '~/src/I18n'
import { updateSetting } from '~/src/store/actions/setting'
import { settingSelector } from '~/src/store/selectors/setting'
import { connect } from 'react-redux'

const CHANEL_DATA = [
    { value: 1, name: 'Mono chanel' },
    { value: 2, name: 'Stereo chanel' }
]

const SAMPLE_RATE_DATA = [
    { value: 8000, name: '8,000 Hz' },
    { value: 11025, name: '11,025 Hz' },
    { value: 22050, name: '22,050 Hz' },
    { value: 32000, name: '32,000 Hz' },
    { value: 44100, name: '44,100 Hz' },
    { value: 48000, name: '48,000 Hz' },
]

const BIT_RATE_DATA = [
    { value: 64000, name: '64 kbps' },
    { value: 128000, name: '128 kbps' },
    { value: 160000, name: '160 kbps' },
    { value: 192000, name: '192 kbps' },
    { value: 224000, name: '224 kbps' },
    { value: 256000, name: '256 kbps' },
    { value: 320000, name: '320 kbps' },
]
class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    _handlePressLeftMenu = () => {
        this.props.navigation.openDrawer()
    }

    _handleChooseChanel = (value) => {
        const { setting, updateSetting } = this.props
        if (value != setting.chanel) {
            updateSetting({ chanel: value })
        }
    }

    _handleChooseSampleRate = (value) => {
        const { setting, updateSetting } = this.props
        if (value != setting.sampleRate) {
            updateSetting({ sampleRate: value })
        }
    }

    _handleChangeDefaultName = (text) => {
        const { updateSetting } = this.props
        updateSetting({ defaultName: text })
    }

    _handleChooseBitRate = (value) => {
        const { setting, updateSetting } = this.props
        if (value != setting.bitRate) {
            updateSetting({ bitRate: value })
        }
    }

    render() {
        const { setting } = this.props
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
                        {/* <Text className='bold s15 mb8'>{I18n.t('phone')}</Text>
                        <TextInput
                            label={I18n.t('mail')}
                            value={this.state.mail}
                            onChangeText={text => this.setState({ mail: text })}
                        /> */}
                        <TextInput
                            label={I18n.t('default_name')}
                            value={setting.defaultName}
                            onChangeText={this._handleChangeDefaultName}
                        />
                    </View>
                    <View className='ph16 pv12 white'>
                        <DropdownInput
                            label={I18n.t('chanel')}
                            value={setting.chanel}
                            values={CHANEL_DATA}
                            popupTitle={I18n.t('choose')}
                            onPressItem={this._handleChooseChanel}
                        />
                    </View>
                    <View className='ph16 pv12 white'>
                        <DropdownInput
                            label={I18n.t('sample_rate')}
                            value={setting.sampleRate}
                            values={SAMPLE_RATE_DATA}
                            popupTitle={I18n.t('choose')}
                            onPressItem={this._handleChooseSampleRate}
                        />
                    </View>
                    <View className='ph16 pv12 white'>
                        <DropdownInput
                            label={I18n.t('bit_rate')}
                            value={setting.bitRate}
                            values={BIT_RATE_DATA}
                            popupTitle={I18n.t('choose')}
                            onPressItem={this._handleChooseBitRate}
                        />
                    </View>
                </ScrollView>
            </View>

        );
    }
}

export default connect(state => ({
    setting: settingSelector(state),
}), {
    updateSetting
})(Settings)