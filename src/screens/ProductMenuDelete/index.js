import React, { PureComponent } from 'react'
import { FlatList, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { formatMoney, chainParse, getPrice, replacePatternString } from '~/src/utils'
import I18n from '~/src/I18n'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import { productListSelector } from '~/src/store/selectors/product'
import Image from 'react-native-fast-image'
import { Toolbar, Text, View, PopupConfirm } from '~/src/themesnew/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themesnew/common'
import Accordion from 'react-native-collapsible/Accordion'
import { allProductMenuSelector } from '~/src/store/selectors/menu'
import { removeMerchantMenu } from '~/src/store/actions/menu'
import LoadingModal from '~/src/components/LoadingModal'
import { syncProductAndMenu } from '~/src/store/actions/backgroundSync'
import { removeProduct } from "~/src/store/actions/product";
import ProductItem from '~/src/components/ProductItem'
import ToastUtils from '~/src/utils/ToastUtils'

class ProductMenuDelete extends PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            activeSections: [0],
            popupDeleteMenuContent: '',
            popupDeleteProductContent: '',
            selectedMenuId: '',
            selectedProductId: '',
            selectedMenuName: '',
            selectetProductName: ''
        }
    }

    _deleteMenu = () => {
        console.log('Deleting Menu', this.selectedMenuId)
        if (!this.selectedMenuId) return
        const { removeMerchantMenu, syncProductAndMenu } = this.props
        this.setState({ loading: true })
        removeMerchantMenu(this.selectedMenuId, (err, data) => {
            console.log('removeMerchantMenu err', err)
            console.log('removeMerchantMenu err', data)
            this.selectedMenuId = ''
            if (chainParse(data, ['httpHeaders', 'status']) == 200) {
                // Reload Menu
                ToastUtils.showSuccessToast(replacePatternString(I18n.t('delete_menu_success'), `"${this.selectedMenuName}"`))
                this.props.navigation.goBack()
                syncProductAndMenu()
            }
            this.setState({ loading: false })
        })
    }

    _handPressDeleteMenu = (section) => {
        console.log('_handPressDeleteMenu', section)
        this.selectedMenuId = section.id
        this.selectedMenuName = section.name
        const warnMessage = replacePatternString(I18n.t('warn_delete_menu'), `"${section.name}"`)
        this.setState({
            popupDeleteMenuContent: warnMessage
        }, () => {
            this.popupConfirmDeleteMenu && this.popupConfirmDeleteMenu.open()
        })

    }

    _deleteProduct = () => {
        console.log('Deleting Product', this.selectedProductId)
        if (!this.selectedProductId) return
        const { removeProduct, syncProductAndMenu } = this.props;
        this.setState({ loading: true });
        removeProduct(this.selectedProductId, (err, data) => {
            console.log("removeProduct Err", err);
            console.log("removeProduct Data", data);
            this.setState({ loading: false });
            if (chainParse(data, ["httpHeaders", "status"]) == 200) {
                // Reload Product
                ToastUtils.showSuccessToast(replacePatternString(I18n.t('delete_product_success'), `"${this.selectetProductName}"`))
                this.props.navigation.goBack()
                syncProductAndMenu()
            } else if (data && data.code) {
                this.props.navigation.navigate("Toast", {
                    text: I18n.t(data.msg)
                })
            }
        });
    }

    _handPressDeleteProduct = (item) => {
        console.log('_handPressDeleteProduct', item)
        this.selectedProductId = item.id
        this.selectetProductName = item.productName
        const warnMessage = replacePatternString(I18n.t('warn_delete_product'), `"${item.productName}"`)
        this.setState({
            popupDeleteProductContent: warnMessage
        }, () => {
            this.popupConfirmDeleteProduct && this.popupConfirmDeleteProduct.open()
        })
    }

    _renderHeader = (section, index, isActive, sections) => {
        return (
            <View className='row-start white ph24 pv14 border-bottom2'>
                <View className='flex row-start'>
                    {!!section.id && <TouchableOpacity onPress={() => this._handPressDeleteMenu(section)}>
                        <Image
                            source={require('~/src/image/delete_red.png')}
                            style={{ width: 24, height: 24, marginRight: 24 }}
                        />
                    </TouchableOpacity>}
                    <Text style={{ marginRight: 8 }}>{section.name}</Text>
                </View>
                <Image
                    source={require('~/src/image/chevron_down.png')}
                    style={{ width: 10, height: 6, backgroundColor: COLORS.WHITE, transform: [{ rotate: isActive ? '180deg' : '0deg' }] }}
                />
            </View>
        )
    }

    _renderProductItem = ({ item, index, section }) => {
        const sectionLength = section && section.productList ? section.productList.length : 0
        const isLastItem = (index == sectionLength - 1)

        return (
            <ProductItem
                data={item}
                style={{ paddingLeft: 0 }}
                innerStyle={{ paddingLeft: 60, paddingRight: 24, }}
                isLastItem={isLastItem}
                showDelete={true}
                onPressDelete={this._handPressDeleteProduct}
            />
        )
    }

    _renderContent = (section) => {
        return (
            <FlatList
                data={section.productList}
                renderItem={({ item, index }) => this._renderProductItem({ item, index, section })}
                keyExtractor={item => '' + item.id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
            />
        )
    }

    _updateSections = (activeSections) => {
        console.log('activeSections', activeSections)
        this.setState({ activeSections })
    }


    render() {
        const { productMenu } = this.props
        return (
            <SafeAreaView style={SURFACE_STYLES.flex}>
                <View style={[SURFACE_STYLES.flex, { backgroundColor: COLORS.BACKGROUND }]}>
                    <LoadingModal visible={this.state.loading} />
                    <PopupConfirm
                        ref={ref => this.popupConfirmDeleteMenu = ref}
                        content={this.state.popupDeleteMenuContent}
                        onPressYes={this._deleteMenu}
                        onPressNo={() => this.selectedMenuId = ''}
                    />
                    <PopupConfirm
                        ref={ref => this.popupConfirmDeleteProduct = ref}
                        content={this.state.popupDeleteProductContent}
                        onPressYes={this._deleteProduct}
                        onPressNo={() => this.selectedProductId = ''}
                    />
                    <Toolbar
                        title={I18n.t('delete_product').toUpperCase()}
                    />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {/* <View className='ph24 row-start pt16 pb8'>
                            <Text className='caption'>{I18n.t('delete_floor_table_hint')}</Text>
                        </View> */}
                        <View className='space12' />
                        <Accordion
                            activeSections={this.state.activeSections}
                            sections={productMenu}
                            renderHeader={this._renderHeader}
                            renderContent={this._renderContent}
                            onChange={this._updateSections}
                            sectionContainerStyle={{ marginBottom: 8 }}
                            touchableComponent={TouchableOpacity}
                            expandMultiple={true}
                        />
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
    productList: productListSelector(state),
    productMenu: allProductMenuSelector(state)
}), {
        removeMerchantMenu, syncProductAndMenu,
        removeProduct
    })(ProductMenuDelete)