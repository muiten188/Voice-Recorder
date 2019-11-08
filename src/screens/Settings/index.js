import React, { Component } from "react"
import { GradientToolbar, View, DropdownInput } from "~/src/themes/ThemeComponent";
import { ScrollView } from 'react-native'
import I18n from '~/src/I18n'
import { updateSetting } from '~/src/store/actions/setting'
import { settingSelector } from '~/src/store/selectors/setting'
import { connect } from 'react-redux'
import APIManager from '~/src/store/api/APIManager'

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
            ip: ''
        }
        this.willFocusListener = props.navigation.addListener(
            "willFocus",
            this.componentWillFocus
        )
    }

    componentWillFocus = () => {
        APIManager.getInstance()
            .then(apiConfig => {
                console.log('API config', apiConfig)
                this.setState({ ip: apiConfig.IP })
            })
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

    _handleChangeIp = (text) => {
        this.setState({ ip: text })
    }

    _handleIpBlur = () => {
        console.log('_handleIpBlur', this.state.ip)
        APIManager.saveIp(this.state.ip)
    }

    render() {
        const { setting } = this.props
        return (
            <View className="flex white">
                <GradientToolbar
                    leftIcon={require('~/src/image/menu.png')}
                    title={I18n.t('setting_title')}
                    onPressLeft={this._handlePressLeftMenu}
                    avatar={require('~/src/image/default_avatar.jpg')}
                />
                <ScrollView>
                    <View className='space16' />
                    <View className='ph16 pv12 white'>
                        <TextInput
                            label={I18n.t('default_name')}
                            value={setting.defaultName}
                            onChangeText={this._handleChangeDefaultName}
                        />
                    </View>

                    <View className='ph16 pv12 white'>
                        <TextInput
                            label={I18n.t('ip_address')}
                            value={this.state.ip}
                            onChangeText={this._handleChangeIp}
                            keyboardType={'numeric'}
                            onBlur={this._handleIpBlur}
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