import React, { Component } from "react";
import { connect } from "react-redux";
import I18n from "~/src/I18n";
import LoadingModal from "~/src/components/LoadingModal";
import { Image, Alert, Linking, Platform, FlatList, AppState, TouchableOpacity, StatusBar } from 'react-native'
import {
    Container, View, Toolbar,
    Text, Switch
} from '~/src/themes/ThemeComponent'
import { getSetting, updateSetting } from '~/src/store/actions/setting'
import { enablePrintSelector } from '~/src/store/selectors/setting'
import { setEnablePrint } from '~/src/store/actions/setting'
import { generateHighlightText } from '~/src/utils'
import { textStyles } from '~/src/themes/Text'
import { BluetoothStatus } from 'react-native-bluetooth-status'
import BlePrintManager from '~/src/utils/BlePrintManager'
import EscPosEncoder from '~/src/utils/EscPosEncoder'
import { connectedBluetoothPrinterSelector } from '~/src/store/selectors/printer'
import OpenAppSettings from 'react-native-app-settings'
import Permissions from 'react-native-permissions'
import { PERMISSION_RESPONSE } from '~/src/constants'
import { saveBluetoothPrinter, printFromOrderScreen } from '~/src/store/actions/printer'
import { COLORS } from '~/src/themes/common'
import ToastUtils from '~/src/utils/ToastUtils'

class PrinterConfig extends Component {

    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            appState: AppState.currentState,
            devices: []
        }
        BlePrintManager.setup()
        this.encoder = new EscPosEncoder()
    }

    componentDidMount() {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }
        AppState.addEventListener('change', this._handleAppStateChange);
        const { enablePrint } = this.props
        if (enablePrint) {
            setTimeout(() => {
                this._checkBluetoothAndPermission()
            }, 300)
        }
    }

    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
            setTimeout(() => {
                this._checkBluetoothAndPermission()
            }, 300)
        }
        this.setState({ appState: nextAppState });
    };


    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this._stopScan()
    }

    _stopScan = () => {
        this.setState({ isScanning: false })
        BlePrintManager.getBleManager().stopDeviceScan()
    }


    _handleOkOpenGPS = () => {
        if (Platform.OS == 'ios') {
            Linking.openURL('app-settings:');
        } else {
            OpenAppSettings.open()
        }
    }

    _checkLocationPermission = () => {
        if (Platform.OS == 'android') {
            return new Promise((resolve, reject) => {
                Permissions.check('location', { type: 'whenInUse' })
                    .then(response => {
                        console.log('Permission Check', response)
                        if (response == PERMISSION_RESPONSE.DENIED) {
                            Alert.alert(
                                '',
                                I18n.t('hint_open_gps'),
                                [
                                    {
                                        text: I18n.t('cancel'),
                                        onPress: () => {

                                        },
                                        style: 'cancel',
                                    },
                                    { text: I18n.t('agree'), onPress: this._handleOkOpenGPS },
                                ],
                                { cancelable: false }
                            )
                        } else if (response != PERMISSION_RESPONSE.AUTHORIZED) {
                            console.log('Call request location')
                            return Permissions.request('location', { type: 'whenInUse' })
                        }
                        return PERMISSION_RESPONSE.AUTHORIZED
                    })
                    .then(requestResponse => {
                        console.log('requestResponse', requestResponse)
                        if (requestResponse == PERMISSION_RESPONSE.AUTHORIZED) {
                            resolve('Ok')
                        }
                        reject()
                    })
            })
        } else {
            return Promise.resolve('Ok')
        }
    }

    _scan = async () => {
        try {
            const checkLocatinPermissionResult = await this._checkLocationPermission()
            console.log('checkLocatinPermissionResult', checkLocatinPermissionResult)
            if (checkLocatinPermissionResult != 'Ok') return
            BlePrintManager.getBleManager().startDeviceScan(null, {
                allowDuplicates: false
            }, (error, device) => {
                if (error) {
                    console.log('Error', error)
                    // Handle error (scanning will be stopped automatically)
                    return
                }

                console.log('Device', device.id)
                const newDevices = [...this.state.devices]
                const deviceIndex = newDevices.find(item => item.id == device.id)
                if (!deviceIndex || deviceIndex < 0) {
                    newDevices.push(device)
                    this.setState({
                        devices: newDevices
                    })
                }
            })
        } catch (err) {
            console.log('Check location permission error', err)
        }
    }

    _handleOkOpenBluetooth = async () => {
        if (Platform.OS == 'android') {
            this.setState({ loading: true })
            const enableResult = await BluetoothStatus.enable()
            BlePrintManager.reset()
            this.setState({ loading: false })
            if (enableResult) {
                setTimeout(() => {
                    this._scan()
                }, 200)
            } else {

            }
        } else {
            BlePrintManager.reset()
            Linking.openURL('app-settings:root=Bluetooth');
        }
    }

    _handleCancelOpenBluetooth = () => {
        this.props.navigation.goBack()
    }

    _checkBluetoothAndPermission = async () => {
        const isBluetoothEnabled = await BluetoothStatus.state()
        console.log('isBluetoothEnabled', isBluetoothEnabled)
        if (!isBluetoothEnabled) {
            Alert.alert(
                '',
                I18n.t('hint_open_bluetooth'),
                [
                    {
                        text: I18n.t('cancel'),
                        onPress: this._handleCancelOpenBluetooth,
                        style: 'cancel',
                    },
                    { text: I18n.t('agree'), onPress: this._handleOkOpenBluetooth },
                ],
                { cancelable: false },
            );
        } else {
            this._scan()
        }
    }

    _handlePressSwitch = () => {
        const { setEnablePrint, enablePrint, updateSetting, saveBluetoothPrinter } = this.props
        if (!enablePrint) {
            this._checkBluetoothAndPermission()
        } else {
            saveBluetoothPrinter(false)
        }
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

    _renderGuide = () => {
        return (
            <View className='column-center'>

                <Image source={require('~/src/image/guide_arrow_up.png')}
                    style={{
                        height: 61,
                        width: 58,
                        position: 'absolute',
                        top: 20,
                        right: 50
                    }}
                />
                <Image source={require('~/src/image/cloud_sleep.png')}
                    style={{ height: 143, width: 250, marginTop: 87 }}
                />
                <View className='space12' />
                <Text className='center' style={{ paddingHorizontal: 42 }}>
                    <Text className='gray center bold'>{I18n.t('connect_to_printer')}</Text>
                    {"\n\n"}
                    <Text className='flex'>{generateHighlightText(I18n.t('connect_to_printer_hint'), { ...textStyles.default, ...textStyles.gray }, { ...textStyles.default, ...textStyles.cerulean, ...textStyles.bold })}</Text>
                </Text>
            </View>
        )
    }

    _handlePressDevice = async (item) => {
        console.log('Handle press device', item)
        this._stopScan()
        const { saveBluetoothPrinter, printFromOrderScreen } = this.props
        const printData = this.props.navigation.getParam('printData')
        const finishFunc = this.props.navigation.getParam('finishFunc')
        console.log('Print Data', printData)
        console.log('finishFunc', finishFunc)
        if (printData) {
            printFromOrderScreen({
                device: item,
                printData,
                finishFunc
            })
        } else {
            try {
                this.setState({ loading: true })
                const connectResult = await BlePrintManager.connect(item)
                this.setState({ loading: false })
                console.log('Connect Result', connectResult)
                saveBluetoothPrinter(item)
                ToastUtils.showSuccessToast(I18n.t('connect_device_success'))
            } catch (err) {
                this.setState({ loading: false })
                console.log('Conenct err', err)
                ToastUtils.showErrorToast(I18n.t('connect_device_fail'))
            }
        }

    }

    _renderDeviceItem = ({ item, index, section }) => {
        return (
            <TouchableOpacity onPress={() => this._handlePressDevice(item)}>
                <View className='row-start mh24 pv16 border-bottom2 white'>
                    <Text className='bold textBlack'>{item.name ? `${item.name} (${item.id})` : item.id}</Text>
                </View>
            </TouchableOpacity>
        )
    }



    _renderDeviceListHeader = () => {
        const { connectedDevices } = this.props
        console.log('connectedDevices', connectedDevices)
        return (
            <View>
                {!!(connectedDevices && connectedDevices.id) &&
                    <View>
                        <View className='space12 background' />
                        <View className='row-start'>
                            <View className='pv14 ph24 row-start' style={{ width: 171 }}>
                                <Text>{I18n.t('connecting_printer')}</Text>
                            </View>
                            <View className='pv14 ph24 row-start border-left2' style={{ width: 171 }}>
                                <Text className='bold cerulean'>{connectedDevices.id}</Text>
                            </View>
                        </View>
                    </View>
                }
                <View className='row-start ph24 pt16 pb8 background'>
                    <Text className='s12 gray'>{I18n.t('choose_printer_in_list')}</Text>
                </View>
                <View className='white row-start ph24 pv16 border-bottom2'>
                    <Text className='s12 textBlack'>{I18n.t('available_device')}</Text>
                </View>
            </View>

        )
    }

    render() {
        const { enablePrint } = this.props
        return (
            <Container>
                <View className='flex background'>
                    <LoadingModal visible={this.state.loading} />
                    <Toolbar
                        title={I18n.t('printer_config')}
                    />
                    <View className='space25' />
                    <View className='row-start ph24 pv14 white'>
                        <Text className='black flex'>{I18n.t('use_printer')}</Text>
                        <Switch enable={enablePrint}
                            onPress={this._handlePressSwitch}
                        />
                    </View>
                    {!enablePrint ?
                        this._renderGuide()
                        :
                        <FlatList
                            extraData={this.props}
                            renderItem={this._renderDeviceItem}
                            ListHeaderComponent={this._renderDeviceListHeader}
                            data={this.state.devices}
                            keyExtractor={(item, index) => item.id + '' + index}
                            style={{ backgroundColor: COLORS.WHITE }}
                            bounces={false}
                            ListFooterComponent={<View className='space50' />}
                        />

                    }
                </View>

            </Container>
        );
    }
}

export default connect(state => ({
    enablePrint: enablePrintSelector(state),
    connectedDevices: connectedBluetoothPrinterSelector(state)
}),
    {
        getSetting, setEnablePrint, updateSetting,
        saveBluetoothPrinter, printFromOrderScreen
    }
)(PrinterConfig)
