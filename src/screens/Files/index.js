import React, { Component } from "react"
import { connect } from 'react-redux'
import { FlatList, Platform } from 'react-native'
import { View, GradientToolbar, PopupConfirmDelete, SelectPopup } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import Permissions from 'react-native-permissions'
import { PERMISSION_RESPONSE } from '~/src/constants'
import { userInfoSelector } from '~/src/store/selectors/auth'
import { prepareSaveFilePath, replacePatternString } from '~/src/utils'
import RNFetchBlob from "rn-fetch-blob"
import FileItem from './FileItem'
import ToastUtils from '~/src/utils/ToastUtils'
import { addRecord } from '~/src/store/actions/localRecord'
import { uploadMeetingRecord } from '~/src/store/actions/meeting'
import { categorySelector } from '~/src/store/selectors/meeting'
import lodash from 'lodash'

class Files extends Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            popupDeleteContent: '',
            showingCategory: false
        }
        this.filePath = ''
        this.didFocusListener = props.navigation.addListener(
            "didFocus",
            this.componentDidFocus
        )
    }


    _handlePressLeftMenu = () => {
        this.props.navigation.openDrawer()
    }

    _loadFiles = async () => {
        try {
            const { userInfo } = this.props
            console.log('userInfio', userInfo)
            this.filePath = await prepareSaveFilePath(userInfo.username)
            console.log('Filepath', this.filePath)
            const files = await RNFetchBlob.fs.ls(this.filePath)
            const audioFiles = files.filter(item => item.endsWith('aac') || item.endsWith('mp3'))
            this.setState({ files: audioFiles })
        } catch (err) {
            console.log('Files err', err)
        }
    }

    componentDidFocus = async () => {
        console.log("Files Did Focus")
        try {
            await this._requestPermission()
            this._loadFiles()
        } catch (err) {
            console.log('Permission err', err)
        }
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

    componentDidMount = () => {
    }

    _keyExtractor = item => item

    _handlePress = (item) => {
        console.log('Pressing Item', item)

        this.props.navigation.navigate('PlayerLocal', {
            name: item,
            path: Platform.OS == 'ios' ? encodeURI(this.filePath + '/' + item) : this.filePath + '/' + item
        })
    }

    _handlePressDelete = (item) => {
        console.log('_handlePressDelete', item)
        this.deletingItem = item
        this.setState({ popupDeleteContent: item }, () => {
            this.popupConfirmDelete && this.popupConfirmDelete.open()
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
            this.props.navigation.navigate('Home')
        })
    }

    _handleSelectCategory = (category) => {
        console.log('_handleSelectCategory', category)
        this._addRecord(category.value)
    }

    _handleAgree = () => {
        this._addRecord('')
    }

    _handlePressUpload = (item) => {
        console.log('_handlePressUpload', item)
        const filePath = this.filePath + '/' + item
        this.filePath = filePath
        this.fileName = item
        this.setState({ showingCategory: true })
    }


    _deleteFile = async () => {
        console.log('_deleteFile', this.deletingItem)
        if (!this.deletingItem) return
        await RNFetchBlob.fs.unlink(this.filePath + '/' + this.deletingItem)
        ToastUtils.showSuccessToast(replacePatternString(I18n.t('delete_file_success'), this.deletingItem))
        this.deletingItem = ''
        this._loadFiles()
    }

    _renderFileItem = ({ item, index }) => {
        return (
            <FileItem
                item={item}
                onPress={this._handlePress}
                onPressDelete={this._handlePressDelete}
                onPressUpload={this._handlePressUpload}
            />
        )
    }

    _getCategoryForPopup = lodash.memoize((category) => {
        return category.map(item => ({
            name: item.name,
            value: item.id
        }))
    })

    render() {
        const { category } = this.props
        const categoryDateForPopup = this._getCategoryForPopup(category)
        return (
            <View className="flex white">
                <SelectPopup
                    values={categoryDateForPopup}
                    popupTitle={I18n.t('choose_category')}
                    onSelect={this._handleSelectCategory}
                    visible={this.state.showingCategory}
                    showButton={true}
                    onAgree={this._handleAgree}
                />
                <PopupConfirmDelete
                    ref={ref => this.popupConfirmDelete = ref}
                    title={I18n.t('delete_audio_confirm_title')}
                    content={this.state.popupDeleteContent}
                    positiveText={I18n.t('delete_audio')}
                    onPressYes={this._deleteFile}
                />
                <GradientToolbar
                    leftIcon={require('~/src/image/menu.png')}
                    onPressLeft={this._handlePressLeftMenu}
                    title={I18n.t('record_file')}
                    avatar={require('~/src/image/default_avatar.jpg')}
                />
                <FlatList
                    data={this.state.files}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderFileItem}
                    ListFooterComponent={<View className='space100' />}
                />

            </View>
        )
    }
}

export default connect(state => ({
    userInfo: userInfoSelector(state),
    category: categorySelector(state)
}), { addRecord, uploadMeetingRecord })(Files)