import React, { Component } from "react";
import { ImageBackground, Image } from 'react-native'
import { View, Text, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Permissions from 'react-native-permissions'
import { PERMISSION_RESPONSE } from '~/src/constants'
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { DEVICE_WIDTH, COLORS } from "~/src/themes/common";
import { scaleHeight, getFontStyle, getRecordTimeString } from '~/src/utils'
import styles from './styles'
import I18n from '~/src/I18n'

const RECORD_STATUS = {
    NOT_START: 'NOT_START',
    RECORDING: 'RECORDING',
    PAUSED: 'PAUSED',
    STOPPED: 'STOPPED'
}

export default class Record extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props);
        // started / paused / stopped / recording
        this.state = {
            recording: RECORD_STATUS.NOT_START,
            recordTime: 5000,
            permissionStatus: '',
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
        }
    }

    _prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "High",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    componentDidMount() {
        Permissions.check('microphone', { type: 'always' }).then(response => {
            console.log('Check res', response)
            this.setState({ permissionStatus: response })
        })
    }

    _handlePressCenterButton = () => {
        if (this.state.recording == RECORD_STATUS.NOT_START) {
            if (this.state.permissionStatus != PERMISSION_RESPONSE.AUTHORIZED) {
                Permissions.request('microphone', { type: 'always' }).then(response => {
                    console.log('Request res', response)
                    this.setState({ permissionStatus: response })
                    if (response == PERMISSION_RESPONSE.AUTHORIZED) {
                        this._startRecord()
                    }
                })
            }
        } else if (this.state.recording == RECORD_STATUS.PAUSED) {
            this._resumeRecord()
        } else if (this.state.recording == RECORD_STATUS.RECORDING) {
            this._pauseRecord()
        }
    }

    _handlePressStart = () => {
        this.setState({ recording: RECORD_STATUS.RECORDING })
    }

    _handlePressPause = () => {
        this.setState({ recording: RECORD_STATUS.NOT_START })
    }

    _startRecord = () => {
        this.setState({ recording: RECORD_STATUS.RECORDING })
    }

    _pauseRecord = () => {
        this.setState({ recording: RECORD_STATUS.PAUSED })
    }

    _resumeRecord = () => {
        this.setState({ recording: RECORD_STATUS.RECORDING })
    }

    _stopRecord = () => {
        this.setState({ recording: RECORD_STATUS.STOPPED })
    }

    _handlePressRightButton = () => {
        if (this.state.recording == RECORD_STATUS.NOT_START) {

        } else {
            this._stopRecord()
        }
    }

    _handlePressCancel = () => {
        this.props.navigation.goBack()
    }

    _handlePressDone = () => {
        this.props.navigation.goBack()
    }

    _renderActionBlock = () => {
        if (this.state.recording == RECORD_STATUS.NOT_START) {
            return (
                <View style={styles.actionBlock}>
                    <TouchableOpacityHitSlop onPress={this._handlePressCancel}>
                        <View className='row-start'>
                            <Image source={require('~/src/image/cancel.png')} style={{ width: 17, height: 17, marginRight: 4 }} />
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
                        <Text className='s13 green'>{I18n.t('done_en')}</Text>
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

                <TouchableOpacityHitSlop onPress={this._handlePressPause}>
                    <View className='column-center'>
                        <Image source={require('~/src/image/pause.png')}
                            style={styles.iconContainerCenter}
                        />
                        <View className='space8' />
                        <Text className='error s14'>{I18n.t('pause')}</Text>
                    </View>

                </TouchableOpacityHitSlop>
                <TouchableOpacityHitSlop onPress={this._handlePressDone}>
                    <View className='row-start'>
                        <Image source={require('~/src/image/done.png')} style={{ width: 15, height: 15, marginRight: 6 }} />
                        <Text className='s13 green'>{I18n.t('done_en')}</Text>
                    </View>
                </TouchableOpacityHitSlop>
            </View>
        )

    }

    render() {
        return (
            <View className="flex background">
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