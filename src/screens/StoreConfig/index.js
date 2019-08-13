import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text, Switch } from 'react-native-paper'
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import I18n from '~/src/I18n'
import { getSetting, updateSetting } from '~/src/store/actions/setting'
import { connect } from 'react-redux'
import { enablePrintSelector } from '~/src/store/selectors/setting'
import { setEnablePrint } from '~/src/store/actions/setting'

class StoreConfig extends Component {
    static navigationOptions = {
        headerTitle: I18n.t('config_store'),
    }

    constructor(props) {
        super(props)
        this.state = {
            usePrinter: false
        }
    }

    componentDidMount() {
        const { getSetting } = this.props
        getSetting()
    }

    _handleChangeUsePrint = () => {
        const { setEnablePrint, enablePrint, updateSetting } = this.props
        const enablePrintUpdated = !enablePrint
        setEnablePrint(enablePrintUpdated)
        updateSetting([
            {
                name: "ENABLE_PRINT",
                value: enablePrintUpdated.toString()
            }
        ], (err, data) => {
            console.log('updateSetting err', err)
            console.log('updateSetting data', data)
        })
    }

    render() {
        const { enablePrint } = this.props
        return (
            <SafeAreaView style={[SURFACE_STYLES.flex, { backgroundColor: COLORS.WHITE }]}>
                <View style={[SURFACE_STYLES.flex, SURFACE_STYLES.pd8]}>
                    <View style={[SURFACE_STYLES.rowStart, SURFACE_STYLES.pv16, SURFACE_STYLES.borderBottom]}>
                        <Text style={SURFACE_STYLES.flex}>{I18n.t('use_printer')}</Text>
                        <Switch
                            value={enablePrint}
                            onValueChange={this._handleChangeUsePrint}
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}


export default connect(state => ({
    enablePrint: enablePrintSelector(state)
}),
    {
        getSetting, setEnablePrint, updateSetting
    }
)(StoreConfig)