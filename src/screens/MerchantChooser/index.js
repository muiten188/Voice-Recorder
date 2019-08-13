import React, { PureComponent } from 'react'
import { SafeAreaView, View, FlatList } from 'react-native'
import Text from '~/src/themes/Text'
import commonStyle, { SURFACE_STYLES, TEXT_STYLES } from '~/src/themes/common'
import Radio from '~/src/themes/Radio'
import { TouchableRipple, Button } from 'react-native-paper'
import { connect } from 'react-redux'
import I18n from '~/src/I18n'
import { merchantIdSelector, merchantListSelector } from '~/src/store/selectors/merchant'
import { setSelectMerchant } from '~/src/store/actions/merchant'
import { chainParse } from '~/src/utils'


class MerchantChooser extends PureComponent {
    static navigationOptions = {
        headerTitle: I18n.t('choose_merchant'),
    }

    constructor(props) {
        super(props)
        this.state = {
            selectedMerchantId: props.selectedMerchantId
        }
    }

    getSelected = () => {
        return this.state.selected
    }

    _handPress = (item) => {
        console.log('Pressing Item', item)

        const merchantId = chainParse(item, ['merchant', 'id'])
        if (merchantId != this.state.selectedMerchantId) {
            // setSelectMerchant(merchantId)
            this.setState({ selectedMerchantId: merchantId })
        }
    }

    _renderItem = ({ item, index }) => {
        return (
            <TouchableRipple onPress={() => this._handPress(item)}>
                <View style={[SURFACE_STYLES.rowStart, SURFACE_STYLES.borderBottom, { paddingVertical: 10 }]}>
                    <Radio checked={chainParse(item, ['merchant', 'id']) == this.state.selectedMerchantId}
                    />
                    <View style={SURFACE_STYLES.flex}>
                        <Text style={TEXT_STYLES.listItemTitle}>{chainParse(item, ['merchant', 'fullName'])}</Text>
                        <Text style={TEXT_STYLES.listItemCaption}>{chainParse(item, ['merchant', 'address'])}</Text>
                    </View>
                </View>
            </TouchableRipple>
        )
    }

    _handleSave = () => {
        const { setSelectMerchant } = this.props
        setSelectMerchant(this.state.selectedMerchantId)
        this.props.navigation.goBack()
    }

    render() {
        const { merchantList } = this.props
        return (
            <SafeAreaView style={SURFACE_STYLES.flex}>
                <View style={SURFACE_STYLES.flex}>
                    <View style={SURFACE_STYLES.containerHorizontalMargin}>
                        <FlatList
                            extraData={this.state.selectedMerchantId}
                            data={merchantList}
                            extraData={this.props}
                            renderItem={this._renderItem}
                            keyExtractor={item => '' + chainParse(item, ['merchant', 'id'])}
                        />
                    </View>
                    <View style={[SURFACE_STYLES.rowCenter, { position: 'absolute', bottom: 10, width: '100%' }]}>
                        <Button mode="contained" onPress={this._handleSave}>
                            {I18n.t('save')}
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

export default connect(state => ({
    selectedMerchantId: merchantIdSelector(state),
    merchantList: merchantListSelector(state)
}), { setSelectMerchant })(MerchantChooser)