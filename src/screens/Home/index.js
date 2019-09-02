import React, { Component } from "react";
import { ImageBackground } from 'react-native'
import { Container, View, Text, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent";
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

export default class Home extends Component {
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

    _formatTwoDigitNumber = (number) => {
        if (+number < 10) return `0${number}`
        return '' + number
    }

    _getRecordTimeString = (recordTime) => {
        const recordHours = Math.floor(recordTime / 3600)
        const recordMinues = Math.floor((recordTime - 3600 * recordHours) / 60)
        const recordSeconds = recordTime - 3600 * recordHours - 60 * recordMinues
        return `${this._formatTwoDigitNumber(recordHours)} : ${this._formatTwoDigitNumber(recordMinues)} : ${this._formatTwoDigitNumber(recordSeconds)}`
    }

    render() {
        return (
            <Container blue>
                <View className="flex background">
                    <ImageBackground
                        source={require('~/src/image/bg_recording.png')}
                        style={{ width: DEVICE_WIDTH, height: scaleHeight(499) }}
                    >
                        <View style={{ height: scaleHeight(120) }} />
                        <View className='column-center'>
                            <Text className='white s24 bold'>Recording</Text>
                            <View style={{ height: scaleHeight(44) }} />
                            <Text className='white s44' style={getFontStyle('thin')}>{getRecordTimeString(this.state.recordTime)}</Text>
                        </View>

                    </ImageBackground>
                    <View className='flex white column-end'>
                        <View style={styles.actionBlock}>
                            <TouchableOpacityHitSlop>
                                <View className='row-start'>
                                    <Icon name='delete-outline' size={24} color={COLORS.TEXT_BLACK} />
                                    <Text className='textBlack'>{I18n.t('cancel')}</Text>
                                </View>
                            </TouchableOpacityHitSlop>

                            <TouchableOpacityHitSlop onPress={this._handlePressCenterButton}>
                                <View className='column-center'>
                                    <View style={styles.iconContainerCenter}>
                                        <Icon
                                            color={COLORS.WHITE}
                                            size={36}
                                            name={(this.state.recording == RECORD_STATUS.NOT_START) ? 'microphone' : 'pause'}
                                        />
                                    </View>
                                    <View className='space16' />
                                    <Text className='error s14'>{I18n.t('pause')}</Text>
                                </View>

                            </TouchableOpacityHitSlop>
                            <TouchableOpacityHitSlop onPress={this._handlePressRightButton}>
                                <View className='row-start'>
                                    <Icon name='stop' size={28} color={COLORS.GREEN} />
                                    <Text className='green'>{I18n.t('done_en')}</Text>
                                </View>
                            </TouchableOpacityHitSlop>
                        </View>
                    </View>

                </View>
            </Container>
        );
    }
}