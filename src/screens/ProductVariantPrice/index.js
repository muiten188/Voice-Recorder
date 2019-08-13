import React, { PureComponent } from 'react'
import { SafeAreaView, View, TextInput, Text } from 'react-native'
import commonStyle, { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { Button, Colors, TouchableRipple } from 'react-native-paper'
import { connect } from 'react-redux'
import I18n from '~/src/I18n'
import { getListProvince } from '~/src/store/actions/address'
import { formatMoney, revertFormatMoney } from '~/src/utils'
import styles from './styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StackActions } from 'react-navigation'
import ImageChooser from '~/src/components/ImageChooser'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

class ProductVariantChooser extends PureComponent {
    static navigationOptions = {
        headerTitle: I18n.t('product_variant_price_config_hint'),
    }

    constructor(props) {
        super(props)
        const variantDefs = props.navigation.getParam('variantDefs')
        const variantValues = props.navigation.getParam('variantValues')
        const defaultVariantConfig = this._generateVariantPriceConfigMapping(variantDefs, variantValues)
        console.log('variantDefs', variantDefs)
        console.log('variantDefs', variantValues)
        console.log('defaultVariantConfig', defaultVariantConfig)
        this.state = {
            variantConfig: defaultVariantConfig
        }
    }

    _generateVariantPriceConfigMapping = (variantDefs, variantValues) => {
        const defaultVariantConfig = {}
        const variants = variantDefs
            .filter(item => (
                item.name
                && item.values.some(variantValueItem => variantValueItem.choosed)
            ))
        console.log('variantDefs', variantDefs)
        console.log('Variants', variants)
        console.log('variantValues', variantValues)
        const saleProductMedias = this.props.navigation.getParam('saleProductMedias')
        console.log('saleProductMedias', saleProductMedias)
        if (variants.length == 1) {
            const variantValue0Length = variants[0].values.length
            for (let i = 0; i < variantValue0Length; i++) {
                if (!variants[0].values[i].choosed) continue
                const images = (variantValues[i] && variantValues[i].images && variantValues[i].images.length > 0) ?
                    variantValues[i].images :
                    saleProductMedias && saleProductMedias.length > 0 ?
                        saleProductMedias
                            .filter(item => item.productVariantId == variantValues[i].id)
                            .map(item => ({
                                ...item,
                                id: item.uploadImageId,
                                uri: item.url
                            }))
                        : []
                console.log('Image Of This variant', images)
                console.log('variantValues[i]', variantValues[i])
                // && (variantValues[i].originalPrice > 0 || variantValues[i].price > 0) && variantValues[i].quantity > 0
                defaultVariantConfig[variants[0].values[i]['value']] =
                    (variantValues[i] && variantValues[i].id) ?
                        {
                            ...variantValues[i],
                            price: variantValues[i].price || variantValues[i].originalPrice || '0',
                            quantity: variantValues[i].quantity + '' || '0',
                            images: images,
                            displayName: variantValues[i].displayName || '',
                            isExpand: false
                        }
                        :
                        {
                            quantity: '0',
                            price: '0',
                            images: [],
                            displayName: '',
                            isExpand: false
                        }
            }
        } else if (variants.length == 2) {
            const variantValue0Length = variants[0].values.length
            const variantValue1Length = variants[1].values.length
            for (let i = 0; i < variantValue0Length; i++) {
                for (let j = 0; j < variantValue1Length; j++) {
                    const index = i * variantValue1Length + j
                    if (!variants[0] || !variants[0].values || !variants[0].values[i] || !variants[0].values[i].choosed
                        || !variants[1] || !variants[1].values || !variants[1].values[j] || !variants[1].values[j].choosed) continue

                    const images = (variantValues[index] && variantValues[index].images && variantValues[index].images.length > 0) ?
                        variantValues[index].images :
                        saleProductMedias && saleProductMedias.length > 0 ?
                            saleProductMedias
                                .filter(item => item.productVariantId == variantValues[index].id)
                                .map(item => ({
                                    ...item,
                                    id: item.uploadImageId,
                                    uri: item.url
                                }))
                            : []
                    console.log('Image Of This variant', images)
                    console.log('variantValues[index]', variantValues[index])
                    // (variantValues[index].originalPrice > 0 || variantValues[index].price > 0) && variantValues[index].quantity > 0
                    defaultVariantConfig[`${variants[0].values[i]['value']}-${variants[1].values[j]['value']}`] =
                        (variantValues[index] && variantValues[index].id) ?
                            {
                                ...variantValues[index],
                                price: variantValues[index].price || variantValues[index].originalPrice || '0',
                                quantity: variantValues[index].quantity + '' || '0',
                                images: images,
                                displayName: variantValues[index].displayName || '',
                                isExpand: false
                            }
                            :
                            {
                                quantity: '0',
                                price: '0',
                                images: [],
                                displayName: '',
                                isExpand: false
                            }
                }
            }
        }
        return defaultVariantConfig
    }

    _handleChangeQuantity = (key, text) => {
        const newConfig = { ...this.state.variantConfig }
        newConfig[key].quantity = text
        this.setState({ variantConfig: newConfig })
    }

    _handleChangePrice = (key, text) => {
        const newConfig = { ...this.state.variantConfig }
        newConfig[key].price = text
        this.setState({ variantConfig: newConfig })
    }

    componentDidMount() {

    }

    _handleSave = () => {
        // const variants = this.props.navigation.getParam('variants')
        const variantDefs = this.props.navigation.getParam('variantDefs')
        const variants = variantDefs
            .filter(item => (
                item.name
                && item.values.some(variantValueItem => variantValueItem.choosed)
            ))
        const variantValues = []
        console.log('Variant Config', this.state.variantConfig)
        if (variants.length == 1) {
            variants[0].values.forEach(variant => {
                const key = variant.value
                if (this.state.variantConfig[key]) {
                    variantValues.push({
                        ...this.state.variantConfig[key],
                        name: key,
                        price: +revertFormatMoney(this.state.variantConfig[key].price),
                        quantity: +this.state.variantConfig[key].quantity,
                        images: this.state.variantConfig[key].images,
                        displayName: this.state.variantConfig[key].displayName
                    })
                } else {
                    variantValues.push({
                        id: '',
                        name: key,
                        price: 0,
                        quantity: 0,
                        images: [],
                        displayName: ''
                    })
                }
            })
        } else if (variants.length == 2) {
            variants[0].values.forEach(firstVariant => {
                variants[1].values.forEach(secondVariant => {
                    const combineKey = `${firstVariant.value}-${secondVariant.value}`
                    if (this.state.variantConfig[combineKey]) {
                        variantValues.push({
                            ...this.state.variantConfig[combineKey],
                            name: combineKey,
                            price: +revertFormatMoney(this.state.variantConfig[combineKey].price),
                            quantity: +this.state.variantConfig[combineKey].quantity,
                            imageUrl: '',
                            images: this.state.variantConfig[combineKey].images,
                            displayName: this.state.variantConfig[combineKey].displayName
                        })
                    } else {
                        variantValues.push({
                            id: '',
                            optionId: '',
                            optionValueId: '',
                            name: combineKey,
                            price: 0,
                            quantity: 0,
                            imageUrl: '',
                            images: [],
                            displayName: ''
                        })
                    }
                })
            })
        }

        const callback = this.props.navigation.getParam('callback')
        callback && callback({
            variantDefs: variants,
            variantValues
        })
        const popAction = StackActions.pop({
            n: 2,
        });
        this.props.navigation.dispatch(popAction);
    }

    _handleUpdateImage = (images, key) => {
        console.log('Update Images', images)
        const newConfig = { ...this.state.variantConfig }
        newConfig[key].images = images
        this.setState({ variantConfig: newConfig })
    }

    _handleChangeNameCustomize = (key, text) => {
        const newConfig = { ...this.state.variantConfig }
        newConfig[key].displayName = text
        this.setState({ variantConfig: newConfig })
    }


    _renderInput = () => {
        const variantDefs = this.props.navigation.getParam('variantDefs')
        const variants = variantDefs
            .filter(item => (
                item.name
                && item.values.some(variantValueItem => variantValueItem.choosed)
            ))
            .map(item => ({
                ...item,
                values: item.values
                    .filter(variantValueItem => !!variantValueItem.choosed)
            }))
        if (variants.length == 1) {
            return (
                <View style={[styles.block, { paddingTop: 10 }]}>
                    {variants[0].values.map((variant, index) => (
                        <View key={variant.value} style={styles.subBlock}>
                            <View style={[SURFACE_STYLES.flex]}>
                                <View style={styles.rowInput}>
                                    <Text style={styles.title}>{variant.value}</Text>
                                    <View style={[SURFACE_STYLES.rowSpacebetween, SURFACE_STYLES.flex]}>
                                        <TextInput
                                            style={styles.input}
                                            underlineColorAndroid={'transparent'}
                                            keyboardType={'number-pad'}
                                            value={this.state.variantConfig[variant.value].quantity}
                                            onChangeText={text => this._handleChangeQuantity(variant.value, text)}
                                        />
                                        <View style={SURFACE_STYLES.rowStart}>
                                            <TextInput
                                                style={styles.input}
                                                underlineColorAndroid={'transparent'}
                                                keyboardType={'number-pad'}
                                                value={formatMoney(this.state.variantConfig[variant.value].price)}
                                                onChangeText={text => this._handleChangePrice(variant.value, text)}
                                            />
                                        </View>
                                    </View>
                                </View>
                                {!!this.state.variantConfig[variant.value].isExpand && (
                                    <View>
                                        <View style={styles.rowInput}>
                                            <Text style={styles.title}>{I18n.t('name_customize')}</Text>
                                            <TextInput
                                                style={styles.input2}
                                                underlineColorAndroid={'transparent'}
                                                value={this.state.variantConfig[variant.value].displayName}
                                                onChangeText={text => this._handleChangeNameCustomize(variant.value, text)}
                                            />
                                        </View>
                                        <ImageChooser
                                            imageKey={variant.value}
                                            label={I18n.t('photo')}
                                            onUpdateImage={this._handleUpdateImage}
                                            listImage={this.state.variantConfig[variant.value].images}
                                        />
                                    </View>
                                )}
                            </View>
                            <TouchableRipple
                                rippleColor={COLORS.RIPPLE}
                                onPress={() => {
                                    const newConfig = { ...this.state.variantConfig }
                                    newConfig[variant.value].isExpand = !newConfig[variant.value].isExpand
                                    this.setState({ variantConfig: newConfig })
                                }}
                                style={{ paddingVertical: 3 }}
                            >
                                <Icon name={this.state.variantConfig[variant.value].isExpand ? 'chevron-up' : 'chevron-down'} size={24} color={COLORS.RIPPLE} />
                            </TouchableRipple>
                        </View>

                    ))}
                </View>
            )
        } else if (variants.length == 2) {
            return (
                <View>
                    {variants[0].values.map(firstVariant => {
                        return (
                            <View key={firstVariant.value} style={styles.block}>
                                <Text style={styles.titleBlock}>{firstVariant.value}</Text>
                                {variants[1].values.map(secondVariant => {
                                    const combineKey = `${firstVariant.value}-${secondVariant.value}`
                                    return (
                                        <View key={combineKey} style={styles.subBlock}>
                                            <View style={SURFACE_STYLES.flex}>
                                                <View style={styles.rowInput}>
                                                    <Text style={styles.title}>{secondVariant.value}</Text>
                                                    <View style={[SURFACE_STYLES.rowSpacebetween, SURFACE_STYLES.flex]}>
                                                        <TextInput
                                                            style={styles.input}
                                                            underlineColorAndroid={'transparent'}
                                                            keyboardType={'number-pad'}
                                                            value={this.state.variantConfig[combineKey].quantity}
                                                            onChangeText={text => this._handleChangeQuantity(combineKey, text)}
                                                        />
                                                        <TextInput
                                                            style={styles.input}
                                                            underlineColorAndroid={'transparent'}
                                                            keyboardType={'number-pad'}
                                                            value={formatMoney(this.state.variantConfig[combineKey].price)}
                                                            onChangeText={text => this._handleChangePrice(combineKey, text)}
                                                        />
                                                    </View>
                                                </View>
                                                {!!this.state.variantConfig[combineKey].isExpand && (
                                                    <View>
                                                        <View style={styles.rowInput}>
                                                            <Text style={styles.title}>{I18n.t('name_customize')}</Text>
                                                            <TextInput
                                                                style={styles.input2}
                                                                underlineColorAndroid={'transparent'}
                                                                value={this.state.variantConfig[combineKey].displayName}
                                                                onChangeText={text => this._handleChangeNameCustomize(combineKey, text)}
                                                            />
                                                        </View>
                                                        <ImageChooser
                                                            label={I18n.t('photo')}
                                                            imageKey={combineKey}
                                                            onUpdateImage={this._handleUpdateImage}
                                                            listImage={this.state.variantConfig[combineKey].images}
                                                        />
                                                    </View>
                                                )}

                                            </View>

                                            <TouchableRipple
                                                rippleColor={COLORS.RIPPLE}
                                                onPress={() => {
                                                    const newConfig = { ...this.state.variantConfig }
                                                    newConfig[combineKey].isExpand = !newConfig[combineKey].isExpand
                                                    this.setState({ variantConfig: newConfig })
                                                }}
                                                style={{ paddingVertical: 3 }}
                                            >
                                                <Icon name={this.state.variantConfig[combineKey].isExpand ? 'chevron-up' : 'chevron-down'} size={24} color={COLORS.RIPPLE} />
                                            </TouchableRipple>

                                        </View>
                                    )
                                })}
                            </View>
                        )
                    })}
                </View>
            )
        } else {
            return <View />
        }
    }

    _isEnableButton = () => {
        const variantConfigValues = Object.values(this.state.variantConfig)
        const allItemHasPrice = variantConfigValues.every(item => +revertFormatMoney(item.price) > 0)
        if (!allItemHasPrice) return false
        const someItemHasInStock = variantConfigValues.some(item => +item.quantity > 0)
        return someItemHasInStock
    }

    render() {
        const isEnableContinue = this._isEnableButton()
        console.log('Current VariantConfig', this.state.variantConfig)
        return (
            <SafeAreaView style={SURFACE_STYLES.flex}>
                <View style={SURFACE_STYLES.screenContainerCommon}>
                    <View style={SURFACE_STYLES.space8} />
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{I18n.t('product_variant')}</Text>
                        <Text style={styles.title}>{I18n.t('warehouse')}</Text>
                        <Text style={styles.title}>{I18n.t('price')}</Text>
                    </View>
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        keyboardShouldPersistTaps={'handled'}
                        enableOnAndroid={true}
                    >
                        {this._renderInput()}
                        <View style={SURFACE_STYLES.bottomButtonSpace} />
                    </KeyboardAwareScrollView>
                    <View style={styles.bottomButtonContainer}>
                        <Button mode="contained" onPress={this._handleSave} disabled={!isEnableContinue}>
                            {I18n.t('save')}
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

export default connect(null, { getListProvince })(ProductVariantChooser)