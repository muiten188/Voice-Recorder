import React, { Component } from 'react'
import { Image, TouchableOpacity, FlatList } from 'react-native'
import I18n from '~/src/I18n'
import {
    Container, Toolbar, Text,
    TextInputBase as TextInput, Button,
    BottomView, View, SingleRowInput, PopupConfirm
} from '~/src/themesnew/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themesnew/common'
import { syncProductAndMenu } from '~/src/store/actions/backgroundSync'
import LoadingModal from '~/src/components/LoadingModal'
import { connect } from 'react-redux'
import { createMerchantMenu } from '~/src/store/actions/menu'
import { chainParse, getPrice, formatMoney, replacePatternString } from '~/src/utils'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import { singleMenuSelector, tempMenuProductSelector } from '~/src/store/selectors/menu';
import { setTempMenuProduct } from '~/src/store/actions/menu'
import { FORM_MODE } from '~/src/constants'
import { addProductToMenu } from '~/src/store/actions/product'
import ProductItem from '~/src/components/ProductItem'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ToastUtils from '~/src/utils/ToastUtils'
import lodash from 'lodash'
import { removeMerchantMenu } from '~/src/store/actions/menu'

class UpdateMenu extends Component {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        const menuName = props.navigation.getParam('menuName', '')
        this.state = {
            loading: false,
            menuName: chainParse(props, ['menuInfo', 'name']) || menuName,
            id: '',
            ordinal: 1,
            errMenuName: '',
            changed: false,
            popupDeleteMenuContent: ''
        }
        const menuProduct = chainParse(props, ['menuInfo', 'productList']) || []
        props.setTempMenuProduct(menuProduct)
    }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.menuInfo != this.props.menuInfo) {
    //         const menuProduct = chainParse(this.props, ['menuInfo', 'productList']) || []
    //         this.props.setTempMenuProduct(menuProduct)
    //         this.setState({ changed: true })
    //     } else if (prevProps.tempMenuProduct != this.props.tempMenuProduct) {
    //         this.setState({ changed: true })
    //     }
    // }



    _handleSave = lodash.throttle(() => {
        const { merchantId, menuInfo, addProductToMenu, tempMenuProduct, syncProductAndMenu } = this.props
        console.log('_handleSave', tempMenuProduct)
        const productIdList = tempMenuProduct.map(item => item.id).join(',')
        this.setState({ loading: true })
        addProductToMenu(merchantId, menuInfo.id, this.state.menuName.trim(), productIdList, (err, data) => {
            console.log('addProductToMenu err', err)
            console.log('addProductToMenu data', data)
            this.setState({ loading: false })
            if (chainParse(data, ['httpHeaders', 'status']) == 200) {
                // Reload Product Menu
                ToastUtils.showSuccessToast(I18n.t('update_menu_success'))
                syncProductAndMenu()
                this.props.navigation.goBack()
            } else if (data && data.code) {
                this.props.navigation.navigate('Toast', { text: data.msg })
            }
        })
    }, 500)

    _onChooseProductFromMenu = (selectedProduct) => {
        const { setTempMenuProduct } = this.props
        setTempMenuProduct(selectedProduct)
        this.setState({ changed: true })
    }

    _onCreateProduct = (product) => {
        console.log('_onCreateProduct', product)
        const { tempMenuProduct, setTempMenuProduct } = this.props
        setTempMenuProduct([...tempMenuProduct, product])
        this.setState({ changed: true })
    }

    _handlePressChooseProduct = () => {
        console.log('_handlePressChooseProduct')
        const menuId = this.props.navigation.getParam('id')
        this.props.navigation.navigate('MenuChooseProduct', {
            id: menuId,
            callback: this._onChooseProductFromMenu
        })
    }

    _handlePressAddProduct = () => {
        console.log('_handlePressAddProduct')
        const menuId = this.props.navigation.getParam('id')
        this.props.navigation.navigate('ProductInfo', {
            mode: FORM_MODE.ADD,
            menuIds: [menuId],
            callback: this._onCreateProduct
        })
    }

    _renderEmptyState = () => {
        return (
            <View style={{ alignItems: 'center', paddingTop: 10.5, paddingBottom: 37 }}>
                <View style={[SURFACE_STYLES.rowCenter]}>
                    <View style={[SURFACE_STYLES.rowCenter, { paddingTop: 52, paddingBottom: 34 }]}>
                        <Image
                            source={require('~/src/image/empty_menu.png')}
                            resizeMode={'contain'}
                            style={{ width: 167, height: 90 }} />
                    </View>
                </View>
                <View style={[SURFACE_STYLES.columnCenter, { marginTop: 5, paddingHorizontal: 44 }]}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.TEXT_GRAY, textAlign: 'center' }}>
                        {I18n.t('menu_empty')}
                        {"\n\n"}
                        <Text style={{ fontSize: 14, color: COLORS.TEXT_GRAY, textAlign: 'center', fontWeight: 'normal' }}>
                            Hãy <Text style={{ fontWeight: 'bold', color: COLORS.CERULEAN }}>"Thêm sản phẩm"</Text> hoặc <Text style={{ fontWeight: 'bold', color: COLORS.CERULEAN }}>"Chọn sản phẩm"</Text> cho danh mục
                        </Text>
                    </Text>
                </View>
            </View>

        )
    }

    _renderProductItem = ({ item, index }) => {
        const { tempMenuProduct } = this.props
        const isLastItem = (index == tempMenuProduct.length - 1)
        return (
            <ProductItem
                data={item}
                isLastItem={isLastItem}
            />
        )
    }

    _handlePressRight = () => {
        const { menuInfo } = this.props
        const warnMessage = replacePatternString(I18n.t('warn_delete_menu'), `"${menuInfo.name}"`)
        this.setState({
            popupDeleteMenuContent: warnMessage
        }, () => {
            this.popupConfirmDeleteMenu && this.popupConfirmDeleteMenu.open()
        })
    }

    _deleteMenu = () => {
        console.log('Deleting Menu', this.selectedMenuId)
        const { removeMerchantMenu, syncProductAndMenu, menuInfo } = this.props
        this.setState({ loading: true })
        removeMerchantMenu(menuInfo.id, (err, data) => {
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

    render() {
        const { menuInfo, tempMenuProduct } = this.props
        const isEmpty = (!tempMenuProduct || tempMenuProduct.length == 0)
        return (
            <Container>
                <LoadingModal visible={this.state.loading} />
                <PopupConfirm
                    ref={ref => this.popupConfirmDeleteMenu = ref}
                    content={this.state.popupDeleteMenuContent}
                    onPressYes={this._deleteMenu}
                    onPressNo={() => this.selectedMenuId = ''}
                />
                <View className='flex white'>
                    <Toolbar
                        title={I18n.t('update_menu').toUpperCase()}
                        rightText={I18n.t('delete')}
                        onPressRight={this._handlePressRight}
                    />
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View className='space12 background' style={SURFACE_STYLES.space12} />
                        <SingleRowInput
                            onChangeText={text => this.setState({ menuName: text, changed: true })}
                            value={this.state.menuName}
                            maxLength={80}
                            error={this.state.errMenuName}
                            label={I18n.t('menu_name')}
                            className='s16'
                        />

                        <View className='space8 background' />
                        <View style={{ backgroundColor: COLORS.WHITE }}>
                            <View style={{ paddingHorizontal: 24, paddingVertical: 16, borderBottomColor: COLORS.BORDER_COLOR2, borderBottomWidth: 1 }}>
                                <Text className='s12 textBlack'>{I18n.t('product_in_menu')}</Text>
                            </View>
                            <View style={[SURFACE_STYLES.rowStart, { borderBottomColor: COLORS.BORDER_COLOR2, borderBottomWidth: 1 }]}>
                                <TouchableOpacity style={[SURFACE_STYLES.rowStart, SURFACE_STYLES.flex]} onPress={this._handlePressChooseProduct}>
                                    <View style={[SURFACE_STYLES.rowStart, SURFACE_STYLES.flex, { paddingHorizontal: 24, paddingVertical: 16, borderRightColor: COLORS.BORDER_COLOR, borderRightWidth: 1 }]}>
                                        <Image
                                            source={require('~/src/image/location.png')}
                                            style={{ width: 16, height: 16, marginRight: 8 }}
                                        />
                                        <Text className='flex s12 cerulean'>{I18n.t('choose_product')}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[SURFACE_STYLES.rowStart, SURFACE_STYLES.flex]} onPress={this._handlePressAddProduct}>
                                    <View style={[SURFACE_STYLES.rowStart, SURFACE_STYLES.flex, { paddingHorizontal: 24, paddingVertical: 16 }]}>
                                        <Image
                                            source={require('~/src/image/add.png')}
                                            style={{ width: 16, height: 16, marginRight: 8 }}
                                        />
                                        <Text className='flex s12 cerulean'>{I18n.t('add_product')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {isEmpty ?
                                this._renderEmptyState()
                                :
                                <FlatList
                                    data={tempMenuProduct}
                                    renderItem={this._renderProductItem}
                                    keyExtractor={item => '' + item.id}
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={false}
                                    ListFooterComponent={<View style={{ width: '100%', height: 50 }} />}
                                />
                            }

                        </View>
                    </KeyboardAwareScrollView>


                    <BottomView>
                        <Button
                            active
                            onPress={this._handleSave}
                            text={I18n.t('save_change')}
                            disabled={(!this.state.menuName || !this.state.menuName.trim || !this.state.changed)}
                            style={SURFACE_STYLES.flex}
                        />
                    </BottomView>

                </View>
            </Container>
        )
    }
}


export default connect((state, props) => {
    const menuId = props.navigation.getParam('id')
    return {
        merchantId: merchantIdSelector(state),
        menuInfo: singleMenuSelector(state, menuId),
        tempMenuProduct: tempMenuProductSelector(state)
    }
}, {
        createMerchantMenu, syncProductAndMenu,
        setTempMenuProduct, addProductToMenu, removeMerchantMenu
    })(UpdateMenu)