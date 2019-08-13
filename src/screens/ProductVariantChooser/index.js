import React, { PureComponent } from 'react'
import { SafeAreaView, View, FlatList, Text } from 'react-native'
import commonStyle, { SURFACE_STYLES } from '~/src/themes/common'
import { COLORS } from '~/src/themes/common'
import { TouchableRipple, Button } from 'react-native-paper'
import { connect } from 'react-redux'
import I18n from '~/src/I18n'
import { getListProvince } from '~/src/store/actions/address'
import ProductVariantItem from '~/src/components/ProductVariantItem'
import styles from './styles'
import lodash from 'lodash'
import { DEFAULT_VARIANT_DEFS } from '~/src/constants'


class ProductVariantChooser extends PureComponent {
    static navigationOptions = {
        headerTitle: I18n.t('add_product_variant'),
    }

    constructor(props) {
        super(props)
        const variantDefs = props.navigation.getParam('variantDefs')
        const variantValues = props.navigation.getParam('variantValues')
        const newVariantDefs = this._generateChoosedVariantDefs(variantDefs, variantValues)
        console.log('ProductVariantChooser variantDefs', variantDefs)
        console.log('ProductVariantChooser variantValues', variantValues)
        console.log('ProductVariantChooser newVariantDefs', newVariantDefs)
        this.state = {
            variantDefs: (newVariantDefs && newVariantDefs.length > 0) ? newVariantDefs : DEFAULT_VARIANT_DEFS
        }
    }

    componentDidMount() {

    }

    _generateChoosedVariantDefs = (variantDefs, variantValues) => {
        // Deep clone
        const newVariantDefs = lodash.cloneDeep(variantDefs)
        if (variantDefs.length == 1) {
            const variantDefValues0Length = newVariantDefs[0].values.length
            for (let i = 0; i < variantDefValues0Length; i++) {
                if (variantValues[i].price > 0 && variantValues[i].quantity > 0) {
                    newVariantDefs[0]['values'][i] = {
                        ...newVariantDefs[0]['values'][i],
                        choosed: true
                    }
                }
            }
        } else if (variantDefs.length == 2) {
            const variantDefValues0Length = newVariantDefs[0].values.length
            const variantDefValues1Length = newVariantDefs[1].values.length
            for (let i = 0; i < variantDefValues0Length; i++) {
                for (let j = 0; j < variantDefValues1Length; j++) {
                    const index = i * variantDefValues1Length + j
                    if (variantValues[index].price > 0 && variantValues[index].quantity > 0) {
                        console.log('variantValues[index]', index, variantValues[index])
                        console.log('i j', index, i, j)
                        console.log('Values i', newVariantDefs[0]['values'][i])
                        console.log('Values j', newVariantDefs[1]['values'][j]  )
                        newVariantDefs[0]['values'][i] = {
                            ...newVariantDefs[0]['values'][i],
                            choosed: true
                        }
                        newVariantDefs[1]['values'][j] = {
                            ...newVariantDefs[1]['values'][j],
                            choosed: true
                        }
                    }
                }

            }
        }
        return newVariantDefs
    }

    _handleContinue = () => {
        console.log('This.state.variantDefs', this.state.variantDefs)
        // const variantDefsChoosedValue = this.state.variantDefs
        //     .filter(item => (
        //         item.name
        //         && item.values.some(variantValueItem => variantValueItem.choosed)
        //     ))
        // const choosedVariant = variantDefsChoosedValue
        //     .map(item => ({
        //         ...item,
        //         values: item.values
        //             .filter(variantValueItem => !!variantValueItem.choosed)
        //             .map(variantValueItem => lodash.pick(variantValueItem, ['id', 'value']))
        //     }))
        // const variantDefsMapping = variantDefsChoosedValue
        //     .map(item => ({
        //         ...item,
        //         values: item.values
        //             .map(variantValueItem => lodash.pick(variantValueItem, ['id', 'value']))
        //     }))

        const variantValues = this.props.navigation.getParam('variantValues')
        const saleProductMedias = this.props.navigation.getParam('saleProductMedias')
        const callback = this.props.navigation.getParam('callback')
        this.props.navigation.navigate('ProductVariantPrice', {
            // variants: choosedVariant,
            variantDefs: this.state.variantDefs,
            variantValues,
            saleProductMedias,
            callback
        })
    }

    _handleSelectVariant = (variantIndex, item) => {
        const newVariants = [...this.state.variantDefs]
        const pressingItemIndex = newVariants[variantIndex].values.findIndex(itemItr => itemItr.id == item.id && itemItr.value == item.value)
        if (pressingItemIndex < 0) return
        const cloneVariantValues = [...newVariants[variantIndex].values]
        cloneVariantValues[pressingItemIndex] = {
            ...cloneVariantValues[pressingItemIndex],
            choosed: !cloneVariantValues[pressingItemIndex].choosed
        }
        newVariants[variantIndex] = {
            ...newVariants[variantIndex],
            values: cloneVariantValues
        }
        this.setState({ variantDefs: newVariants })
    }

    _handleDeleteVariant = (variantIndex, item) => {
        const newVariants = [...this.state.variantDefs]
        const deleteItemIndex = newVariants[variantIndex].values.findIndex(itemItr => itemItr.id == item.id && itemItr.value == item.value)
        if (deleteItemIndex < 0) return
        const cloneVariantValues = [...newVariants[variantIndex].values]
        cloneVariantValues.splice(deleteItemIndex, 1)
        newVariants[variantIndex] = {
            ...newVariants[variantIndex],
            values: cloneVariantValues
        }
        this.setState({ variantDefs: newVariants })
    }

    _handleAddVariant = (variantIndex, newVariantName) => {
        const newVariants = [...this.state.variantDefs]
        newVariants[variantIndex] = {
            ...newVariants[variantIndex],
            values: [
                ...newVariants[variantIndex].values,
                {
                    id: '',
                    value: newVariantName
                }
            ]
        }
        this.setState({ variantDefs: newVariants })
    }

    _handleChangeVariantName = (variantIndex, newName) => {
        const newVariants = [...this.state.variantDefs]
        newVariants[variantIndex] = {
            ...newVariants[variantIndex],
            name: newName
        }
        this.setState({ variantDefs: newVariants })
    }

    _renderVariantItem = ({ item, index }) => {

        return (
            <ProductVariantItem
                variantName={item.name}
                variantValues={item.values}
                variantIndex={index}
                onChangeVariantName={this._handleChangeVariantName}
                onSelectVariant={this._handleSelectVariant}
                onDeleteVariant={this._handleDeleteVariant}
                onAddVariant={this._handleAddVariant}
                style={{ marginBottom: 8 }}
            />
        )
    }

    render() {
        // If all variants must selected
        // const isEnableContinue = (this.state.variantDefs.findIndex(
        //     item => (!item.name || item.values.filter(variantValueItem => variantValueItem.choosed).length == 0)
        // ) < 0)
        const isEnableContinue = this.state.variantDefs.filter(item => (item.name && item.values.filter(variantValueItem => variantValueItem.choosed).length > 0)).length > 0
        return (
            <SafeAreaView style={SURFACE_STYLES.flex}>
                <View style={SURFACE_STYLES.screenContainerCommon}>
                    <View style={SURFACE_STYLES.space8} />
                    <FlatList
                        data={this.state.variantDefs}
                        keyExtractor={(item, index) => item.name}
                        renderItem={this._renderVariantItem}
                    />
                    <View style={styles.bottomButtonContainer}>
                        <Button mode="contained" onPress={this._handleContinue} disabled={!isEnableContinue}>
                            {I18n.t('continue_choose_product_variant_hint')}
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

export default connect(null, { getListProvince })(ProductVariantChooser)