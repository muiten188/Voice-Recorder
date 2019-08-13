import React, { Component } from 'react';
import { StatusBar, Platform, SectionList, TouchableOpacity } from 'react-native';
import I18n from '~/src/I18n'
import { COLORS } from '~/src/themesnew/common'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import { getNotification, markReadNotification, markReadNotificationOffline } from '~/src/store/actions/notification'
import { connect } from 'react-redux'
import { chainParse } from '~/src/utils'
import { notificationDataSelector } from '~/src/store/selectors/notification'
import { READ_STATUS, ORDER_TAB } from '~/src/constants'
import { updateOrderOfflineTab } from '~/src/store/actions/order'
import moment from 'moment'
import { Toolbar, Text, View, Container } from '~/src/themesnew/ThemeComponent'
import lodash from 'lodash'

class Notification extends Component {

    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super();
        this.state = {
            loading: false,
            refreshing: false
        }
    }

    _handlePressNotification = (item) => {
        console.log('Notification', item)
        const { markReadNotificationOffline, markReadNotification } = this.props
        markReadNotificationOffline(item.id)
        markReadNotification(item.id, (err, data) => {
            console.log('markReadNotification err', err)
            console.log('markReadNotification data', data)
        })
        updateOrderOfflineTab(ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY)
        this.props.navigation.navigate("OrderList");
    }

    _getTitleTextComponent = (item) => {
        const titleTextClassName = (item.status == READ_STATUS.NOT_READ) ? 'bold' : ''
        const titleHighlightClassName = (item.status == READ_STATUS.NOT_READ) ? 'bold cerulean' : 'cerulean'
        if (!item || !item.title) return <View />
        return (
            <Text className={titleTextClassName}>{item.title
                .split(' ')
                .map((itr, itrIdx) => (!isNaN(itr) ?
                    <Text className={titleHighlightClassName} key={itrIdx}>{itr} </Text>
                    :
                    <Text className={titleTextClassName} key={itrIdx}>{itr} </Text>
                ))
            }</Text>
        )
    }

    _renderNotificationItem = ({ item, index }) => {
        const backgroundColor = (item.status == READ_STATUS.NOT_READ) ? COLORS.WHITE : "#fafafa"
        const titleTextClassName = (item.status == READ_STATUS.NOT_READ) ? 'bold' : ''
        return (
            <TouchableOpacity onPress={() => this._handlePressNotification(item)}>
                <View className='border-bottom2 ph24 pt16 pb12' style={{ backgroundColor }}>
                    <Text className={titleTextClassName}>{this._getTitleTextComponent(item)}</Text>
                    <Text className='gray lh16 s12' style={{ marginTop: 4 }}>{moment(item.createdTime * 1000).format(I18n.t('full_date_time_format'))}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _renderSectionHeader = ({ section: { title } }) => (
        <View className='row-start background ph24 pt16 pb8'>
            <Text className='caption'>{title}</Text>
        </View>
    )

    _load = (page = 1, refreshing = true) => {
        const { getNotification, merchantId } = this.props
        if (refreshing) {
            this.setState({ refreshing: true })
        } else {
            this.setState({ loading: true })
        }
        getNotification(merchantId, page, (err, data) => {
            console.log('getNotification err', err)
            console.log('getNotification data', data)
            this.setState({ refreshing: false, loading: false })
        })
    }

    _loadMore = () => {
        if (this.state.loading || this.state.refreshing) return
        const pageNumber = +chainParse(this.props, ['notificationData', 'pagingInfo', 'pageNumber'])
        const totalPages = +chainParse(this.props, ['notificationData', 'totalPages'])
        console.log('PageNumber, TotalPage', pageNumber, totalPages)
        if (pageNumber >= totalPages) return
        this._load(pageNumber + 1, false)
    }

    componentDidMount() {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }

        const { notificationData } = this.props
        const notificationDataContent = notificationData.content || []
        const showRefresh = notificationDataContent.length == 0
        this._load(1, showRefresh)
    }

    _getNotificationDataForSectionList = lodash.memoize(notificationDataContent => {
        const notificationDataObj = {}
        for (let i = 0; i < notificationDataContent.length; i++) {
            const key = moment(chainParse(notificationDataContent[i], ['createdTime']) * 1000).format(I18n.t('date_format'))
            if (!notificationDataObj[key]) {
                notificationDataObj[key] = [notificationDataContent[i]]
            } else {
                notificationDataObj[key].push(notificationDataContent[i])
            }
        }
        const orderObjKeys = Object.keys(notificationDataObj)
        const todayStr = moment().format(I18n.t('date_format'))
        const orderSectionList = orderObjKeys.map(item => ({
            title: item == todayStr ? I18n.t('today') : item,
            data: notificationDataObj[item]
        }))
        return orderSectionList
    })

    render() {
        const { notificationData } = this.props
        const notificationDataContent = notificationData.content || []
        const notificationDataSectionList = this._getNotificationDataForSectionList(notificationDataContent)
        return (
            <Container>
                <Toolbar
                    title={I18n.t('notification')}
                />
                <View className='flex'>
                    <SectionList
                        renderItem={this._renderNotificationItem}
                        renderSectionHeader={this._renderSectionHeader}
                        sections={notificationDataSectionList}
                        keyExtractor={(item, index) => item.id + '' + index}
                        refreshing={this.state.refreshing}
                        onRefresh={this._load}
                        onEndReached={this._loadMore}
                        onEndReachedThreshold={0.2}
                    />
                </View>
            </Container>
        )
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
    notificationData: notificationDataSelector(state)
}), { getNotification, markReadNotification, markReadNotificationOffline, updateOrderOfflineTab })(Notification)