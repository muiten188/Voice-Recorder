import React, { Component } from "react";
import { Image, BackHandler, AppState } from 'react-native'
import { View, Text, TouchableOpacityHitSlop, GradientToolbar, Slider } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import Sound from 'react-native-sound'
import styles from './styles'
import { getPlayerTimeString } from '~/src/utils'

export default class PlayerLocal extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            playing: true,
            duration: 0,
            progress: 0,
        }
        this._didFocusSubscription = props.navigation.addListener('didFocus', this.componentDidFocus)
        this.unmounted = false
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
        const audioPath = this.props.navigation.getParam('path')
        console.log('audioPath', audioPath)
        this.player = new Sound(audioPath, null, (error) => {
            if (error) {
                // do something
                console.log('Audio error', error)
            }
            if (this.unmounted) {
                console.log('Already unmounted')
                this.player.stop()
                this.player.release()
            }
            console.log('Playing')
            this.setState({ duration: this.player.getDuration(), playing: true })
            // play when loaded
            this.player.play()
            this._runCheckInterval()
        })
    }

    _runCheckInterval = () => {
        this.checkIntervalId = setInterval(() => {
            this.player.getCurrentTime((seconds, isPlaying) => {
                this.setState({ progress: seconds, playing: isPlaying })
            })
        }, 250)
    }

    _handlePressPlayPause = () => {
        if (this.state.playing) {
            console.log('Case pause')
            this.player.pause()
            clearInterval(this.checkIntervalId)
            this.setState({ playing: false })
        } else {
            console.log('Case play')
            this.player.play()
            this._runCheckInterval()
            this.setState({ playing: true })
        }
    }

    componentDidMount() {
        this._play()
        AppState.addEventListener('change', this._handleAppStateChange)
    }

    _handleAppStateChange = (nextAppState) => {
        console.log('nextAppState', nextAppState)
        if ((Platform.OS == 'ios' && nextAppState == 'inactive')
            || (Platform.OS == 'android' && nextAppState == 'background')) {
            console.log('App has come to the background', this.state, this.state.playing)
            if (this.state.playing) {
                this._handlePressPlayPause()
            }
        }
    }

    componentWillUnmount() {
        console.log('Unmounted')
        this.unmounted = true
        clearInterval(this.checkIntervalId)
        this.player.stop()
        this.player.release()
        AppState.removeEventListener('change', this._handleAppStateChange)
    }

    _getCurrentProgressForSlider = () => {
        if (this.state.duration == 0) return 0
        return this.state.progress / this.state.duration * 100
    }

    _handlePressPrevious10s = () => {
        this.player.getCurrentTime((seconds, isPlaying) => {
            if (!isPlaying) return
            this.player.setCurrentTime(Math.min(seconds - 10, 0))
        })
    }

    _handlePressNext10s = () => {
        this.player.getCurrentTime((seconds, isPlaying) => {
            if (!isPlaying) return
            this.player.setCurrentTime(Math.min(this.state.duration, seconds + 10))
        })
    }

    _handleSlidingStart = (e) => {
        console.log('_handleSlidingStart', e)
        clearInterval(this.checkIntervalId)
    }

    _handleSlidingComplete = (e) => {
        console.log('_handleSlidingComplete', e)
        const currentTime = e / 100 * this.state.duration
        this.player.setCurrentTime(currentTime)
        this.setState({ progress: currentTime }, () => {
            this._runCheckInterval()
        })
    }

    _handleSliderValueChange = (e) => {
        console.log('_handleSliderValueChange', e)
        const currentTime = e / 100 * this.state.duration
        this.setState({ progress: currentTime })
    }

    render() {
        const name = this.props.navigation.getParam('name')
        return (
            <View className="flex background">
                <GradientToolbar
                    title={I18n.t('detail')}
                    onPressLeft={this._handleBack}
                />
                <View className='flex' style={styles.transcriptOuter} />
                <View className='white column-center fullWidth'>
                    <View className='space12' />
                    <View className='ph14'>
                        <Text className='textBlack bold s15 center'>{name}</Text>
                    </View>
                    <View className='space20' />
                    <View className='row-space-between ph14'>
                        <Text className='textBlack' style={{ marginRight: 10 }}>{getPlayerTimeString(this.state.progress)}</Text>
                        <Slider
                            minimumValue={0}
                            maximumValue={100}
                            value={this._getCurrentProgressForSlider()}
                            style={styles.slider}
                            onSlidingStart={this._handleSlidingStart}
                            onSlidingComplete={this._handleSlidingComplete}
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
                            <Image source={this.state.playing ? require('~/src/image/pause2.png') : require('~/src/image/play.png')} style={styles.pauseImg} />
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
        )
    }
}
