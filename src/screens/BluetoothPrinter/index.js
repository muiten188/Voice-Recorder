import React, { Component } from "react";
import {
    SafeAreaView,
    View,
    SectionList,
    Alert,
    Platform,
    Linking,
    AppState
} from "react-native";
import { Text, Button, TouchableRipple } from 'react-native-paper'
import { COLORS, SURFACE_STYLES, TEXT_STYLES } from "~/src/themes/common";
import I18n from "~/src/I18n";
import BlePrintManager from '~/src/utils/BlePrintManager'
import EscPosEncoder from '~/src/utils/EscPosEncoder'
import { formatSpaces, showToast } from '~/src/utils'
import { BluetoothStatus } from 'react-native-bluetooth-status'
import LoadingModal from '~/src/components/LoadingModal'
import Permissions from 'react-native-permissions'
import { PERMISSION_RESPONSE } from '~/src/constants'
import { saveBluetoothPrinter, printFromOrderScreen } from '~/src/store/actions/printer'
import { connect } from 'react-redux'
import { connectedBluetoothPrinterSelector } from '~/src/store/selectors/printer'
import OpenAppSettings from 'react-native-app-settings'

class BluetoothPrinter extends Component {
    static navigationOptions = {
        headerTitle: I18n.t('printer_config'),
    }

    constructor(props) {
        super(props)
        this.state = {
            isScanning: true,
            devices: [
                { title: I18n.t('paired_device'), data: props.connectedDevices || [] },
                { title: I18n.t('available_device'), data: [] },
            ],
            loading: false,
            appState: AppState.currentState,
        }
        BlePrintManager.setup()
        this.encoder = new EscPosEncoder()
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
                const availableDevice = this.state.devices[1].data
                const deviceIndex = availableDevice.find(item => item.id == device.id)
                console.log('deviceIndex', deviceIndex)
                if (!deviceIndex || deviceIndex < 0) {
                    const newAvailableDevice = [...availableDevice]
                    newAvailableDevice.push(device)
                    const newDevices = [...this.state.devices]
                    newDevices[1] = {
                        ...newDevices[1],
                        data: newAvailableDevice
                    }
                    this.setState({
                        devices: newDevices
                    })
                }
            })
        } catch (err) {
            console.log('Check location permission error', err)
        }
    }

    _stopScan = () => {
        this.setState({ isScanning: false })
        BlePrintManager.getBleManager().stopDeviceScan()
    }

    _handleCancelOpenBluetooth = () => {
        this.props.navigation.goBack()
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

    componentDidMount = async () => {
        AppState.addEventListener('change', this._handleAppStateChange);
        setTimeout(() => {
            this._checkBluetoothAndPermission()
        }, 300)
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

    _handlePressScanAction = () => {
        if (this.state.isScanning) {
            this._stopScan()
        } else {
            this.setState({ isScanning: true })
            this._scan()
        }
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
                showToast(I18n.t('connect_device_success'))
            } catch (err) {
                this.setState({ loading: false })
                console.log('Conenct err', err)
                showToast(I18n.t('connect_device_fail'))
            }
        }

    }

    componentDidUpdate(prevProps) {
        if (prevProps.connectedDevices != this.props.connectedDevices) {
            console.log('componentDidUpdate connectedDevices')
            const newDevices = [...this.state.devices]
            newDevices[0] = {
                ...newDevices[0],
                data: this.props.connectedDevices
            }
            this.setState({ devices: newDevices })
        }
    }

    _renderDeviceItem = ({ item, index, section }) => {
        return (
            <TouchableRipple onPress={() => this._handlePressDevice(item)}>
                <View style={[SURFACE_STYLES.pv16]}>
                    <Text>{item.name ? `${item.name} (${item.id})` : item.id}</Text>
                </View>
            </TouchableRipple>
        )
    }

    _renderSectionHeader = ({ section: { title } }) => (
        <View style={[SURFACE_STYLES.pv16, SURFACE_STYLES.borderBottom, { backgroundColor: COLORS.WHITE }]}>
            <Text style={[TEXT_STYLES.black, TEXT_STYLES.bold]}>{title}</Text>
        </View>
    )

    _renderSectionFooter = ({ section }) => {
        if (section.data.length == 0) {
            return (
                <View style={[SURFACE_STYLES.pv16]}>
                    <Text style={{ color: COLORS.TEXT_GRAY }}>{I18n.t('no_device')}</Text>
                </View>
            )
        }
    }

    render() {
        console.log('State', this.state)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <LoadingModal visible={this.state.loading} />
                <View style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
                    <View style={{ paddingHorizontal: 10 }}>

                        <SectionList
                            renderItem={this._renderDeviceItem}
                            renderSectionHeader={this._renderSectionHeader}
                            renderSectionFooter={this._renderSectionFooter}
                            sections={this.state.devices}
                            keyExtractor={(item, index) => item.id + '' + index}
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

export default connect(state => ({
    connectedDevices: connectedBluetoothPrinterSelector(state)
}), { saveBluetoothPrinter, printFromOrderScreen })(BluetoothPrinter)