import React, { PureComponent } from 'react'
import { View, FlatList, InteractionManager } from 'react-native'
import { connect } from 'react-redux'
import Text from '~/src/themes/Text'
import commonStyle, { SURFACE_STYLES, TEXT_STYLES } from '~/src/themes/common'
import { COLORS } from '~/src/themes/common'
import { formatMoney, chainParse } from '~/src/utils'
import { TouchableRipple } from 'react-native-paper'
import I18n from '~/src/I18n'
import { searchProduct } from '~/src/store/actions/product'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import { merchantMenuSelectorWithMenuAll, allProductMenuSelector } from '~/src/store/selectors/menu'
import { allProductSelector } from '~/src/store/selectors/product'
import Image from 'react-native-fast-image'
import { TextInput2 as TextInput } from '~/src/themes/ThemeComponent'
import lodash from 'lodash'
import styles from './styles'
import { checkAndSyncMasterData } from '~/src/store/actions/backgroundSync'

class ProductSelectorFragment extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            keyword: '',
            searchResult: {},
            isSearching: false,
            refreshing: false,
            selectedMenu: ''
        }
    }


    _handPress = (item) => {
        const { onSelect } = this.props
        onSelect && onSelect(item)
    }

    _renderProductItem = ({ item, index }) => {
        const avatar = item && item.listProductMedia && item.listProductMedia[0] ? item.listProductMedia[0].thumbnailUrl : (item.productAvatar || '')
        const price = item.promotionPrice ? Math.max(((+item.price) - (+item.promotionPrice)), 0) : item.price
        return (
            <TouchableRipple onPress={() => this._handPress(item)} style={styles.productItemTouchable}>
                <View style={styles.productItemContainer}>
                    <Image
                        source={{ uri: avatar }}
                        style={styles.productImage}
                    />
                    <View style={[SURFACE_STYLES.flex]}>
                        <Text style={TEXT_STYLES.listItemTitle}>{item.productName}</Text>
                        {!!item.description && <Text style={TEXT_STYLES.listItemCaption}>{item.description}</Text>}
                        <Text style={[TEXT_STYLES.listItemCaption, { color: COLORS.BLUE }]}>{formatMoney(price)} {I18n.t('d')}</Text>
                        {!!item.promotionPrice && <Text style={[TEXT_STYLES.listItemCaption, { color: COLORS.GRAY, fontStyle: 'italic', textDecorationLine: 'line-through' }]}>{formatMoney(item.price)} {I18n.t('d')}</Text>}
                    </View>
                </View>
            </TouchableRipple>
        )
    }

    _load = () => {
        const { checkAndSyncMasterData } = this.props
        checkAndSyncMasterData()
    }

    _refresh = () => {
        this._load()
    }

    componentDidMount() {
        console.log('ProductSelectorFragment Did Mount')
        this._load()
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.menu != this.props.menu && this.props.menu && this.props.menu[0] && this.state.selectedMenu != this.props.menu[0].id) {
            console.log('Load By Did Update')
            this.setState({ selectedMenu: this.props.menu[0].id })
        }
    }


    _renderFooter = () => {
        return <View style={SURFACE_STYLES.bottomButtonSpace} />
    }

    _clearKeyword = () => {
        this.setState({ keyword: '', isSearching: false })
    }

    _getSearchProduct = lodash.debounce((keyword) => {
        const { searchProduct, merchantId } = this.props
        
        this.setState({ isSearching: true })
        searchProduct(merchantId, keyword, (err, data) => {
            console.log('searchProduct Err', err)
            console.log('searchProduct Data', data)
            if (data && data.content) {
                this.setState({ searchResult: data })
            }
        })
    }, 300)

    _handleChangeKeyword = (keyword) => {
        if (!keyword) {
            this.setState({ keyword, isSearching: false })
        }
        this.setState({ keyword }, () => {
            this._getSearchProduct(this.state.keyword)
        })
    }

    _handlePressMenuItem = (item) => {
        if (this.state.isSearching) return
        if (item.id != this.state.selectedMenu) {
            this.setState({ selectedMenu: item.id })
        }
    }

    _renderMenuItem = ({ item }) => {
        const isActive = !this.state.isSearching && item.id == this.state.selectedMenu
        const menuNameStyle = isActive ? styles.menuNameActive : styles.menuName
        const menuItemStyle = isActive ? styles.menuItemActive : styles.menuItem
        return (
            <TouchableRipple
                onPress={() => this._handlePressMenuItem(item)}
                rippleColor={COLORS.RIPPLE}
                style={styles.rippleContainer}
            >
                <View style={menuItemStyle}>
                    <Text style={menuNameStyle}>{item.name}</Text>
                </View>
            </TouchableRipple>
        )
    }

    _getProductByMenu = (productMenu, menu) => {
        console.log('productMenu', productMenu)
        console.log('Menu', menu)
        const { allProduct } = this.props
        console.log('allProduct', allProduct)
        if (!menu) return allProduct
        const selectedMenu = productMenu.find(item => item.id == menu)
        if (!selectedMenu || !selectedMenu.productList) return []
        return selectedMenu.productList
    }

    render() {
        const { menu, productMenu } = this.props
        const content = this.state.isSearching ? (this.state.searchResult && this.state.searchResult.content ? this.state.searchResult.content : []) : this._getProductByMenu(productMenu, this.state.selectedMenu)
        return (
            <View style={[SURFACE_STYLES.flex, { backgroundColor: COLORS.WHITE }]}>
                <View style={[SURFACE_STYLES.containerHorizontalMargin]}>
                    <View style={{ marginBottom: 8 }}>
                        <TextInput
                            descriptionIcon={'magnify'}
                            iconRight={'close-circle'}
                            placeholder={I18n.t('search_product_placeholder')}
                            showIconRight={!!this.state.keyword}
                            onChangeText={this._handleChangeKeyword}
                            value={this.state.keyword}
                            onPressIconRight={this._clearKeyword}
                        />
                    </View>
                    <View style={[SURFACE_STYLES.rowAllStart]}>
                        <FlatList
                            data={menu}
                            keyExtractor={item => item.id + ''}
                            renderItem={this._renderMenuItem}
                            style={styles.menu}
                            extraData={this.state.selectedMenu}
                        />
                        <FlatList
                            data={content}
                            renderItem={this._renderProductItem}
                            keyExtractor={item => '' + item.id}
                            ListFooterComponent={this._renderFooter}
                            refreshing={this.state.refreshing}
                            onRefresh={this._refresh}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0.2}
                            numColumns={2}
                            contentContainerStyle={{ paddingHorizontal: 10 }}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
    menu: merchantMenuSelectorWithMenuAll(state),
    productMenu: allProductMenuSelector(state),
    allProduct: allProductSelector(state)
}), { searchProduct, checkAndSyncMasterData })(ProductSelectorFragment)