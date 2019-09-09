import React, { Component } from "react";
import { FlatList, Image } from 'react-native'
import { View, Text, GradientToolbar, SearchBox, PopupConfirmDelete } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import { VOICE_STATUS_LIST } from '~/src/constants'
import Picker from '~/src/components/Picker'
import records from './data'
import moment from 'moment'


export default class Documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    _handlePressLeftMenu = () => {
        this.props.navigation.openDrawer()
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

    _renderDocumentItem = ({ item, index }) => {
        return (
            <View className='row-start'>
                <Image source={require('~/src/image/document2.png')} style={{ width: 25, height: 25, marginHorizontal: 16 }} />
                <View className='pv16 border-bottom flex' style={{ paddingRight: 14 }}>
                    <Text className='bold s14 mb8'>{item.name}</Text>
                    <Text className='s13 gray mb4'>{moment(item.time * 1000).format(I18n.t('full_date_time_format'))}</Text>
                    <View className='row-start mb4'>
                        <Image source={require('~/src/image/audio.png')} style={{ width: 11, height: 14, marginRight: 4 }} />
                        <Text className='s13 gray'>{item.name}</Text>
                    </View>
                    <Text className='s13 gray mb4'>{I18n.t('edit_by')}: {item.editBy}</Text>
                </View>
            </View>
        )
    }


    render() {
        return (
            <View className="flex white">
                <GradientToolbar
                    onPressLeft={this._handlePressLeftMenu}
                    leftIcon={require('~/src/image/menu.png')}
                    title={I18n.t('document_title')}
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
                            options={VOICE_STATUS_LIST.map(item => ({
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
                <FlatList
                    data={records}
                    keyExtractor={item => item.id + ''}
                    renderItem={this._renderDocumentItem}
                />

            </View>
        );
    }
}