import React, { PureComponent } from 'react'
import { Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native'
import commonStyle, { SURFACE_STYLES, TEXT_STYLES } from '~/src/themes/common'
import { COLORS } from '~/src/themes/common'
import Radio from '~/src/themes/Radio'
import { TouchableRipple, Button } from 'react-native-paper'
import { connect } from 'react-redux'
import I18n from '~/src/I18n'
import { merchantListSelector } from '~/src/store/selectors/merchant'
import { chainParse } from '~/src/utils'


class MerchantManager extends PureComponent {
    static navigationOptions = {
        headerTitle: I18n.t('merchant_manager'),
    }

    constructor(props) {
        super(props)
    }

    _handPress = (item) => {
        console.log('Pressing Item', item)
        this.props.navigation.navigate('StoreInfo', {
            merchantInfo: item
        })
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableRipple onPress={() => this._handPress(item)}>
                <View style={[SURFACE_STYLES.rowStart, SURFACE_STYLES.borderBottom, { paddingVertical: 10 }]}>
                    <View style={SURFACE_STYLES.flex}>
                        <Text style={TEXT_STYLES.listItemTitle}>{chainParse(item, ['merchant', 'fullName'])}</Text>
                        <Text style={TEXT_STYLES.listItemCaption}>{chainParse(item, ['merchant', 'address'])}</Text>
                    </View>
                </View>
            </TouchableRipple>
        )
    }

    _renderFooter = () => <View style={{ width: '100%', height: 50 }} />

    _handleAddMerchant = () => {
        this.props.navigation.navigate('StoreInfo')
    }

    render() {
        const { merchantList } = this.props
        return (
            <View style={[SURFACE_STYLES.containerHorizontalMargin, SURFACE_STYLES.flex]}>
                <FlatList
                    data={merchantList}
                    extraData={this.props}
                    renderItem={this._renderItem}
                    keyExtractor={item => '' + chainParse(item, ['merchant', 'id'])}
                    ListFooterComponent={this._renderFooter}
                />
                <View style={[SURFACE_STYLES.rowCenter, { position: 'absolute', bottom: 10, width: '100%' }]}>
                    <Button icon='add' mode="contained" onPress={this._handleAddMerchant}>
                        {I18n.t('add_merchant')}
                    </Button>
                </View>
            </View>
        )
    }
}

export default connect(state => ({
    merchantList: merchantListSelector(state)
}), {})(MerchantManager)