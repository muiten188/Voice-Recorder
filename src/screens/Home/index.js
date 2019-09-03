import React, { Component } from "react";
import { View, Text, GradientToolbar, SearchBox } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import { Dropdown } from 'react-native-material-dropdown'
import { VOICE_STATUS_LIST } from '~/src/constants'
import Picker from '~/src/components/Picker'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            statusFilter: '',
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

    render() {
        return (
            <View className="flex background">
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


            </View>
        )
    }
}