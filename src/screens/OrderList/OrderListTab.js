import React, { Component } from 'react'
import { SectionList, Image } from 'react-native'
import { chainParse } from '~/src/utils'
import I18n from '~/src/I18n'
import { Text, View, SearchDateInput } from '~/src/themesnew/ThemeComponent'
import { getOrderForSectionList } from './utils'
import { FORM_MODE } from '~/src/constants'
import { FlatList } from 'react-native-gesture-handler';
import OrderListItem from '~/src/components/OrderListItem'
import { generateHighlightText, getWidth } from '~/src/utils'
import { textStyles } from '~/src/themesnew/Text'
import { DEVICE_WIDTH } from '~/src/themesnew/common'

export default class OrderListTab extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showSearch: false
        }
    }

    _renderHeader = ({ section: { title } }) => {
        return (
            <View className='ph24 pt16 pb8 background'>
                <Text className='caption'>{title}</Text>
            </View>
        );
    }

    _handlePressOrder = (item) => {
        console.log('_handlePressOrder', item)
        const { isDeleting } = this.props
        if (!isDeleting) {
            this.props.navigation.navigate('OrderDetail', {
                orderInfo: item,
                shouldeEmptyCart: true,
                mode: FORM_MODE.EDIT
            })
        }
    }


    _renderItem = ({ item, index, section }) => {
        const { onDeleteOrder, isDeleting } = this.props
        return (
            <OrderListItem
                data={item}
                showDelete={isDeleting}
                onDelete={onDeleteOrder}
                onPress={this._handlePressOrder}
            />
        )
    };

    _handleChangeStartDate = (newStartDate) => {
        console.log('_handleChangeStartDate', newStartDate)
        const { updateSearchParam, search, searchParam } = this.props

        if (!searchParam || !searchParam.endTime) {
            updateSearchParam({ startTime: newStartDate, endTime: newStartDate.clone().endOf('day'), isSearching: true })
            setTimeout(() => {
                search()
            }, 100)
        } else {
            updateSearchParam({ startTime: newStartDate, isSearching: true })
            setTimeout(() => {
                search()
            }, 100)
        }

    }

    _handleChangeEndDate = (newEndDate) => {
        console.log('_handleChangeEndDate', newEndDate)
        const { updateSearchParam, search, searchParam } = this.props
        if (!searchParam || !searchParam.startTime) {
            updateSearchParam({ startTime: newEndDate.clone().startOf('day'), endTime: newEndDate, isSearching: true })
            setTimeout(() => {
                search()
            }, 100)
        } else {
            updateSearchParam({ endTime: newEndDate, isSearching: true })
            setTimeout(() => {
                search()
            }, 100)
        }

    }

    _clearDate = () => {
        const { updateSearchParam } = this.props
        updateSearchParam({ startTime: '', endTime: '', isSearching: false })
    }

    _handleBackKeyword = () => {
        const { updateSearchParam, searchParam, search } = this.props
        if (searchParam.startTime) {
            updateSearchParam({ keyword: '' })
            setTimeout(() => {
                search()
            }, 100)
        } else {
            updateSearchParam({ keyword: '', isSearching: false })
        }

    }

    _handlePressDelete = () => {
        const { onPressDeleteIcon } = this.props
        onPressDeleteIcon()
    }

    _handleChangeKeyword = (keyword) => {
        const { updateSearchParam, search } = this.props
        updateSearchParam({ keyword, isSearching: true })
        setTimeout(() => {
            search()
        }, 100)
    }

    _handleClearKeyword = () => {
        const { updateSearchParam, search } = this.props
        updateSearchParam({ keyword: '' })
        setTimeout(() => {
            search()
        }, 100)
    }

    _toggleShowSearch = (isShow) => {
        if (typeof (isShow) == 'undefined') {
            this.setState({ showSearch: !this.state.showSearch })
        } else {
            this.setState({ showSearch: isShow })
        }

    }

    _renderSearch = () => {
        const { searchParam, isConnected, isDeleting } = this.props
        return <SearchDateInput
            keyword={searchParam.keyword || ''}
            onChangeKeyword={this._handleChangeKeyword}
            onClearKeyword={this._handleClearKeyword}
            startDate={searchParam.startTime || ''}
            endDate={searchParam.endTime || ''}
            onChangeStartDate={this._handleChangeStartDate}
            onChangeEndDate={this._handleChangeEndDate}
            onClearDate={this._clearDate}
            onPressDelete={this._handlePressDelete}
            onBackKeyword={this._handleBackKeyword}
            showSearch={this.state.showSearch}
            showDelete={isConnected}
            toggleSearch={this._toggleShowSearch}
            placeholder={I18n.t('search_order')}
            isDeleting={isDeleting}
        />
    }

    _renderSearchResultHeader = () => {
        return (
            <View className='row-start background ph24 pt16 pb8'>
                <Text className='caption'>{I18n.t('search_result')}</Text>
            </View>
        )
    }

    _renderEmptyState = () => {
        return (
            <View className='white' style={{ width: DEVICE_WIDTH }}>
                <View className='space12 background' />
                <View className='row-center' style={{ marginTop: getWidth(80) }}>
                    <Image source={require('~/src/image/empty_order.png')}
                        style={{ width: getWidth(160), height: getWidth(107) }}
                    />
                </View>
                <View className='column-center' style={{ marginTop: getWidth(25), marginHorizontal: getWidth(42) }}>
                    <Text className='center'>
                        <Text className='s14 gray bold'>{I18n.t('no_order')}</Text>
                        {"\n\n"}
                        {generateHighlightText(
                            I18n.t('create_order_hint'),
                            { ...textStyles.gray, ...textStyles.s14 },
                            { ...textStyles.cerulean, ...textStyles.s14, ...textStyles.bold }
                        )}
                    </Text>
                </View>
                <View className='column-center' style={{ marginTop: 40 }}>
                    <Image source={require('~/src/image/imgArrow.png')}
                        style={{ width: getWidth(27), height: getWidth(77.4), position: 'absolute', left: getWidth(136), top: 0 }}
                    />
                </View>

            </View>
        )
    }

    _handleEndReachdSearchResult = () => {
        const { onEndReachedSearch } = this.props
        onEndReachedSearch && onEndReachedSearch()
    }

    _handleEndReached = () => {
        const { onEndReached } = this.props
        onEndReached && onEndReached()
    }

    render() {
        const { orderList, searchResult, searchParam, isDeleting, refreshing, onRefresh } = this.props
        const orderListContent = orderList.content || []
        const orderSectionList = getOrderForSectionList(orderListContent)

        return (
            <View className='white'>
                {this._renderSearch()}
                {(searchParam && searchParam.isSearching) ?
                    <FlatList
                        ListHeaderComponent={this._renderSearchResultHeader}
                        data={searchResult}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => chainParse(item, ['order', 'id']) + ''}
                        ListFooterComponent={<View className='space50' />}
                        onEndReached={this._handleEndReachdSearchResult}
                        onEndReachedThreshold={0.2}
                    />
                    :
                    ((!orderSectionList || orderSectionList.length == 0) ?
                        this._renderEmptyState()
                        :
                        <SectionList
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            extraData={isDeleting}
                            renderItem={this._renderItem}
                            renderSectionHeader={this._renderHeader}
                            sections={orderSectionList}
                            keyExtractor={(item, index) => item.id + "" + index}
                            ListFooterComponent={<View className='space50' />}
                            onEndReached={this._handleEndReached}
                            onEndReachedThreshold={0.2}
                        />
                    )
                }
            </View>
        )
    }

}