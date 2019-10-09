import React, { Component } from "react"
import { connect } from 'react-redux'
import { FlatList, TouchableOpacity, Image, Platform, ActivityIndicator, AppState } from 'react-native'
import { View, Text, GradientToolbar, SearchBox, PopupConfirmDelete, TouchableOpacityHitSlop, PopupConfirm } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import Permissions from 'react-native-permissions'
import { PERMISSION_RESPONSE } from '~/src/constants'
import { userInfoSelector } from '~/src/store/selectors/auth'
import { prepareSaveFilePath } from '~/src/utils'

class Files extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.didFocusListener = props.navigation.addListener(
            "didFocus",
            this.componentDidFocus
        )
    }


    _handlePressLeftMenu = () => {
        this.props.navigation.openDrawer()
    }

    componentDidFocus = async () => {
        console.log("Files Did Focus")
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

    componentDidMount = async () => {
        try {
            const { userInfo } = this.props
            console.log('userInfio', userInfo)
            await this._requestPermission()
        } catch (err) {
            console.log('Files err', err)
        }
    }

    _keyExtractor = item => item.id + ''

    render() {

        return (
            <View className="flex white">
                <PopupConfirmDelete
                    ref={ref => this.popupConfirmDelete = ref}
                    title={I18n.t('delete_audio_confirm_title')}
                    content={this.state.popupDeleteContent}
                    positiveText={I18n.t('delete_audio')}
                    onPressYes={this._deleteMeeting}
                />
                <GradientToolbar
                    leftIcon={require('~/src/image/menu.png')}
                    onPressLeft={this._handlePressLeftMenu}
                    title={I18n.t('record_file')}
                    avatar={require('~/src/image/default_avatar.jpg')}
                />
                {/* <FlatList
                    key={'dataList'}
                    onRefresh={this._refresh}
                    refreshing={this.state.refresing}
                    data={listData}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderMeetingItem}
                    ListFooterComponent={<View className='space100' />}
                    onEndReachedThreshold={0.2}
                    onEndReached={this._loadMore}
                /> */}

            </View>
        )
    }
}

export default connect(state => ({
    userInfo: userInfoSelector(state)
}))(Files)