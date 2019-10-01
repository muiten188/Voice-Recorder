import React, { Component } from "react";
import { ImageBackground, Image, Platform } from 'react-native'
import { View, Text, TouchableOpacityHitSlop, PopupConfirm, TextInputBase as TextInput } from "~/src/themes/ThemeComponent";
import Permissions from 'react-native-permissions'
import { PERMISSION_RESPONSE, FOREGROUND_NOTIFICATION_ID } from '~/src/constants'
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { DEVICE_WIDTH, COLORS } from "~/src/themes/common";
import { scaleHeight, getFontStyle, getRecordTimeString, startForegroundService, stopForegroundService } from '~/src/utils'
import styles from './styles'
import I18n from '~/src/I18n'
import ToastUtils from '~/src/utils/ToastUtils'
import moment from 'moment'
import { addRecord } from '~/src/store/actions/localRecord'
import { uploadMeetingRecord } from '~/src/store/actions/meeting'
import { settingSelector } from '~/src/store/selectors/setting'
import { connect } from 'react-redux'
import RNFetchBlob from 'rn-fetch-blob'

const RECORD_STATUS = {
    NOT_START: 'NOT_START',
    RECORDING: 'RECORDING',
    PAUSED: 'PAUSED',
    STOPPED: 'STOPPED'
}

class Record extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null,
        gesturesEnabled: false,
    }

    constructor(props) {
        super(props);
        // started / paused / stopped / recording
        this.state = {
            recording: RECORD_STATUS.NOT_START,
            recordTime: 0,
            permissionMicrophone: '',
            permissionStorage: '',
            fileName: '',
            fileNameInput: ''
        }
        this.fileName = ''
        this.audioPath = ''
    }

    _prepareRecordingPath = (audioPath) => {
        const { setting } = this.props
        console.log('Prepare', {
            SampleRate: setting.sampleRate,
            Channels: setting.chanel,
            AudioQuality: "High",
            AudioEncoding: "aac",
            AudioEncodingBitRate: setting.bitRate
        })
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: setting.sampleRate,
            Channels: setting.chanel,
            AudioQuality: "High",
            AudioEncoding: "aac",
            AudioEncodingBitRate: setting.bitRate
        });
    }

    componentDidMount() {
        console.log('AudioUtils', AudioUtils)
        if (Platform.OS == 'ios') {
            this.setState({
                permissionMicrophone: PERMISSION_RESPONSE.AUTHORIZED,
                permissionStorage: PERMISSION_RESPONSE.AUTHORIZED
            })
        } else {
            Permissions.checkMultiple(['microphone', 'storage'], { type: 'always' }).then(response => {
                console.log('Check res', response)
                this.setState({
                    permissionMicrophone: response['microphone'],
                    permissionStorage: response['storage']
                })
            })
        }

    }

    _checkPermission = () => {
        return new Promise((resolve, reject) => {
            if (Platform.OS == 'ios') {
                resolve('Permisson accept')
            }
            Permissions.request('microphone', { type: 'always' }).then(responseMicrophone => {
                console.log('Request microphone res', responseMicrophone)
                Permissions.request('storage', { type: 'always' }).then(responseStorage => {
                    console.log('Request storage res', responseStorage)
                    this.setState({
                        permissionMicrophone: responseMicrophone,
                        permissionStorage: responseStorage
                    })
                    if (responseMicrophone != PERMISSION_RESPONSE.AUTHORIZED
                        || responseStorage != PERMISSION_RESPONSE.AUTHORIZED) {
                        reject('Permission reject')
                    }
                    resolve('Permisson accept')
                })
            })
        })
    }

    _handlePressStart = () => {
        // this.setState({ recording: RECORD_STATUS.RECORDING })
        if (this.state.permissionMicrophone != PERMISSION_RESPONSE.AUTHORIZED
            || this.state.permissionStorage != PERMISSION_RESPONSE.AUTHORIZED
        ) {
            this._checkPermission()
                .then(() => {
                    this._startRecord()
                })
                .catch((error) => {
                    console.log('_checkPermission catch', error)
                })
        } else {
            this._startRecord()
        }
    }

    _handlePressPauseResume = () => {
        if (this.state.recording == RECORD_STATUS.RECORDING) {
            this._pauseRecord()
        } else {
            this._resumeRecord()
        }
    }

    _pauseRecord = async () => {
        try {
            const filePath = await AudioRecorder.pauseRecording();
            console.log('_pauseRecord filePath', filePath)
            this.setState({ recording: RECORD_STATUS.PAUSED })
        } catch (error) {
            console.error(error);
        }
    }

    _resumeRecord = async () => {
        try {
            await AudioRecorder.resumeRecording();
            this.setState({ recording: RECORD_STATUS.RECORDING })
        } catch (error) {
            console.error(error);
        }
    }

    _getBasePath = () => {
        if (Platform.OS == 'ios') {
            return AudioUtils.DocumentDirectoryPath
        }
        return AudioUtils.DownloadsDirectoryPath
    }

    _startRecord = async () => {
        const { setting } = this.props
        const audioId = moment().format('YYYYMMDDHHmmss')
        this.fileName = `${setting.defaultName} ${audioId}`
        this.audioPath = `${this._getBasePath()}/${this.fileName}.aac`
        console.log('Audio path', this.audioPath)
        this._prepareRecordingPath(this.audioPath);
        AudioRecorder.onProgress = (data) => {
            this.setState({ recordTime: Math.floor(data.currentTime) });
        };
        AudioRecorder.onFinished = (data) => {
            // Android callback comes in the form of a promise instead.
            if (Platform.OS === 'ios') {
                console.log('Finished recording ios', data)
                // this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
            }
        };
        try {
            await startForegroundService(FOREGROUND_NOTIFICATION_ID.RECORD, I18n.t('recording'))
            const filePath = await AudioRecorder.startRecording()
            console.log('_startRecord filePath', filePath)
            this.setState({ recording: RECORD_STATUS.RECORDING })
        } catch (error) {
            console.error(error);
        }
    }

    _stopRecord = async () => {
        try {
            const filePath = await AudioRecorder.stopRecording();
            stopForegroundService()
            this.setState({ recording: RECORD_STATUS.STOPPED })
            console.log('_stopRecord filePath', filePath)
            this.setState({ fileNameInput: this.fileName }, () => {
                this.popupSave && this.popupSave.open()
            })
        } catch (error) {
            console.error(error);
        }
    }

    _handlePressCancel = async () => {
        if (this.state.recording != RECORD_STATUS.NOT_START) {
            const filePath = await AudioRecorder.stopRecording()
            stopForegroundService()
            console.log('_handlePressCancel', filePath)
        }
        this.props.navigation.goBack()
    }

    _handlePressDone = async () => {
        await this._stopRecord()
    }

    _renderActionBlock = () => {
        if (this.state.recording == RECORD_STATUS.NOT_START) {
            return (
                <View style={styles.actionBlock}>
                    <TouchableOpacityHitSlop onPress={this._handlePressCancel}>
                        <View className='row-start'>
                            <Image source={require('~/src/image/cancel2.png')} style={{ width: 9, height: 15, marginRight: 4 }} />
                            <Text className='s13 textBlack'>{I18n.t('cancel')}</Text>
                        </View>
                    </TouchableOpacityHitSlop>

                    <TouchableOpacityHitSlop onPress={this._handlePressStart}>
                        <View className='column-center'>
                            <Image
                                source={require('~/src/image/recording2.png')}
                                style={styles.iconContainerCenter}
                            />
                            <View className='space8' />
                            <Text className={'green s14'}>{I18n.t('start')}</Text>
                        </View>

                    </TouchableOpacityHitSlop>
                    <View className='row-start' style={{ opacity: 0 }}>
                        <Image source={require('~/src/image/done.png')} style={{ width: 15, height: 15, marginRight: 6 }} />
                        <Text className='s13 green'>{I18n.t('done')}</Text>
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.actionBlock}>
                <TouchableOpacityHitSlop onPress={this._handlePressCancel}>
                    <View className='row-start'>
                        <Image source={require('~/src/image/cancel.png')} style={{ width: 17, height: 17, marginRight: 4 }} />
                        <Text className='s13 textBlack'>{I18n.t('cancel')}</Text>
                    </View>
                </TouchableOpacityHitSlop>

                <TouchableOpacityHitSlop onPress={this._handlePressPauseResume}>
                    <View className='column-center'>
                        <Image source={this.state.recording == RECORD_STATUS.RECORDING ? require('~/src/image/pause.png') : require('~/src/image/recording2.png')}
                            style={styles.iconContainerCenter}
                        />
                        <View className='space8' />
                        {this.state.recording == RECORD_STATUS.RECORDING ?
                            <Text className='error s14'>{I18n.t('pause')}</Text>
                            :
                            <Text className={'green s14'}>{I18n.t('continue')}</Text>
                        }

                    </View>

                </TouchableOpacityHitSlop>
                <TouchableOpacityHitSlop onPress={this._handlePressDone}>
                    <View className='row-start'>
                        <Image source={require('~/src/image/done.png')} style={{ width: 15, height: 15, marginRight: 6 }} />
                        <Text className='s13 green'>{I18n.t('done')}</Text>
                    </View>
                </TouchableOpacityHitSlop>
            </View>
        )

    }

    _onChangeFileName = (text) => {
        this.setState({ fileNameInput: text })
    }

    _handleYesFileName = async () => {
        try {
            console.log('File name input', this.state.fileNameInput)
            console.log('Origin filename', this.fileName)
            const originPath = `${this._getBasePath()}/${this.fileName}.aac`
            const newPath = `${this._getBasePath()}/${this.state.fileNameInput}.aac`
            if (this.fileName != this.state.fileNameInput) {
                await RNFetchBlob.fs.mv(originPath, newPath)
            }
            const { addRecord, uploadMeetingRecord } = this.props
            addRecord(newPath)
            ToastUtils.showSuccessToast(`Đã lưu tệp ghi âm ${newPath}`)
            setTimeout(() => {
                uploadMeetingRecord()
            }, 100)
            this.props.navigation.goBack()
        } catch (err) {
            console.log('_handleYesFileName err', err)
        }
    }

    _handlePressNoFileName = () => {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View className="flex background">
                <PopupConfirm
                    animationType="none"
                    title={I18n.t('save_record')}
                    ref={ref => this.popupSave = ref}
                    onPressYes={this._handleYesFileName}
                    onPressNo={this._handlePressNoFileName}
                >
                    <View className='pv16 row-start'>
                        <TextInput
                            value={this.state.fileNameInput}
                            onChangeText={this._onChangeFileName}
                            style={styles.fileNameInput}
                            onPressYes={this._handleYesFileName}
                        />
                    </View>
                </PopupConfirm>
                <ImageBackground
                    source={require('~/src/image/bg_recording.png')}
                    style={{ width: DEVICE_WIDTH, height: scaleHeight(499) }}
                    resizeMode={'cover'}
                >
                    <View style={{ height: scaleHeight(120) }} />
                    <View className='column-center'>
                        <Text className='white s24 bold'>Recording</Text>
                        <View style={{ height: scaleHeight(44) }} />
                        <Text className='white s44' style={getFontStyle('thin')}>{getRecordTimeString(this.state.recordTime)}</Text>
                    </View>

                </ImageBackground>
                <View className='flex white column-end'>
                    {this._renderActionBlock()}
                </View>
            </View>
        );
    }
}
export default connect(state => ({
    setting: settingSelector(state)
}), { addRecord, uploadMeetingRecord })(Record)
