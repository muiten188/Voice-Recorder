import React, { Component } from "react";
import { TouchableOpacity } from 'react-native'
import { View, Text, GradientToolbar, SearchBox } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import { VOICE_STATUS_LIST } from '~/src/constants'
import Picker from '~/src/components/Picker'
import { getElevation } from '~/src/utils'
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
                        <View className='white row-center' style={styles.mainFloatingButton}>
                            <Icon name='note-plus-outline' size={40} color={COLORS.GREEN} />
                        </View>
                        <View className='space12' />
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
    }


    _renderFloatingOverlay = () => {
        if (!this.state.showingFloatingOverlay) return <View />
        return (
            <View style={styles.floatingOverlay}>



                <View className='row-center'>
                    <TouchableOpacity onPress={this._handlePressImport}>
                        <View className='column-center'>
                            <View style={styles.importActionContainer}>
                                <Icon name='cloud-download-outline' size={24} color={COLORS.BLUE} />
                            </View>
                            <View className='space8' />
                            <Text className='blue'>{I18n.t('import')}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: 100 }} />
                    <TouchableOpacity onPress={this._handlePressRecord}>
                    <View className='column-center'>
                        <View style={styles.recordActionContainer}>
                            <Icon name='microphone-outline' size={24} color={COLORS.GREEN} />
                        </View>
                        <View className='space8' />
                        <Text className='green'>{I18n.t('recording')}</Text>
                    </View>
                    </TouchableOpacity>
            </View>

            <View className='space32' />
            <TouchableOpacity onPress={this._handlePressMainFloating}>
                <View>
                    <View className='white row-center' style={styles.mainFloatingButton}>
                        <Icon name='note-plus-outline' size={40} color={COLORS.GREEN} />
                    </View>
                    <View className='space12' />
                    <Text className='green center'>{I18n.t('add_new')}</Text>
                    <View className='space32' />
                </View>
            </TouchableOpacity>

            </View >
        )
    }



    render() {
        return (
            <View className="flex background">
                {this._renderFloatingOverlay()}
                <GradientToolbar
                    title={I18n.t('home_title')}
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