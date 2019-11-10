import React, { Component } from "react";
import { ImageBackground, Image, Platform, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { View, Text, TouchableOpacityHitSlop, SmallButton, TextInputBase as TextInput } from "~/src/themes/ThemeComponent";
import Permissions from 'react-native-permissions'
import { PERMISSION_RESPONSE, FOREGROUND_NOTIFICATION_ID } from '~/src/constants'
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { DEVICE_WIDTH, COLORS } from "~/src/themes/common";
import { scaleHeight, getFontStyle, getRecordTimeString, startForegroundService, stopForegroundService, prepareSaveFilePath } from '~/src/utils'
import styles from './styles'
import I18n from '~/src/I18n'
import ToastUtils from '~/src/utils/ToastUtils'
import moment from 'moment'
import { addRecord } from '~/src/store/actions/localRecord'
import { uploadMeetingRecord } from '~/src/store/actions/meeting'
import { settingSelector } from '~/src/store/selectors/setting'
import { connect } from 'react-redux'
import RNFetchBlob from 'rn-fetch-blob'
import { userInfoSelector } from '~/src/store/selectors/auth'
import { meetingListSelector, categorySelector } from '~/src/store/selectors/meeting'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

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
            fileNameInput: '',
            showingPopupSave: false,
            selectedCategory: ''
        }
        this.fileName = ''
        this.audioPath = ''
        this.basePath = ''
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
            Permissions.check('microphone', { type: 'always' }).then(response => {
                console.log('Check res microphone ios', response)
                this.setState({
                    permissionMicrophone: response,
                    permissionStorage: PERMISSION_RESPONSE.AUTHORIZED
                })
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
                console.log('Requesting iOS')
                Permissions.request('microphone', { type: 'always' }).then(responseMicrophone => {
                    console.log('Request microphone res', responseMicrophone)
                    this.setState({
                        permissionMicrophone: responseMicrophone,
                        permissionStorage: PERMISSION_RESPONSE.AUTHORIZED
                    })
                    if (responseMicrophone != PERMISSION_RESPONSE.AUTHORIZED) {
                        reject('Permission reject')
                        return
                    }
                    resolve('Permisson accept')
                    return
                })
            } else {
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
                            return
                        }
                        resolve('Permisson accept')
                        return
                    })
                })
            }

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

    _startRecord = async () => {
        const { setting, userInfo } = this.props
        const audioId = moment().format('YYYYMMDDHHmmss')
        this.fileName = `${setting.defaultName} ${audioId}`
        this.basePath = await prepareSaveFilePath(userInfo.username)
        this.audioPath = `${this.basePath}/${this.fileName}.aac`
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
            stopForegroundService(FOREGROUND_NOTIFICATION_ID.RECORD)
            this.setState({ recording: RECORD_STATUS.STOPPED })
            console.log('_stopRecord filePath', filePath)
            this.setState({ fileNameInput: this.fileName, showingPopupSave: true })
        } catch (error) {
            console.error(error);
        }
    }

    _handlePressCancel = async () => {
        if (this.state.recording != RECORD_STATUS.NOT_START) {
            const filePath = await AudioRecorder.stopRecording()
            stopForegroundService(FOREGROUND_NOTIFICATION_ID.RECORD)
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
        this.setState({ showingPopupSave: false }, async () => {
            try {
                console.log('File name input', this.state.fileNameInput)
                console.log('Origin filename', this.fileName)
                const originPath = `${this.basePath}/${this.fileName}.aac`
                const newPath = `${this.basePath}/${this.state.fileNameInput}.aac`
                if (this.fileName != this.state.fileNameInput) {
                    await RNFetchBlob.fs.mv(originPath, newPath)
                }
                const { addRecord, uploadMeetingRecord } = this.props
                addRecord(newPath, this.state.selectedCategory)
                ToastUtils.showSuccessToast(`Đã lưu tệp ghi âm ${newPath}`)
                setTimeout(() => {
                    uploadMeetingRecord()
                }, 100)
                this.props.navigation.goBack()
            } catch (err) {
                console.log('_handleYesFileName err', err)
            }
        })
    }

    _handlePressNoFileName = () => {
        this.setState({ showingPopupSave: false }, () => {
            this.props.navigation.goBack()
        })
    }

    _handlePressCategory = (item) => {
        console.log('_handlePressCategory', item)
        this.setState({ selectedCategory: item.id })
    }

    _renderCategoryItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this._handlePressCategory(item)}>
                <View className='row-start border-bottom2 mh16'>
                    <View className='pv16 white row-start'>
                        <View style={{ marginRight: 5 }}>
                            <Icon name={'check'} color={(item.id == this.state.selectedCategory) ? COLORS.GREEN : 'transparent'} size={15} />
                        </View>
                        <Text className='s14 textBlack'>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _categoryKeyExtractor = item => item.id

    _handleRequestClose = () => {

    }

    _renderPopupSave = () => {
        const { category } = this.props
        const enableSave = this.state.fileNameInput && this.state.fileNameInput.trim()
        
        return (
            <Modal
                animationType={'none'}
                visible={this.state.showingPopupSave}
                transparent={true}
                onRequestClose={this._handleRequestClose}
            >
                <View style={styles.backdrop}>
                    <View style={styles.popupOuter}>
                        <View style={styles.popupContainer}>
                            <View style={styles.header}>
                                <Image source={require('~/src/image/warning.png')}
                                    style={styles.warningIcon}
                                />
                                <Text className='title'>{I18n.t('save_record')}</Text>
                            </View>
                            <View style={styles.popupContent}>
                                <View className='space10' />
                                <View className='row-start'>
                                    <Text className='bold s13'>{I18n.t('file_name')}</Text>
                                </View>
                                <View className='row-start'>
                                    <TextInput
                                        value={this.state.fileNameInput}
                                        onChangeText={this._onChangeFileName}
                                        style={styles.fileNameInput}
                                        onPressYes={this._handleYesFileName}
                                    />
                                </View>
                                <View className='space16' />
                                <View className='row-start'>
                                    <Text className='bold s13'>{I18n.t('choose_category')}</Text>
                                </View>
                                <View>
                                    <FlatList
                                        data={category}
                                        renderItem={this._renderCategoryItem}
                                        keyExtractor={this._categoryKeyExtractor}
                                        style={{ maxHeight: 250 }}
                                        extraData={this.state}
                                    />
                                </View>
                                <View style={styles.buttonBlock}>
                                    <SmallButton
                                        gray
                                        text={I18n.t('cancel')}
                                        onPress={this._handlePressNoFileName}
                                        style={styles.buttonLeft}
                                    />
                                    <SmallButton
                                        text={I18n.t('agree')}
                                        onPress={this._handleYesFileName}
                                        style={styles.buttonRight}
                                        disabled={!enableSave}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <View className="flex background">
                {this._renderPopupSave()}
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
    setting: settingSelector(state),
    userInfo: userInfoSelector(state),
    category: categorySelector(state)
}), { addRecord, uploadMeetingRecord })(Record)
