import React, { Component } from "react";
import { ScrollView, Image, BackHandler } from 'react-native'
import { View, Text, TouchableOpacityHitSlop, GradientToolbar, Slider } from "~/src/themes/ThemeComponent";
import I18n from '~/src/I18n'
import ToastUtils from '~/src/utils/ToastUtils'
import moment from 'moment'
import { addRecord } from '~/src/store/actions/localRecord'
import { connect } from 'react-redux'
import APIManager from '~/src/store/api/APIManager'
import Sound from 'react-native-sound'
import styles from './styles'
// import Slider from '@react-native-community/slider'
import { MEETING_STATUS, PAGE_SIZE } from '~/src/constants'
import { getPlayerTimeString, chainParse } from '~/src/utils'
import { getTranscription } from '~/src/store/actions/transcription'
import { transcriptionSelector } from '~/src/store/selectors/transcription'
// import  from "react-native-slider";

class Player extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            audioPath: '',
            playing: true,
            duration: 0,
            progress: 0
        }
        this.meeting = props.navigation.getParam('meeting')
        this._didFocusSubscription = props.navigation.addListener('didFocus', this.componentDidFocus)
    }

    _handleBack = () => {
        this.player.stop()
        this.player.release()
        this.props.navigation.goBack()
        return true
    }

    componentDidFocus = () => {
        BackHandler.addEventListener('hardwareBackPress', this._handleBack)
    }

    _play = () => {
        this.player = new Sound(this.state.audioPath, null, (error) => {
            if (error) {
                // do something
            }

            console.log('duration in seconds: ' + this.player.getDuration() + 'number of channels: ' + this.player.getNumberOfChannels());
            this.setState({ duration: this.player.getDuration(), playing: true })
            // play when loaded
            this.player.play();
            this._runCheckInterval()
        });
    }

    _runCheckInterval = () => {
        this.checkIntervalId = setInterval(() => {
            this.player.getCurrentTime((seconds, isPlaying) => {
                this.setState({ progress: seconds })
            })
        }, 500)
    }

    _handlePressPlayPause = () => {
        if (this.state.playing) {
            this.player.pause()
            clearInterval(this.checkIntervalId)
            this.setState({ playing: false })
        } else {
            this.player.play()
            this._runCheckInterval()
            this.setState({ playing: true })
        }
    }

    componentDidMount() {
        console.log('Player did mount')
        if (this.meeting.status == MEETING_STATUS.DONE) {
            const { getTranscription } = this.props
            console.log('Meeting', this.meeting)
            getTranscription(this.meeting.id, 1, PAGE_SIZE, (err, data) => {
                console.log('Get transcription err', err)
                console.log('Get transcription data', data)
            })
        }
        APIManager.getInstance()
            .then(apiConfig => {
                console.log('API config', apiConfig)
                const audioPath = apiConfig.AUDIO_URL + this.meeting.audio_path
                this.setState({ audioPath }, () => {
                    this._play()
                })
            })

    }

    componentWillUnmount() {
        clearInterval(this.checkIntervalId)
    }

    _renderStatus = () => {
        if (this.meeting.status == MEETING_STATUS.INITIAL) {
            return (
                <View className='row-start'>
                    <Text className='s12 green' style={{ marginRight: 4 }}>{I18n.t('process_init')}</Text>
                    <Image source={require('~/src/image/moikhoitao.png')} style={{ width: 20, height: 16 }} />
                </View>
            )
        } else if (this.meeting.status == MEETING_STATUS.WAITING || this.meeting.status == MEETING_STATUS.QUEUING) {
            return (
                <View className='row-start'>
                    <Text className='s12 orange' style={{ marginRight: 4 }}>{I18n.t('process_queuing')}</Text>
                    <Image source={require('~/src/image/duavaohangcho.png')} style={{ width: 16, height: 16 }} />
                </View>
            )
        } else if (this.meeting.status == MEETING_STATUS.PROCESSING) {
            return (
                <View className='row-start'>
                    <Text className='s12 blue' style={{ marginRight: 4 }}>{I18n.t('processing')}</Text>
                    <Image source={require('~/src/image/dangcho.png')} style={{ width: 16, height: 16 }} />
                </View>
            )
        } else if (this.meeting.status == MEETING_STATUS.DONE) {
            return (
                <View className='row-start'>
                    <Text className='s12 green' style={{ marginRight: 4 }}>{I18n.t('process_done')}</Text>
                    <Image source={require('~/src/image/xulyxong.png')} style={{ width: 13, height: 10 }} />
                </View>
            )
        } else if (this.meeting.status == MEETING_STATUS.FAILED) {
            return (
                <View className='row-start'>
                    <Text className='error s12' style={{ marginRight: 4 }}>{I18n.t('process_failed')}</Text>
                    <Image source={require('~/src/image/failed.png')} style={{ width: 15, height: 15 }} />
                </View>
            )
        }
    }

    _getCurrentProgressForSlider = () => {
        if (this.state.duration == 0) return 0
        return this.state.progress / this.state.duration * 100
    }

    _handlePressPrevious10s = () => {
        this.player.getCurrentTime((seconds, isPlaying) => {
            if (!isPlaying) return
            if (seconds > 10) {
                this.player.setCurrentTime(seconds - 10)
            }
        })
    }

    _handlePressNext10s = () => {
        this.player.getCurrentTime((seconds, isPlaying) => {
            if (!isPlaying) return
            if (seconds < this.state.duration - 10) {
                this.player.setCurrentTime(seconds + 10)
            }
        })
    }



    render() {
        const { transcription } = this.props
        const transcriptionText = chainParse(transcription, ['transcript']) || I18n.t('no_data')
        return (
            <View className="flex background">
                <GradientToolbar
                    title={I18n.t('detail')}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.transcriptContainer}
                >
                    <View className='column-center ph16 pv16'>
                        <Text className='s15 center lh24 white54'>{transcriptionText}</Text>
                    </View>

                </ScrollView>
                <View className='white column-center fullWidth'>
                    <View className='space12' />
                    <View className='ph14'>
                        <Text className='textBlack bold s15 center'>{this.meeting.name}</Text>
                    </View>
                    <View className='space20' />
                    {this._renderStatus()}
                    <View className='space30' />
                    <View className='row-space-between ph14'>
                        <Text className='textBlack' style={{ marginRight: 10 }}>{getPlayerTimeString(this.state.progress)}</Text>
                        <Slider
                            minimumValue={0}
                            maximumValue={100}
                            value={this._getCurrentProgressForSlider()}
                            style={{ width: 200, height: 2, borderRadius: 1, backgroundColor: '#363636', padding: 0, margin: 0 }}
                        // thumbStyle={{ width: 8, height: 8, borderRadius: 4 }}
                        // thumbTintColor={'transparent'}
                        // thumbImage={require('~/src/image/slider.png')}
                        // thumbImageStyle={{ width: 14.33, height: 13.67, borderRadius: 7 }}
                        />
                        <Text className='textBlack' style={{ marginLeft: 10 }}>{getPlayerTimeString(this.state.duration)}</Text>
                    </View>
                    <View className='row-center' style={styles.playerActionContainer}>
                        <TouchableOpacityHitSlop onPress={this._handlePressPrevious10s}>
                            <View style={styles.prevContainer}>
                                <Image source={require('~/src/image/tua_10s.png')} style={styles.prev10sImg} />
                                <Text className='s12 textBlack'>{I18n.t('prev_10s')}</Text>
                            </View>
                        </TouchableOpacityHitSlop>
                        <TouchableOpacityHitSlop onPress={this._handlePressPlayPause}>
                            <Image source={this.state.playing ? require('~/src/image/pause2.png') : require('~/src/image/recording.png')} style={styles.pauseImg} />
                        </TouchableOpacityHitSlop>
                        <TouchableOpacityHitSlop onPress={this._handlePressNext10s}>
                            <View style={styles.nextContainer}>
                                <Image source={require('~/src/image/tua_10s.png')} style={styles.next10sImg} />
                                <Text className='s12 textBlack'>{I18n.t('next_10s')}</Text>
                            </View>
                        </TouchableOpacityHitSlop>
                    </View>
                </View>
            </View>
        );
    }
}
export default connect((state, props) => {
    const meeting = props.navigation.getParam('meeting')
    return {
        transcription: transcriptionSelector(state, meeting.id)
    }
}, { addRecord, getTranscription })(Player)
