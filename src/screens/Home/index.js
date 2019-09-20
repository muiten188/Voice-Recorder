import React, { Component } from "react";
import { TouchableOpacity, Image, FlatList, Platform } from 'react-native'
import { View, Text, GradientToolbar, SearchBox, PopupConfirmDelete } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import { MEETING_STATUS_LIST, CHECK_LOCAL_RECORD_PERIOD, MEETING_STATUS, RELOAD_PROGRESS_PERIOD } from '~/src/constants'
import Picker from '~/src/components/Picker'
import styles from './styles'
import VoiceItem from '~/src/components/VoiceItem'
import { getUserInfo } from '~/src/store/actions/auth'
import { uploadMeetingRecord, getMeeting, startCheckUploadLocalRecord, stopCheckUploadLocalRecord } from '~/src/store/actions/meeting'
import { connect } from 'react-redux'
const emptyArray = []
import { meetingListSelector } from '~/src/store/selectors/meeting'
import { processingLocalRecordSelector } from '~/src/store/selectors/localRecord'
import DocumentPicker from 'react-native-document-picker'
import { addRecord } from '~/src/store/actions/localRecord'
import ToastUtils from '~/src/utils/ToastUtils'
import RNFetchBlob from "rn-fetch-blob"
import lodash from 'lodash'
import Permissions from 'react-native-permissions'
import { PERMISSION_RESPONSE } from '~/src/constants'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            statusFilter: '',
            showingFloatingOverlay: false,
            popupDeleteContent: '',
            loading: false,
            refresing: false
        }
        this.didFocusListener = props.navigation.addListener(
            "didFocus",
            this.componentDidFocus
        );
        this.reloadInterval = -1
    }


    _handleClearKeyword = () => {
        this.setState({ keyword: '' })
    }

    _handleChangeKeyword = (text) => {
        this.setState({ keyword: text })
    }

    _handleChangeStatusFilter = (value) => {
        console.log('_handleChangeStatusFilter', value)
        this.setState({ statusFilter: value })
    }

    _handlePressMainFloating = () => {
        this._toggleOverlay()
    }

    _toggleOverlay = () => {
        this.setState({ showingFloatingOverlay: !this.state.showingFloatingOverlay })
    }

    _renderMainFloatingButton = () => {
        if (this.state.showingFloatingOverlay) return <View />
        return (
            <View className='bottom transparent column-center'>
                <TouchableOpacity onPress={this._handlePressMainFloating}>
                    <View>
                        <Image
                            source={require('~/src/image/add_new.png')}
                            style={styles.mainFloatingButton}
                        />
                        <View className='space8' />
                        <Text className='green center'>{I18n.t('add_new')}</Text>
                        <View className='space12' />
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    _requestPermission = () => {
        return new Promise((resolve, reject) => {
            if (Platform.OS == 'ios') {
                resolve(true)
            }
            Permissions.request('storage', { type: 'always' }).then(responseStorage => {
                console.log('Request storage res', responseStorage)
                if (responseStorage == PERMISSION_RESPONSE.AUTHORIZED) {
                    resolve(true)
                }
                reject(false)
            })
        })
    }

    _handlePressImport = async () => {
        this._toggleOverlay()
        try {
            await this._requestPermission()
            const { addRecord, uploadMeetingRecord } = this.props
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
            });
            const uri = decodeURIComponent(res.uri)
            let uriPromise = new Promise((resolve, reject) => {
                RNFetchBlob.fs.stat(uri)
                    .then(fileStats => {
                        resolve({
                            uri: fileStats.path,
                            name: fileStats.filename
                        })
                    })
                    .catch(err => {
                        console.log('Error', err)
                        resolve({
                            uri: res.uri,
                            name: res.name
                        })
                    })
            })
            let uriInfoObj = await uriPromise
            console.log('Uri Obj', uriInfoObj)
            if (!uriInfoObj) return
            addRecord(uriInfoObj.uri)
            setTimeout(() => {
                uploadMeetingRecord()
            }, 100)
            ToastUtils.showSuccessToast(`Đã đưa tệp ghi âm "${uriInfoObj.name}" vào hàng chờ`)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
                console.log('User cancelled')
            }
            console.log('Picker error', err)
        }
    }

    _handlePressRecord = () => {
        this._toggleOverlay()
        this.props.navigation.navigate('Record')
    }

    _handlePressInfo = (record) => {
        console.log('_handlePressInfo', record)
    }

    _handlePressDelete = (record) => {
        console.log('_handlePressDelete', record)
        this.setState({ popupDeleteContent: record.name }, () => {
            this.popupConfirmDelete && this.popupConfirmDelete.open()
        })

    }

    _handlePressItem = (item) => {
        console.log('Pressing', item)
        if (item.localPath) return
        const { meetingList } = this.props
        const meetingListData = meetingList.data || emptyArray
        const meetingItem = meetingListData.find(it => it.id == item.id)
        this.props.navigation.navigate('Player', {
            meeting: meetingItem
        })
    }

    _renderMeetingItem = ({ item, index }) => {
        return (
            <VoiceItem
                id={item.id}
                status={item.status}
                localPath={item.localPath}
                progress={item.progress}
                name={item.name}
                create_time={item.create_time}
                onPressInfo={this._handlePressInfo}
                onPressDelete={this._handlePressDelete}
                onPress={this._handlePressItem}
            />
        )
    }


    _renderFloatingOverlay = () => {
        if (!this.state.showingFloatingOverlay) return <View />
        return (
            <View style={styles.floatingOverlay}>
                <View className='row-center'>
                    <TouchableOpacity onPress={this._handlePressImport}>
                        <View className='column-center'>
                            <Image source={require('~/src/image/import.png')}
                                style={styles.actionContainer}
                            />
                            <View className='space8' />
                            <Text className='blue'>{I18n.t('import')}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: 100 }} />
                    <TouchableOpacity onPress={this._handlePressRecord}>
                        <View className='column-center'>
                            <Image source={require('~/src/image/recording.png')}
                                style={styles.actionContainer}
                            />
                            <View className='space8' />
                            <Text className='green'>{I18n.t('recording')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View className='space32' />
                <TouchableOpacity onPress={this._handlePressMainFloating}>
                    <View>
                        <Image
                            source={require('~/src/image/add_new.png')}
                            style={styles.mainFloatingButton}
                        />
                        <View className='space8' />
                        <Text className='green center'>{I18n.t('add_new')}</Text>
                        <View className='space12' />
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    _handlePressLeftMenu = () => {
        this.props.navigation.openDrawer()
    }



    _load = (page = 1, refresing = false) => {
        if (refresing) {
            this.setState({ refresing: true })
        } else {
            this.setState({ loading: true })
        }
        const { getMeeting } = this.props
        getMeeting('', page, (err, data) => {
            console.log('getMeeting err', err)
            console.log('getMeeting data', data)
            // If has not finished record
            if (data && data.data && this.reloadInterval == -1) {
                const notFinishMeeting = data.data.find(item => item.status != MEETING_STATUS.DONE || item.status != MEETING_STATUS.FAILED)
                if (notFinishMeeting) {
                    this.reloadInterval = setInterval(() => {
                        this._load()
                    }, RELOAD_PROGRESS_PERIOD)
                }
            }
            this.setState({ refresing: false, loading: false })
        })
    }

    _loadMore = () => {
        if (this.state.loading || this.state.refresing) return
        const { meetingList } = this.props
        console.log('meetingList', meetingList)
        if (meetingList.next_page > 0) {
            this._load(meetingList.next_page)
        }
    }
    _refresh = () => {
        this._load(1, true)
    }

    componentDidFocus = async () => {
        console.log("Home Did Focus");
        this._load()
    };

    componentDidMount() {
        const { uploadMeetingRecord } = this.props
        this.checkLocalRecordInterval = setInterval(() => {
            uploadMeetingRecord()
        }, CHECK_LOCAL_RECORD_PERIOD)
    }

    componentWillUnmount() {
        clearInterval(this.checkLocalRecordInterval)
        clearInterval(this.reloadInterval)
        this.reloadInterval = -1
    }

    _getDataForList = (processingLocalRecord, meetingData) => {
        return [...processingLocalRecord, ...meetingData]
    }

    _keyExtractor = item => item.id + ''

    render() {
        const { meetingList, processingLocalRecord } = this.props
        const meetingListData = meetingList.data || emptyArray
        const listData = this._getDataForList(processingLocalRecord, meetingListData)
        return (
            <View className="flex white">
                {this._renderFloatingOverlay()}
                <PopupConfirmDelete
                    ref={ref => this.popupConfirmDelete = ref}
                    title={I18n.t('delete_audio_confirm_title')}
                    content={this.state.popupDeleteContent}
                    positiveText={I18n.t('delete_audio')}
                />
                <GradientToolbar
                    leftIcon={require('~/src/image/menu.png')}
                    onPressLeft={this._handlePressLeftMenu}
                    title={I18n.t('home_title')}
                    avatar='https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fewedit.files.wordpress.com%2F2016%2F10%2Fdr-strange.jpg&w=400&c=sc&poi=face&q=85'
                />
                <View className='ph16 pv10'>
                    <View className='row-start'>
                        <SearchBox
                            keyword={this.state.keyword}
                            onChangeKeyword={this._handleChangeKeyword}
                            onClear={this._handleClearKeyword}
                            placeholder={I18n.t('search_file_placeholder')}
                            style={{ flex: 1 }}
                        />
                        <Picker
                            options={MEETING_STATUS_LIST.map(item => ({
                                label: item.name,
                                value: item.id
                            }))}
                            placeholder={I18n.t('status')}
                            value={this.state.statusFilter}
                            onChangeValue={this._handleChangeStatusFilter}
                            styles={{ marginLeft: 12 }}
                        />
                    </View>

                </View>
                {this._renderMainFloatingButton()}
                <FlatList
                    onRefresh={this._refresh}
                    refreshing={this.state.refresing}
                    data={listData}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderMeetingItem}
                    ListFooterComponent={<View className='space100' />}
                    onEndReachedThreshold={0.2}
                    onEndReached={this._loadMore}
                />
            </View>
        )
    }
}

export default connect(state => ({
    meetingList: meetingListSelector(state),
    processingLocalRecord: processingLocalRecordSelector(state)
}), {
    getUserInfo, uploadMeetingRecord,
    getMeeting, addRecord,
    startCheckUploadLocalRecord, stopCheckUploadLocalRecord
})(Home)