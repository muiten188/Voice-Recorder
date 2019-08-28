import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Container, View, Text } from "~/src/themes/ThemeComponent";
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { COLORS } from "~/src/themes/common";
import Permissions from 'react-native-permissions'
import { PERMISSION_RESPONSE } from '~/src/constants'
import { AudioRecorder, AudioUtils } from 'react-native-audio';
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
            recordTime: 0,
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
                <View className="flex background column-end" >
                    <View className='flex pd32 column-all-start' style={{ width: '100%' }}>
                        <Text className='s18 gray'>{(this.state.recording == RECORD_STATUS.NOT_START) ? 'Ghi âm' : 'Đang ghi âm...'}</Text>
                        <Text className='s48' style={{ marginTop: 16 }}>{this._getRecordTimeString(this.state.recordTime)}</Text>
                    </View>
                    <View style={styles.actionBlock}>
                        <TouchableOpacity>
                            <View style={styles.iconContainer}>
                                <Icon name='menu' size={24} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._handlePressCenterButton}>
                            <View style={styles.iconContainerCenter}>
                                <Icon name={(this.state.recording == RECORD_STATUS.NOT_START) ? 'microphone' : 'control-pause'} size={36} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._handlePressRightButton}>
                            <View style={styles.iconContainer}>
                                <Icon name={(this.state.recording == RECORD_STATUS.NOT_START) ? 'playlist' : ''} size={28} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    actionBlock: {
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER_COLOR2,
        width: '100%',
        padding: 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconContainerCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: COLORS.BORDER_COLOR2
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: COLORS.BORDER_COLOR2
    }
})
