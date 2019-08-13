import React, { PureComponent } from 'react'
import { View, FlatList, Text, TextInput } from 'react-native'
import commonStyle, { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { TouchableRipple } from 'react-native-paper'
import I18n from '~/src/I18n'
import { chainParse } from '~/src/utils'
import styles from './styles'
import VariantValueItem from './VariantValueItem'

export default class ProductVariantItem extends PureComponent {
    static navigationOptions = {
        headerTitle: I18n.t('add_product_variant'),
    }

    constructor(props) {
        super(props)
        this.state = {
            isEditing: false,
            isAdding: false,
            newVariantName: '',
        }
    }

    componentDidMount() {

    }

    _handlePressEditFunction = () => {
        this.setState({ isEditing: !this.state.isEditing })
    }

    _handlePressItem = (item) => {
        if (this.state.isEditing) return
        const { onSelectVariant, variantIndex } = this.props
        onSelectVariant && onSelectVariant(variantIndex, item)
    }

    _handleDeleteItem = (item) => {
        const { variantIndex, onDeleteVariant } = this.props
        onDeleteVariant && onDeleteVariant(variantIndex, item)
    }

    _handlePressAdd = () => {
        this.setState({ isAdding: true })
    }

    _renderVariantValueItem = ({ item, index }) => {
        return <VariantValueItem item={item} isEditing={this.state.isEditing} onPress={this._handlePressItem}
            onDelete={this._handleDeleteItem}
        />
    }

    _handleAddVariant = (e) => {
        console.log('Adding Variant', e)
        if (!this.state.newVariantName) {
            this.setState({ isAdding: false })
        } else {
            this.setState({
                isAdding: false,
            }, () => {
                const { variantIndex, onAddVariant } = this.props
                onAddVariant && onAddVariant(variantIndex, this.state.newVariantName)
            })
        }
    }

    _handleChangeVariantName = (text) => {
        const { variantIndex, onChangeVariantName } = this.props
        onChangeVariantName && onChangeVariantName(variantIndex, text)
    }

    _renderVariantValueAdd = () => {
        if (this.state.isAdding) {
            return (
                <View style={styles.variantSingleValueItemContainer}>
                    <TextInput
                        value={this.state.newVariantName}
                        onChangeText={text => this.setState({ newVariantName: text })}
                        underlineColorAndroid={'transparent'}
                        autoFocus={true}
                        style={styles.newVariantNameTextInput}
                        onEndEditing={this._handleAddVariant}
                    />
                </View>
            )
        }
        return <VariantValueItem item={{ id: '', value: I18n.t('add_with_plus_sign') }} isEditing={false} onPress={this._handlePressAdd} />
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        // console.log('Current variantName', this.props.variantName)
        // console.log('variantName Diff', prevProps.variantName !== this.props.variantName)
        // console.log('variantValues Diff', prevProps.variantValues !== this.props.variantValues)
        // console.log('variantIndex Diff', prevProps.variantIndex !== this.props.variantIndex)
        // console.log('onChangeVariantName Diff', prevProps.onChangeVariantName !== this.props.onChangeVariantName)
        // console.log('onSelectVariant Diff', prevProps.onSelectVariant !== this.props.onSelectVariant)
        // console.log('onDeleteVariant Diff', prevProps.onDeleteVariant !== this.props.onDeleteVariant)
        // console.log('onAddVariant Diff', prevProps.onAddVariant !== this.props.onAddVariant)
        // console.log('isEditing Diff', prevState.isEditing !== this.state.isEditing)
        // console.log('isAdding Diff', prevState.isAdding !== this.state.isAdding)
        // console.log('newVariantName Diff', prevState.newVariantName !== this.state.newVariantName)
    }

    render() {
        const { isEditing } = this.state
        const { style, variantName, variantValues } = this.props
        // console.log('Render Product Variant Item', variantName, variantValues)
        return (
            <View style={[styles.item, style]}>
                <View style={styles.variantNameContainer}>
                    {isEditing ?
                        <TextInput
                            value={variantName}
                            onChangeText={this._handleChangeVariantName}
                            underlineColorAndroid={'transparent'}
                            autoFocus={true}
                            style={styles.variantNameTextInput}
                        />
                        :
                        <Text style={styles.variantName}>{variantName}</Text>
                    }

                    <TouchableRipple
                        onPress={this._handlePressEditFunction}
                        rippleColor={COLORS.RIPPLE}
                    >
                        <Text style={styles.function}>{isEditing ? I18n.t('done') : I18n.t('edit')}</Text>
                    </TouchableRipple>
                </View>
                <View style={styles.variantValueItemContainer}>
                    <FlatList
                        extraData={this.state}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={variantValues}
                        keyExtractor={item => item.id + '' + item.value}
                        renderItem={this._renderVariantValueItem}
                        ListFooterComponent={this._renderVariantValueAdd}
                    />
                </View>
            </View>
        )

        return (
            <View />
        )
    }
}