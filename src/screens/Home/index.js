import React, { Component } from "react";
import { TouchableOpacity, Image } from 'react-native'
import { View, Text, GradientToolbar, SearchBox } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import { VOICE_STATUS_LIST } from '~/src/constants'
import Picker from '~/src/components/Picker'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "~/src/themes/common";
import styles from './styles'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            statusFilter: '',
            showingFloatingOverlay: false
        }
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
                        <View className='space32' />
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    _handlePressImport = () => {
        this._toggleOverlay()
    }

    _handlePressRecord = () => {
        this._toggleOverlay()
        this.props.navigation.navigate('Record')
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
                        <View className='space32' />
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    _handlePressLeftMenu = () => {
        this.props.navigation.openDrawer()
    }


    render() {
        return (
            <View className="flex background">
                {this._renderFloatingOverlay()}
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
                {this._renderMainFloatingButton()}


            </View>
        )
    }
}