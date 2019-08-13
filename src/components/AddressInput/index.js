import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import Text from '~/src/themes/Text'
import commonStyle, { SURFACE_STYLES } from '~/src/themes/common'
import { COLORS } from '~/src/themes/common'
import { Button, TouchableRipple } from 'react-native-paper'
import I18n from '~/src/I18n'
import { TextInput3 as TextInput, PickerInput3 as PickerInput } from '~/src/themes/ThemeComponent'
import { getListProvince, getListDistrict, getListWard } from '~/src/store/actions/address'


class AddressInput extends Component {
    static navigationOptions = {
        headerTitle: I18n.t('add_product'),
    }

    constructor(props) {
        super(props)
        this.state = {
            provinceId: 0,
            provinceName: '',
            districtId: 0,
            districtName: '',
            wardId: 0,
            wardName: '',
            address: ''
        }
    }

    componentDidMount() {
    }

    _handlePressChooseProvince = () => {
        this.props.navigation.navigate('ProvincePicker', {
            callback: this._onChooseProvince
        })
    }

    _onChooseProvince = (item) => {
        console.log('On Choose Province', item)
        if (item.id == this.state.provinceId) return
        this.setState({
            provinceId: item.id,
            provinceName: item.name,
            districtId: 0,
            districtName: 0,
            wardId: 0,
            wardName: ''
        }, () => {
            const { onChange } = this.props
            onChange && onChange(this.state)
        })
    }

    _handlePressChooseDistrict = () => {
        if (this.state.provinceId == 0) return
        this.props.navigation.navigate('DistrictPicker', {
            callback: this._onChooseDistrict,
            provinceId: this.state.provinceId
        })
    }

    _onChooseDistrict = (item) => {
        console.log('On Choose District', item)
        if (item.districtId == this.state.districtId) return
        this.setState({
            districtId: item.districtId,
            districtName: item.name,
            wardId: 0,
            wardName: ''
        }, () => {
            const { onChange } = this.props
            onChange && onChange(this.state)
        })
    }

    _handlePressChooseWard = () => {
        console.log('Pressing Choose Ward', this.state)
        if (this.state.districtId == 0) return
        this.props.navigation.navigate('WardPicker', {
            callback: this._onChooseWard,
            districtId: this.state.districtId
        })
    }


    _onChooseWard = (item) => {
        console.log('On Choose District', item)
        if (item.wardId == this.state.wardId) return
        this.setState({
            wardId: item.districtId,
            wardName: item.name,
        }, () => {
            const { onChange } = this.props
            onChange && onChange(this.state)
        })
    }

    _handleChangeAddress = (text) => {
        this.setState({ address: text }, () => {
            const { onChange } = this.props
            onChange && onChange(this.state)
        })
    }

    render() {
        return (
            <View>
                <PickerInput
                    label={I18n.t('province')}
                    placeholder={I18n.t('choose_province_hint')}
                    value={this.state.provinceName}
                    onPress={this._handlePressChooseProvince}
                    style={SURFACE_STYLES.borderBottom}
                />
                <PickerInput
                    label={I18n.t('district')}
                    placeholder={I18n.t('choose_district_hint')}
                    value={this.state.districtName}
                    onPress={this._handlePressChooseDistrict}
                    style={SURFACE_STYLES.borderBottom}
                />
                <PickerInput
                    label={I18n.t('ward')}
                    placeholder={I18n.t('choose_ward')}
                    value={this.state.wardName}
                    onPress={this._handlePressChooseWard}
                    style={SURFACE_STYLES.borderBottom}
                />
                <TextInput
                    label={I18n.t('address')}
                    placeholder={I18n.t('input_address')}
                    onChangeText={this._handleChangeAddress}
                    value={this.state.address}
                    style={SURFACE_STYLES.borderBottom}
                />
            </View>
        )
    }
}

export default connect(null, { getListProvince, getListDistrict, getListWard })(AddressInput)