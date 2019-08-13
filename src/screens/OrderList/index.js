import React, { PureComponent, Component } from 'react'
import { StatusBar, Platform, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import I18n from '~/src/I18n'
import { PopupConfirm, Text, View, Container } from '~/src/themesnew/ThemeComponent'
import { DEVICE_WIDTH, DEVICE_HEIGHT, COLORS } from '~/src/themesnew/common'
import { TabView, TabBar } from "react-native-tab-view";
import {
    getOrderByTab, deleteOrderOnline, searchOrder,
    updateWaitingOrderSearchParam, updateWaitingOrderSearchResult,
    updatePaidOrderSearchParam, updatePaidOrderSearchResult
} from "~/src/store/actions/order";
import { ORDER_TAB } from '~/src/constants'
import { merchantIdSelector } from "~/src/store/selectors/merchant";
import {
    waitingOrderSelector, paidOrderSelector, orderTabSelector,
    waitingOrderSearchParamSelector, waitingOrderSearchResultSelector,
    paidOrderSearchParamSelector, paidOrderSearchResultSelector
} from '~/src/store/selectors/order'
import OrderListTab from './OrderListTab'
import styles from './styles'
import { chainParse, replacePatternString } from '~/src/utils'
import lodash from 'lodash'
import LoadingModal from '~/src/components/LoadingModal'
import { syncFloorTableFromNetwork } from '~/src/store/actions/table'
import ToastUtils from '~/src/utils/ToastUtils'
import { isConnectSelector } from '~/src/store/selectors/info'

class OrderList extends Component {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            index: props.orderTab == ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY ? 0 : 1,
            routes: [
                { key: 'waiting_order', title: I18n.t('waiting_order') },
                { key: 'paid_order', title: I18n.t('paid_order') },
            ],
            loading: false,
            loadingOrder: false,
            searchingOrder: false,
            popupDeleteContent: '',
            deletingWaitingOrder: false,
            deletingPaidOrder: false,
            refreshingWaitingOrder: false,
            refreshingPaidOrder: false
        }
        this.didFocusListener = props.navigation.addListener(
            "didFocus",
            this.componentDidFocus
        )
        this.selectingOrderId = ''
        this.selectingOrderCode = ''
    }

    _handleRefresh = () => {
        this._load(1, true)
    }

    _load = (page = 1, refreshing = false) => {
        const { merchantId, getOrderByTab } = this.props
        const orderTab = this.state.index == 0 ? ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY : ORDER_TAB.ORDER_OFFLINE_PAID;
        if (refreshing) {
            const refreshingWaitingOrder = (this.state.index == 0)
            const refreshingPaidOrder = (this.state.index == 1)
            this.setState({ loadingOrder: true, refreshingWaitingOrder, refreshingPaidOrder })
        } else {
            this.setState({ loadingOrder: true })
        }

        getOrderByTab(merchantId, orderTab, page, (err, data) => {
            this.setState({ loadingOrder: false })
            console.log("getOrderByTab err", err);
            console.log("getOrderByTab data", data);
            this.setState({ refreshing: false, loading: false, refreshingWaitingOrder: false, refreshingPaidOrder: false });
        })
    }

    _handleChangeIndexTabView = index => {
        this.setState({ index, deletingWaitingOrder: false, deletingPaidOrder: false }, () => {
            this._load()
        });
    }

    componentDidFocus = () => {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }
        this.setState({
            deletingPaidOrder: false,
            deletingWaitingOrder: false
        }, () => {
            this._load()
        })
    };

    componentDidMount() {
        // this._load()
    }

    _handlePressCreateOrder = () => {
        this.props.navigation.navigate('CreateOrder')
    }

    componentDidUpdate(prevProps) {
        const { merchantId } = this.props
        if (merchantId && prevProps.orderTab != this.props.orderTab) {
            const newIndex = this.props.orderTab == ORDER_TAB.ORDER_OFFLINE_WAIT_FOR_PAY ? 0 : 1
            this._handleChangeIndexTabView(newIndex)
        }
    }

    _deleteOrder = () => {
        if (!this.selectingOrderId) return
        const { deleteOrderOnline } = this.props
        this.setState({ loading: true })
        deleteOrderOnline(this.selectingOrderId, (err, data) => {
            console.log('deleteOrderOnline err', err)
            console.log('deleteOrderOnline data', data)
            this.setState({ loading: false, deletingPaidOrder: false, deletingWaitingOrder: false })
            const httpStatus = chainParse(data, ['httpHeaders', 'status'])
            if (httpStatus == 200) {
                ToastUtils.showSuccessToast(replacePatternString(I18n.t('delete_order_success2'), `"${this.selectingOrderCode}"`))
                this._load()
            }
        })
    }

    _handlePressDeleteWaitingOrder = () => {
        this.setState({ deletingWaitingOrder: !this.state.deletingWaitingOrder })
    }

    _handlePressDeletePaidOrder = () => {
        this.setState({ deletingPaidOrder: !this.state.deletingPaidOrder })
    }

    _handleDeleteOrder = ({ orderId, orderCode }) => {
        this.selectingOrderId = orderId
        this.selectingOrderCode = orderCode
        const warnMessage = replacePatternString(I18n.t('warning_delete_order'), `"${orderCode}"`)
        this.setState({
            popupDeleteContent: warnMessage
        }, () => {
            this.popupConfirmDelete && this.popupConfirmDelete.open()
        })
    }

    _search = lodash.debounce((keyword, fromDate, toDate, status, page = 1, callback) => {
        const { searchOrder } = this.props
        const requestObj = {
            fromDate,
            toDate,
            orderCode: keyword,
            pageSize: 30,
            page: page,
            status
        };
        this.setState({ searchingOrder: true })
        searchOrder(requestObj, (err, data) => {
            console.log('searchOrder err', err)
            console.log('searchOrder Data', data)
            this.setState({ searchingOrder: false })
            const httpStatus = chainParse(data, ['httpHeaders', 'status'])
            if (httpStatus == 200) {
                callback && callback(err, data)
            }
        })
    }, 300)

    _handleEndReachedWaitingOrder = () => {
        const { waitingOrderList } = this.props
        console.log('_handleEndReachedWaitingOrder', waitingOrderList)
        if (this.state.loadingOrder) return
        const pageNumber = chainParse(waitingOrderList, ['pagingInfo', 'pageNumber'])
        const totalPages = chainParse(waitingOrderList, ['totalPages'])
        console.log('Page Number Total Page', pageNumber, totalPages)
        if (pageNumber >= totalPages) return
        this._load(pageNumber + 1)
    }

    _handleEndReachedSearchWaitingOrder = () => {
        const { waitingOrderSearchResult } = this.props
        console.log('_handleEndReachedSearchWaitingOrder', waitingOrderSearchResult)
        if (this.state.searchingOrder) return
        const pageNumber = chainParse(waitingOrderSearchResult, ['pagingInfo', 'pageNumber'])
        const totalPages = chainParse(waitingOrderSearchResult, ['totalPages'])
        console.log('Page Number Total Page', pageNumber, totalPages)
        if (pageNumber >= totalPages) return
        this._searchWaitingOrder(pageNumber + 1)
    }

    _handleEndReachedPaidOrder = () => {
        const { paidOrderList } = this.props
        console.log('_handleEndReachedPaidOrder', paidOrderList)
        if (this.state.loadingOrder) return
        const pageNumber = chainParse(paidOrderList, ['pagingInfo', 'pageNumber'])
        const totalPages = chainParse(paidOrderList, ['totalPages'])
        if (pageNumber >= totalPages) return
        this._load(pageNumber + 1)
    }

    _handleEndReachedSearchPaidOrder = () => {
        const { paidOrderSearchResult } = this.props
        console.log('_handleEndReachedSearchPaidOrder', paidOrderSearchResult)
        if (this.state.searchingOrder) return
        const pageNumber = chainParse(paidOrderSearchResult, ['pagingInfo', 'pageNumber'])
        const totalPages = chainParse(paidOrderSearchResult, ['totalPages'])
        console.log('Page Number Total Page', pageNumber, totalPages)
        if (pageNumber >= totalPages) return
        this._searchPaidOrder(pageNumber + 1)
    }

    _searchWaitingOrder = (page = 1) => {
        const { waitingOrderSearchParam, updateWaitingOrderSearchResult } = this.props
        console.log('waitingOrderSearchParam', waitingOrderSearchParam)
        const keyword = waitingOrderSearchParam.keyword || ''
        const fromDate = waitingOrderSearchParam.startTime ? waitingOrderSearchParam.startTime.unix() : -1
        const toDate = waitingOrderSearchParam.endTime ? waitingOrderSearchParam.endTime.unix() : -1
        const status = '0,1'
        this._search(keyword, fromDate, toDate, status, page, (err, data) => {
            console.log('_searchWaitingOrder err', err)
            console.log('_searchWaitingOrder data', data)
            if (data && typeof (data.content) != 'undefined') {
                updateWaitingOrderSearchResult(data)
            }

        })
    }

    _searchPaidOrder = (page = 1) => {
        const { paidOrderSearchParam, updatePaidOrderSearchResult } = this.props
        const keyword = paidOrderSearchParam.keyword || ''
        const fromDate = paidOrderSearchParam.startTime ? paidOrderSearchParam.startTime.unix() : -1
        const toDate = paidOrderSearchParam.endTime ? paidOrderSearchParam.endTime.unix() : -1
        const status = '5,8'
        this._search(keyword, fromDate, toDate, status, page, (err, data) => {
            console.log('_searchWaitingOrder err', err)
            console.log('_searchWaitingOrder data', data)
            if (data && typeof (data.content) != 'undefined') {
                updatePaidOrderSearchResult(data)
            }
        })
    }


    _renderScene = ({ route }) => {
        // console.log('_renderScene', route)
        const { waitingOrderList, paidOrderList,
            updateWaitingOrderSearchParam, waitingOrderSearchParam, waitingOrderSearchResult,
            updatePaidOrderSearchParam, paidOrderSearchParam, paidOrderSearchResult,
            isConnected
        } = this.props
        switch (route.key) {
            case 'waiting_order':
                return <OrderListTab
                    orderList={waitingOrderList}
                    navigation={this.props.navigation}
                    onDeleteOrder={this._handleDeleteOrder}
                    onPressDeleteIcon={this._handlePressDeleteWaitingOrder}
                    isDeleting={this.state.deletingWaitingOrder}
                    updateSearchParam={updateWaitingOrderSearchParam}
                    searchParam={waitingOrderSearchParam}
                    search={this._searchWaitingOrder}
                    searchResult={waitingOrderSearchResult.content || []}
                    onEndReached={this._handleEndReachedWaitingOrder}
                    onEndReachedSearch={this._handleEndReachedSearchWaitingOrder}
                    isConnected={isConnected}
                    refreshing={this.state.refreshingWaitingOrder}
                    onRefresh={this._handleRefresh}
                />
            case 'paid_order':
                return <OrderListTab
                    orderList={paidOrderList}
                    navigation={this.props.navigation}
                    onDeleteOrder={this._handleDeleteOrder}
                    onPressDeleteIcon={this._handlePressDeletePaidOrder}
                    isDeleting={this.state.deletingPaidOrder}
                    updateSearchParam={updatePaidOrderSearchParam}
                    searchParam={paidOrderSearchParam}
                    search={this._searchPaidOrder}
                    searchResult={paidOrderSearchResult.content || []}
                    onEndReached={this._handleEndReachedPaidOrder}
                    onEndReachedSearch={this._handleEndReachedSearchPaidOrder}
                    isConnected={isConnected}
                    refreshing={this.state.refreshingPaidOrder}
                    onRefresh={this._handleRefresh}
                />
            default:
                return null;
        }
    };

    _getFocusRoute = () => {
        if (this.state.index == 0) return 'waiting_order'
        return 'paid_order'
    }

    render() {
        return (
            <Container>
                <View className='flex background'>
                    <LoadingModal visible={this.state.loading} />
                    <PopupConfirm
                        ref={ref => this.popupConfirmDelete = ref}
                        content={this.state.popupDeleteContent}
                        onPressYes={this._deleteOrder}
                        onPressNo={() => {
                            this.selectingOrderId = ''
                            this.selectingOrderCode = ''
                        }}
                    />
                    <TabView
                        navigationState={this.state}
                        onIndexChange={this._handleChangeIndexTabView}
                        renderScene={this._renderScene}
                        initialLayout={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
                        useNativeDriver={true}
                        animationEnabled={false}
                        swipeEnabled={false}
                        renderTabBar={props => {
                            return (
                                <TabBar
                                    {...props}
                                    indicatorStyle={styles.indicatorStyle}
                                    style={styles.barStyle}
                                    tabStyle={styles.tabStyle}
                                    renderLabel={({ route }) => {
                                        const activeRoute = this._getFocusRoute()
                                        const focused = route.key == activeRoute
                                        return (
                                            <Text className='s12' style={{ fontWeight: focused ? 'bold' : 'normal', color: focused ? COLORS.CERULEAN : COLORS.TEXT_GRAY }}>
                                                {route.title}
                                            </Text>
                                        )
                                    }}
                                />
                            )
                        }}
                        style={{ backgroundColor: COLORS.WHITE }}
                    />
                    <View className='bottom transparent'>
                        <TouchableOpacity onPress={this._handlePressCreateOrder}>
                            <View className='row-center ph16' style={styles.createOrderBtn}>
                                <Image source={require('~/src/image/add_white.png')} style={styles.addIconBtn} />
                                <Text className='s12 white bold ls0'>{I18n.t('create_order')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>
        )
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
    waitingOrderList: waitingOrderSelector(state),
    paidOrderList: paidOrderSelector(state),
    orderTab: orderTabSelector(state),
    waitingOrderSearchParam: waitingOrderSearchParamSelector(state),
    waitingOrderSearchResult: waitingOrderSearchResultSelector(state),
    paidOrderSearchParam: paidOrderSearchParamSelector(state),
    paidOrderSearchResult: paidOrderSearchResultSelector(state),
    isConnected: isConnectSelector(state)
}), {
        getOrderByTab, deleteOrderOnline, searchOrder,
        updateWaitingOrderSearchParam, updateWaitingOrderSearchResult,
        updatePaidOrderSearchParam, updatePaidOrderSearchResult,
        syncFloorTableFromNetwork
    })(OrderList)