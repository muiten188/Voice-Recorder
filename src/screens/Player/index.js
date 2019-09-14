import React, { Component } from "react";
import { ImageBackground, Image, BackHandler } from 'react-native'
import { View, Text, TouchableOpacityHitSlop, GradientToolbar } from "~/src/themes/ThemeComponent";
import I18n from '~/src/I18n'
import ToastUtils from '~/src/utils/ToastUtils'
import moment from 'moment'
import { addRecord } from '~/src/store/actions/localRecord'
import { connect } from 'react-redux'
import APIManager from '~/src/store/api/APIManager'
import Sound from 'react-native-sound'
import styles from './styles'
import Slider from '@react-native-community/slider'
import { MEETING_STATUS } from '~/src/constants'
import { getPlayerTimeString } from '~/src/utils'
Sound.setCategory('Playback')



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
        }, 1000)
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
        } else if (this.meeting.status == MEETING_STATUS.QUEUING) {
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
        return this.state.progress / this.state.duration
    }


    render() {
        return (
            <View className="flex background">
                <GradientToolbar
                    title={I18n.t('detail')}
                    avatar='https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fewedit.files.wordpress.com%2F2016%2F10%2Fdr-strange.jpg&w=400&c=sc&poi=face&q=85'
                />
                <View className='white bottom column-center' style={{ width: '100%' }}>
                    <View className='space12' />
                    <Text className='textBlack bold s15'>{this.meeting.name}</Text>
                    <View className='space20' />
                    {this._renderStatus()}
                    <View className='space30' />
                    <View className='row-space-between ph14'>
                        <Text className='textBlack' style={{ marginRight: 10 }}>{getPlayerTimeString(this.state.progress)}</Text>
                        <Slider
                            style={{ width: 200, height: 2, borderRadius: 1, backgroundColor: '#363636' }}
                            minimumValue={0}
                            maximumValue={1}
                            value={this._getCurrentProgressForSlider()}
                            thumbTintColor={'#363636'}
                        />
                        <Text className='textBlack' style={{ marginLeft: 10 }}>{getPlayerTimeString(this.state.duration)}</Text>
                    </View>
                    <View className='row-center' style={styles.playerActionContainer}>
                        <TouchableOpacityHitSlop>
                            <View style={styles.prevContainer}>
                                <Image source={require('~/src/image/tua_10s.png')} style={styles.prev10sImg} />
                                <Text className='s12 textBlack'>{I18n.t('prev_10s')}</Text>
                            </View>
                        </TouchableOpacityHitSlop>
                        <TouchableOpacityHitSlop onPress={this._handlePressPlayPause}>
                            <Image source={this.state.playing ? require('~/src/image/pause2.png') : require('~/src/image/recording.png')} style={styles.pauseImg} />
                        </TouchableOpacityHitSlop>
                        <TouchableOpacityHitSlop>
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
export default connect(null, { addRecord })(Player)
