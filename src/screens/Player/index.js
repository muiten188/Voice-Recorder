import React, { Component } from "react";
import { FlatList, Image, BackHandler, AppState } from 'react-native'
import { View, Text, TouchableOpacityHitSlop, GradientToolbar, Slider } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import ToastUtils from '~/src/utils/ToastUtils'
import { addRecord } from '~/src/store/actions/localRecord'
import { connect } from 'react-redux'
import APIManager from '~/src/store/api/APIManager'
import styles from './styles'
import { MEETING_STATUS, FILE_TYPES, APP_FOLDER } from '~/src/constants'
import { getPlayerTimeString, chainParse, prepareSaveFilePath } from '~/src/utils'
import { getTranscription, getTranscriptionSentence, getExportToken, exportTranscript } from '~/src/store/actions/transcription'
import { transcriptionSelector, transcriptionSentenceSelector } from '~/src/store/selectors/transcription'
import { userInfoSelector } from '~/src/store/selectors/auth'
import RNFetchBlob from 'rn-fetch-blob'
import ContextMenu from '~/src/components/ContextMenu'
const CONTEXT_DATA = [
    {
        id: FILE_TYPES.DOCX,
        name: I18n.t('download_transcript_docx')
    },
    {
        id: FILE_TYPES.PDF,
        name: I18n.t('download_transcript_pdf')
    },
]
import Permissions from 'react-native-permissions'
import { PERMISSION_RESPONSE } from '~/src/constants'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import TranscriptItem from './TranscriptItem'
import TrackPlayer from 'react-native-track-player'

class Player extends Component {

    static navigationOptions = {
        headerMode: "none",
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            audioPath: '',
            playing: true,
            duration: 0,
            progress: 0,
            currentTranscriptKey: -1
        }
        this.layoutMap = {}
        this.meeting = props.navigation.getParam('meeting')
        this._didFocusSubscription = props.navigation.addListener('didFocus', this.componentDidFocus)
        this.currentTranscriptKey = -1
        this.lastTranscriptKey = -1
        this.measureTranscript = null
        this.unmounted = false
    }

    _handleBack = () => {
        TrackPlayer.stop()
        TrackPlayer.destroy()
        this.props.navigation.goBack()
        clearInterval(this.checkIntervalId)
        return true
    }

    componentDidFocus = () => {
        BackHandler.addEventListener('hardwareBackPress', this._handleBack)
    }

    _play = async () => {
        // console.log('State', [
        //     TrackPlayer.STATE_NONE, // 0 - "idle"
        //     TrackPlayer.STATE_STOPPED, // 1 - "idle"
        //     TrackPlayer.STATE_READY, // 2 - "ready"
        //     TrackPlayer.STATE_PAUSED, // 2 - "paused"
        //     TrackPlayer.STATE_PLAYING, // 3 - "playing"
        //     TrackPlayer.STATE_BUFFERING, // 6 - "loading"
        //     TrackPlayer.STATE_CONNECTING //8 - undefined
        // ])
        await TrackPlayer.setupPlayer()
        await TrackPlayer.updateOptions({
            stopWithApp: true
        })

        TrackPlayer.addEventListener('playback-track-changed', (data) => {
            console.log('playback-track-changed', data)
        })
        TrackPlayer.addEventListener('playback-state', (data) => {
            console.log('playback-state', data)
            if (data.state == TrackPlayer.STATE_STOPPED || data.state == TrackPlayer.STATE_PAUSED) {
                clearInterval(this.checkIntervalId)
                this.setState({ playing: false })
            }
        })

        TrackPlayer.addEventListener('playback-queue-ended', data => {
            console.log('playback-queue-ended', data)
            TrackPlayer.stop()
        })

        const track = {
            id: this.meeting.id,
            url: this.state.audioPath,
            artist: this.meeting.name,
            title: this.meeting.name
        }
        console.log('Track', track)
        await TrackPlayer.add(track)
        await TrackPlayer.play()
        setTimeout(async () => {
            const duration = await TrackPlayer.getDuration()
            console.log('duration', duration)
            this.setState({ duration, playing: true })
            this._runCheckInterval()
        }, 500)
    }

    _runCheckInterval = () => {
        this.checkIntervalId = setInterval(async () => {
            const seconds = await TrackPlayer.getPosition()
            const currentState = await TrackPlayer.getState()
            console.log('Current State', currentState)
            const { transcriptionSentence } = this.props
            const isPlaying = (currentState == TrackPlayer.STATE_PLAYING)
            if (transcriptionSentence) {
                const currentProgressMs = this.state.progress * 1000
                const currentTranscriptObj = transcriptionSentence.find(item => item[1] <= currentProgressMs && item[2] >= currentProgressMs)
                if (currentTranscriptObj) {
                    this.lastTranscriptKey = this.currentTranscriptKey
                    this.currentTranscriptKey = currentTranscriptObj[0]
                }
            }
            this.setState({ progress: seconds, currentTranscriptKey: this.currentTranscriptKey, playing: isPlaying }, () => {
                if (this.lastTranscriptKey != this.currentTranscriptKey) {
                    this.transcriptList && this.transcriptList.scrollToIndex({
                        animated: Platform.OS == 'android' ? false : true,
                        index: this.currentTranscriptKey,
                        viewPosition: 0,
                        viewOffset: 50
                    })
                }

            })
        }, 250)
    }

    _handlePressPlayPause = async () => {
        if (this.state.playing) {
            console.log('Case pause')
            TrackPlayer.pause()
            clearInterval(this.checkIntervalId)
            this.setState({ playing: false })
        } else {
            console.log('Case play')
            const currentState = await TrackPlayer.getState()
            if (currentState == TrackPlayer.STATE_STOPPED) {
                await TrackPlayer.destroy()
                this._play()
                return
            }
            TrackPlayer.play()
            this._runCheckInterval()
            this.setState({ playing: true })
        }
    }

    componentDidMount() {
        if (this.meeting.status == MEETING_STATUS.DONE) {
            const { getTranscription, getTranscriptionSentence } = this.props
            console.log('Meeting', this.meeting)
            getTranscription(this.meeting.id, (err, data) => {
                console.log('Get transcription err', err)
                console.log('Get transcription data', data)
            })
            getTranscriptionSentence(this.meeting.id, (err, data) => {
                console.log('getTranscriptionSentence err', err)
                console.log('getTranscriptionSentence data', data)
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
        TrackPlayer.stop()
        TrackPlayer.destroy()
        AppState.removeEventListener('change', this._handleAppStateChange)
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

    _handlePressPrevious10s = async () => {
        let currentState = await TrackPlayer.getState()
        const currentTime = await TrackPlayer.getPosition()
        TrackPlayer.seekTo(Math.min(currentTime - 10, 0))
    }

    _handlePressNext10s = async () => {
        let currentState = await TrackPlayer.getState()
        const currentTime = await TrackPlayer.getPosition()
        TrackPlayer.seekTo(Math.min(this.state.duration, currentTime + 10))
    }

    _handlePressTranscriptItem = (item) => {
        clearInterval(this.checkIntervalId)
        console.log('_handlePressTranscriptItem', item)
        const { transcriptKey } = item
        const { transcriptionSentence } = this.props
        if (transcriptionSentence) {
            const currentTranscriptObj = transcriptionSentence.find(item => item[0] == transcriptKey)
            if (!currentTranscriptObj) {
                this._runCheckInterval()
                return
            }
            const currentTime = currentTranscriptObj[1] / 1000
            TrackPlayer.seekTo(currentTime)
            this.setState({ progress: currentTime, currentTranscriptKey: transcriptKey }, () => {
                setTimeout(() => {
                    this._runCheckInterval()
                }, 500)
            })
        } else {
            this._runCheckInterval()
        }
    }

    _renderTranscriptItem = ({ item, index }) => {
        const shouldHightlight = item[0] == this.state.currentTranscriptKey
        return (
            <TranscriptItem
                key={item[0]}
                transcriptKey={item[0]}
                text={item[3]}
                onPress={this._handlePressTranscriptItem}
                shouldHightlight={shouldHightlight}
            />
        )
    }

    _keyExtractor = item => item[0] + ''

    _handlePressMore = () => {
        console.log('_handlePressMore')
        this.contextMenu && this.contextMenu.open()
    }

    _requestPermission = () => {
        return new Promise((resolve, reject) => {
            if (Platform.OS == 'ios') {
                resolve(true)
            } else {
                Permissions.request('storage', { type: 'always' }).then(responseStorage => {
                    console.log('Request storage res', responseStorage)
                    if (responseStorage == PERMISSION_RESPONSE.AUTHORIZED) {
                        resolve(true)
                    }
                    reject(false)
                })
            }
        })
    }

    _openFile = (path, type) => {
        if (Platform.OS == 'android') {
            const mimeType = type == 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                : type == 'pdf' ? 'application/pdf' : ''
            console.log('Mime type', mimeType)
            RNFetchBlob.android.actionViewIntent(path, mimeType)
        } else {
            RNFetchBlob.ios.openDocument(path)
        }
    }

    _handleChooseContextMenu = async (item) => {
        console.log('_handleChooseContextMenu', item)
        try {
            await this._requestPermission()
            const { userInfo } = this.props
            if (item.id == FILE_TYPES.DOCX) { // Docx
                const filePath = await prepareSaveFilePath(userInfo.username, `${this.meeting.name}.docx`)
                const { getExportToken } = this.props
                getExportToken(this.meeting.id, (errExportToken, dataExportToken) => {
                    console.log('getExportToken err', errExportToken)
                    console.log('getExportToken data', dataExportToken)
                    if (dataExportToken && dataExportToken.token) {
                        APIManager.getInstance()
                            .then(apiConfig => {
                                console.log('Download url', `${apiConfig.API_URL}/api/v2/meeting/export?token=${dataExportToken.token}`)
                                console.log('Save path', filePath)
                                RNFetchBlob
                                    .config({
                                        path: filePath
                                    })
                                    .fetch('GET', `${apiConfig.API_URL}/api/v2/meeting/export?token=${dataExportToken.token}`, {})
                                    .then((res) => {
                                        console.log('Download res', res)
                                        console.log('The file saved to ', res.path())
                                        ToastUtils.showSuccessToast(`${I18n.t('download_transcript_success')} "${res.path()}"`)
                                        setTimeout(() => {
                                            this._openFile(res.path(), 'docx')
                                        }, 500)

                                    })
                                    .catch((errorMessage, statusCode) => {
                                        console.log('Download error', errorMessage, statusCode)
                                    })
                            })
                    }
                })
            } else if (item.id == FILE_TYPES.PDF) {
                const savePath = await prepareSaveFilePath(userInfo.username, `${this.meeting.name}.pdf`)
                console.log('Save Path', savePath)
                const { transcription } = this.props
                let options = {
                    html: transcription.transcript_html,
                    fileName: this.meeting.name,
                    directory: Platform.OS == 'ios' ? 'Documents' : APP_FOLDER + '/' + userInfo.username,
                }
                let file = await RNHTMLtoPDF.convert(options)
                console.log('File', file)
                if (Platform.OS == 'ios') {
                    await RNFetchBlob.fs.mv(file.filePath, savePath)
                }
                ToastUtils.showSuccessToast(`${I18n.t('download_transcript_success')} "${savePath}"`)
                setTimeout(() => {
                    this._openFile(savePath, 'pdf')
                }, 500)

            }
        } catch (err) {
            console.log('_handleChooseContextMenu err', err)
        }
    }

    _handleSlidingStart = (e) => {
        console.log('_handleSlidingStart', e)
        clearInterval(this.checkIntervalId)
    }

    _handleSlidingComplete = (e) => {
        console.log('_handleSlidingComplete', e)
        const currentTime = e / 100 * this.state.duration
        // this.player.setCurrentTime(currentTime)
        TrackPlayer.seekTo(currentTime)
        this.setState({ progress: currentTime }, () => {
            this._runCheckInterval()
        })
    }

    _handleSliderValueChange = (e) => {
        console.log('_handleSliderValueChange', e)
        const currentTime = e / 100 * this.state.duration
        this.setState({ progress: currentTime })
    }

    _retryScroll = (info) => {
        this.transcriptList.scrollToIndex({
            animated: false,
            index: info.highestMeasuredFrameIndex,
            viewPosition: 0,
            viewOffset: 50
        })
        setTimeout(() => {
            this.transcriptList && this.transcriptList.scrollToIndex({
                animated: false,
                index: this.currentTranscriptKey,
                viewPosition: 0,
                viewOffset: 50
            })
        })
    }

    _handleScrollToIndexFailed = (info) => {
        console.log('_handleScrollToIndexFailed', info)
        this._retryScroll(info)
    }

    render() {
        const { transcription, transcriptionSentence } = this.props
        const transcriptionText = chainParse(transcription, ['transcript']) || ''
        return (
            <View className="flex background">
                <GradientToolbar
                    title={I18n.t('detail')}
                    onPressLeft={this._handleBack}
                    rightIcon='dots-vertical'
                    onPressRight={this._handlePressMore}
                />
                <ContextMenu
                    data={CONTEXT_DATA}
                    onPress={this._handleChooseContextMenu}
                    ref={ref => this.contextMenu = ref}
                    style={styles.contextMenu}
                />

                <View className='flex' style={styles.transcriptOuter}>
                    {!transcriptionText ?
                        <View style={styles.transcriptContainer}>
                            <Text className='s15 center lh24 white54'>
                                {I18n.t('loading_transcription')}
                            </Text>
                        </View>
                        :

                        <FlatList
                            data={transcriptionSentence}
                            key={this._keyExtractor}
                            renderItem={this._renderTranscriptItem}
                            ref={ref => this.transcriptList = ref}
                            contentContainerStyle={styles.transcriptContainer}
                            extraData={this.state.currentTranscriptKey}
                            windowSize={100}
                            onScrollToIndexFailed={this._handleScrollToIndexFailed}
                        />
                    }
                </View>
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
export default connect((state, props) => {
    const meeting = props.navigation.getParam('meeting')
    return {
        transcription: transcriptionSelector(state, meeting.id),
        transcriptionSentence: transcriptionSentenceSelector(state, meeting.id),
        userInfo: userInfoSelector(state)
    }
}, {
    addRecord, getTranscription, getTranscriptionSentence,
    getExportToken, exportTranscript
})(Player)
