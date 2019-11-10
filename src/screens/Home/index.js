import React, { Component } from "react"
import { connect } from 'react-redux'
import { FlatList, TouchableOpacity, Image, Platform, ActivityIndicator, AppState, StatusBar } from 'react-native'
import { View, Text, GradientToolbar, SearchBox, PopupConfirmDelete, TouchableOpacityHitSlop, PopupConfirm, SelectPopup } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import { MEETING_STATUS_LIST, MEETING_STATUS_INFO, CHECK_LOCAL_RECORD_PERIOD, MEETING_STATUS, RELOAD_PROGRESS_PERIOD } from '~/src/constants'
import VoiceItem from '~/src/components/VoiceItem'
import LoadingModal from "~/src/components/LoadingModal"
import { setAppState } from '~/src/store/actions/common'
import { getUserInfo } from '~/src/store/actions/auth'
import { uploadMeetingRecord, getMeeting, deleteMeeting, getCategory } from '~/src/store/actions/meeting'
import { addRecord, deleteRecord } from '~/src/store/actions/localRecord'
import { meetingListSelector, categorySelector } from '~/src/store/selectors/meeting'
import { processingLocalRecordSelector } from '~/src/store/selectors/localRecord'
import DocumentPicker from 'react-native-document-picker'
import Permissions from 'react-native-permissions'
import BackgroundTimer from 'react-native-background-timer'
import lodash from 'lodash'
import { PERMISSION_RESPONSE } from '~/src/constants'
import ToastUtils from '~/src/utils/ToastUtils'
import { chainParse, replacePatternString } from '~/src/utils'
import styles from './styles'
const emptyArray = []
import ContextMenu from '~/src/components/ContextMenu'
import { COLORS } from '~/src/themes/common'
import RNGetRealPath from 'react-native-get-real-path'
import { isConnectSelector } from '~/src/store/selectors/info'
import moment from "moment"

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keyword: '',
            statusFilter: '',
            isSearching: false,
            searchResult: [],
            showingFloatingOverlay: false,
            popupDeleteContent: '',
            loading: false,
            loadingFullscreen: false,
            refresing: false,
            recordInfo: null,
            showingCategory: false
        }
        this.didFocusListener = props.navigation.addListener(
            "didFocus",
            this.componentDidFocus
        )
        this.reloadInterval = -1
        this.deletingMeeting = ''
        this.deletingLocalPath = ''
    }


    _handleClearKeyword = () => {
        const isSearching = true
        this.setState({ keyword: '', isSearching }, () => {
            if (isSearching) {
                this._search()
            }
        })
    }

    _search = lodash.debounce(() => {
        this._load()
    }, 300)

    _handleChangeKeyword = (keyword) => {
        if (!keyword) {
            const isSearching = true
            this.setState({ keyword, isSearching }, () => {
                if (isSearching) {
                    this._search()
                }
            })
            return
        }
        this.setState({ keyword, isSearching: true }, () => {
            this._search()
        })
    }

    _handlePressStatusFilter = () => {
        this.filterMenu && this.filterMenu.open()
    }

    _handleChooseFilter = (item) => {
        console.log('Handle choose filter', item)
        if (item.id != this.state.statusFilter) {
            const isSearching = true
            this.setState({ statusFilter: item.id, isSearching }, () => {
                if (isSearching) {
                    this._search()
                }
            })
        }
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
            <TouchableOpacity
                onPress={this._handlePressMainFloating}
                style={styles.mainFloatingButtonTouchable}
            >
                <Image
                    source={require('~/src/image/add_new.png')}
                    style={styles.mainFloatingButton}
                />
            </TouchableOpacity>
        )
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

    _addRecord = (categoryId) => {
        this.setState({ showingCategory: false }, () => {
            const { addRecord, uploadMeetingRecord } = this.props
            addRecord(this.filePath, categoryId)
            setTimeout(() => {
                uploadMeetingRecord()
            }, 100)
            ToastUtils.showSuccessToast(replacePatternString(I18n.t('added_record_to_queue'), this.fileName))
        })
    }

    _handleSelectCategory = (category) => {
        console.log('_handleSelectCategory', category)
        this._addRecord(category.value)
    }

    _handleAgree = () => {
        this._addRecord('')
    }

    _handlePressImport = async () => {
        this._toggleOverlay()
        try {
            await this._requestPermission()
            const { category } = this.props
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio],
            })
            console.log('res', res)
            let filePath = res.uri
            if (Platform.OS == 'android') {
                filePath = await RNGetRealPath.getRealPathFromURI(res.uri)
            } else {
                filePath = decodeURIComponent(filePath).replace('file://', '')
            }
            this.filePath = filePath
            this.fileName = res.name
            console.log('filePath', filePath)
            console.log('category', category)
            this.setState({ showingCategory: true })
        } catch (err) {
            console.log('Picker error', err)
        }
    }

    _handlePressRecord = () => {
        this._toggleOverlay()
        this.props.navigation.navigate('Record')
    }

    _handlePressInfo = (recordInfo) => {
        console.log('_handlePressInfo', recordInfo)
        this.setState({ recordInfo }, () => {
            this.popupInfo && this.popupInfo.open()
        })

    }

    _handlePressDelete = (record) => {
        console.log('_handlePressDelete', record)
        this.deletingMeeting = record.id
        this.deletingLocalPath = record.localPath
        this.setState({ popupDeleteContent: record.name }, () => {
            this.popupConfirmDelete && this.popupConfirmDelete.open()
        })

    }

    _handlePressItem = (item) => {
        console.log('Pressing', item)
        if (item.localPath || item.status != MEETING_STATUS.DONE) return
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
                first_name={chainParse(item, ['user_info', 'first_name'])}
                last_name={chainParse(item, ['user_info', 'last_name'])}
                email={chainParse(item, ['user_info', 'email'])}
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
                            <Text className='green'>{I18n.t('record')}</Text>
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
                        <View className='space10' />
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
        const status_in = !this.state.statusFilter || this.state.statusFilter == -1 ? '' : `[${this.state.statusFilter}]`
        getMeeting('', page, this.state.keyword, status_in, (err, data) => {
            console.log('getMeeting err', err)
            console.log('getMeeting data', data)
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
        console.log("Home Did Focus")
        this._load()
        if (Platform.OS == 'android') {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor('transparent')
        }
    }

    _handleAppStateChange = (nextAppState) => {
        const { setAppState } = this.props
        setAppState(nextAppState)
    }


    componentDidMount() {
        const { uploadMeetingRecord, getUserInfo, getCategory } = this.props
        getUserInfo()
        getCategory((err, data) => {
            console.log('getCategory err', err)
            console.log('getCategory data', data)
        })
        uploadMeetingRecord()
        BackgroundTimer.runBackgroundTimer(() => {
            uploadMeetingRecord()
        }, CHECK_LOCAL_RECORD_PERIOD)
        AppState.addEventListener('change', this._handleAppStateChange)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.meetingList != this.props.meetingList) {
            if (!this.props.meetingList || !this.props.meetingList.data || this.props.meetingList.data.length == 0) return
            // If has not finished record
            if (this.reloadInterval == -1) {
                const notFinishMeeting = this.props.meetingList.data.find(item => item.status != MEETING_STATUS.DONE && item.status != MEETING_STATUS.FAILED && !(item.status == MEETING_STATUS.PROCESSING && item.progress == 0))
                console.log('notFinishMeeting', notFinishMeeting)
                if (notFinishMeeting) {
                    this.reloadInterval = setInterval(() => {
                        console.log('Running interval reload')
                        const { isConnect } = this.props
                        if (isConnect) {
                            this._load()
                        }
                    }, RELOAD_PROGRESS_PERIOD)
                    console.log('this.reloadInterval', this.reloadInterval)
                }
            } else {
                const notFinishMeeting = this.props.meetingList.data.find(item => item.status != MEETING_STATUS.DONE && item.status != MEETING_STATUS.FAILED)
                if (!notFinishMeeting) {
                    console.log('Interval clea')
                    this._clearInterval()
                }
            }
        }
    }

    _clearInterval = () => {
        clearInterval(this.reloadInterval)
        this.reloadInterval = -1
    }

    componentWillUnmount() {
        this._clearInterval()
        AppState.removeEventListener('change', this._handleAppStateChange)
    }

    _deleteMeeting = () => {
        const { deleteMeeting, deleteRecord } = this.props
        if (!this.deletingMeeting && !this.deletingLocalPath) return
        if (this.deletingLocalPath) {
            deleteRecord(this.deletingLocalPath)
            return
        }
        this.setState({ loadingFullscreen: true })
        deleteMeeting(this.deletingMeeting, (err, data) => {
            console.log('deleteMeeting err', err)
            console.log('deleteMeeting data', data)
            const statusCode = chainParse(data, ['httpHeaders', 'status'])
            this.deletingMeeting = ''
            this.setState({ loadingFullscreen: false })
            if (statusCode == 200) {
                ToastUtils.showSuccessToast(I18n.t('delete_record_success'))
                this._load()
            }
        })
    }

    _getDataForList = (processingLocalRecord, meetingData) => {
        return [...processingLocalRecord, ...meetingData]
    }

    _keyExtractor = item => item.id + ''

    _getCategoryForPopup = lodash.memoize((category) => {
        return category.map(item => ({
            name: item.name,
            value: item.id
        }))
    })

    render() {
        const { meetingList, processingLocalRecord, category } = this.props
        const categoryDateForPopup = this._getCategoryForPopup(category)
        const meetingListData = meetingList.data || emptyArray
        const notFinishMeeting = meetingListData.find(item => item.status != MEETING_STATUS.DONE && item.status != MEETING_STATUS.FAILED && !(item.status == MEETING_STATUS.PROCESSING && item.progress == 0))
        const listData = this._getDataForList(processingLocalRecord, meetingListData)
        return (
            <View className="flex white">
                {this._renderFloatingOverlay()}
                <ContextMenu
                    data={MEETING_STATUS_LIST}
                    onPress={this._handleChooseFilter}
                    ref={ref => this.filterMenu = ref}
                    style={styles.contextMenu}
                />
                <SelectPopup
                    values={categoryDateForPopup}
                    popupTitle={I18n.t('choose_category')}
                    onSelect={this._handleSelectCategory}
                    visible={this.state.showingCategory}
                    showButton={true}
                    onAgree={this._handleAgree}
                />
                <LoadingModal visible={this.state.loadingFullscreen} />
                <PopupConfirmDelete
                    ref={ref => this.popupConfirmDelete = ref}
                    title={I18n.t('delete_audio_confirm_title')}
                    content={this.state.popupDeleteContent}
                    positiveText={I18n.t('delete_audio')}
                    onPressYes={this._deleteMeeting}
                />
                <PopupConfirm
                    oneButton={true}
                    ref={ref => this.popupInfo = ref}
                    title={I18n.t('info')}
                >
                    {this.state.recordInfo ?
                        <View className='pv16'>
                            <Text className='s14 mb8'>{I18n.t('record_name')}: <Text className='textBlack bold s15'>{chainParse(this.state, ['recordInfo', 'name'])}</Text></Text>
                            <Text className='s14 mb8'>{I18n.t('create_time')}: <Text className='textBlack bold s15'>{chainParse(this.state, ['recordInfo', 'create_time']) ? moment(chainParse(this.state, ['recordInfo', 'create_time']) * 1000).format(I18n.t('full_date_time_format')) : ''}</Text></Text>
                            <Text className='s14 mb8'>{I18n.t('create_by')}: <Text className='textBlack bold s15'>{chainParse(this.state, ['recordInfo', 'first_name'])} {chainParse(this.state, ['recordInfo', 'last_name'])}</Text></Text>
                        </View>
                        :
                        <View />
                    }
                </PopupConfirm>
                <GradientToolbar
                    leftIcon={require('~/src/image/menu.png')}
                    onPressLeft={this._handlePressLeftMenu}
                    title={I18n.t('home_title')}
                    avatar={require('~/src/image/default_avatar.jpg')}
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
                        <TouchableOpacityHitSlop onPress={this._handlePressStatusFilter}>
                            <View className='row-start' style={{ marginLeft: 12 }}>
                                <Text numberOfLines={1}>{!this.state.statusFilter ? I18n.t('status') : MEETING_STATUS_INFO[this.state.statusFilter].name}</Text>
                                <View style={{ marginLeft: 10 }}>
                                    <Image source={require('~/src/image/dropdown.png')} style={{ width: 8, height: 4 }} />
                                </View>
                            </View>
                        </TouchableOpacityHitSlop>
                    </View>

                </View>
                {this._renderMainFloatingButton()}
                <FlatList
                    key={'dataList'}
                    onRefresh={this._refresh}
                    refreshing={this.state.refresing}
                    data={listData}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderMeetingItem}
                    ListFooterComponent={<View className='space100' />}
                    onEndReachedThreshold={0.2}
                    onEndReached={this._loadMore}
                />
                {!!notFinishMeeting &&
                    <View style={styles.processingContainer}>
                        <ActivityIndicator size={'small'} color={COLORS.GREEN} />
                    </View>
                }

            </View>
        )
    }
}

export default connect(state => ({
    meetingList: meetingListSelector(state),
    processingLocalRecord: processingLocalRecordSelector(state),
    isConnect: isConnectSelector(state),
    category: categorySelector(state)
}), {
    getUserInfo, uploadMeetingRecord,
    getMeeting, addRecord,
    deleteMeeting, deleteRecord,
    setAppState, getCategory
})(Home)