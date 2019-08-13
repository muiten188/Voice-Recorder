import React, { Component } from 'react';
import { SafeAreaView, View, Share } from 'react-native';
import { Text, TouchableRipple, Button, Caption } from 'react-native-paper'
import { RadioGroup, Checkbox } from '~/src/themes/ThemeComponent'
import { COLORS, SURFACE_STYLES, TEXT_STYLES } from '~/src/themes/common'
import I18n from '~/src/I18n'
import AddressInput from '~/src/components/AddressInput'
import { getDeliveryMethod } from '~/src/store/actions/merchant'
import { connect } from 'react-redux'
import LoadingModal from '~/src/components/LoadingModal'
import { merchantSelector } from '~/src/store/selectors/merchant'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { deliveryMethodSelector } from '~/src/store/selectors/merchant'

class ShippingManager extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: I18n.t('shipping_manager'),
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            name: '',
            phoneNumber: '',
            provinceName: '',
            districtName: '',
            wardName: '',
            address: '',
            useStoreAddress: false
        }
    }


    _handleChangeAddress = (addressInfo) => {
        this.setState({
            provinceName: addressInfo.provinceName,
            districtName: addressInfo.districtName,
            wardName: addressInfo.wardName,
            address: addressInfo.address,
        })
    }

    _handleSave = () => {

    }

    componentDidMount() {
        this.props.getDeliveryMethod((err, data) => {
            console.log('Delivery Err', err)
            console.log('Delivery Data', data)
        })
    }

    _handlePressCheckbox = () => {
        this.setState({ useStoreAddress: !this.state.useStoreAddress })
    }

    render() {
        return (
            <View style={SURFACE_STYLES.flex}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                    enableOnAndroid={true}
                >
                    <View style={[SURFACE_STYLES.containerHorizontalMargin, { paddingVertical: 10 }]}>

                        <RadioGroup
                            ref={ref => this.deliveryMethodRadioGroup = ref}
                            options={this.props.deliveryMethod}
                            label={I18n.t('delivery_method')}
                            value={this.state.deliveryMethod}
                        />
                    </View>
                    <View style={[SURFACE_STYLES.seperator]} />
                    <View style={[SURFACE_STYLES.containerHorizontalMargin, { paddingVertical: 10 }]}>
                        <Caption style={{ color: 'rgba(0, 0, 0, 0.54)' }}>{I18n.t('shipping_address2')}</Caption>
                        <AddressInput
                            navigation={this.props.navigation}
                            onChange={this._handleChangeAddress}
                        />
                        <View style={SURFACE_STYLES.space8} />
                        <Checkbox
                            onPress={this._handlePressCheckbox}
                            textT={'use_store_address'}
                            checked={this.state.useStoreAddress}
                        />
                    </View>
                    <View style={SURFACE_STYLES.bottomButtonSpace} />
                </KeyboardAwareScrollView>
                <View style={{ position: 'absolute', zIndex: 10, bottom: 10, left: 0, right: 0, paddingHorizontal: 10, ...SURFACE_STYLES.rowCenter }}>
                    <Button mode="contained" onPress={this._handleSave}>
                        {I18n.t('save')}
                    </Button>
                </View>
            </View >
        );
    }
}

export default connect(state => ({
    merchantInfo: merchantSelector(state),
    deliveryMethod: deliveryMethodSelector(state),
}), { getDeliveryMethod })(ShippingManager)