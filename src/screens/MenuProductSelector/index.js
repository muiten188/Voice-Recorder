import React, { PureComponent } from 'react'
import { View, FlatList, InteractionManager } from 'react-native'
import { connect } from 'react-redux'
import Text from '~/src/themes/Text'
import commonStyle, { SURFACE_STYLES, TEXT_STYLES } from '~/src/themes/common'
import { COLORS } from '~/src/themes/common'
import { formatMoney, chainParse, toNormalCharacter } from '~/src/utils'
import { Button, TouchableRipple } from 'react-native-paper'
import I18n from '~/src/I18n'
import { getProductList, syncProductListFromDBToRedux } from '~/src/store/actions/product'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import { productListSelector } from '~/src/store/selectors/product'
import Image from 'react-native-fast-image'
import { TextInput2 as TextInput, Checkbox } from '~/src/themes/ThemeComponent'
import lodash from 'lodash'
import { FORM_MODE } from "~/src/constants"
import productModel from '~/src/db/product'
import { singleMenuSelector } from '~/src/store/selectors/menu'

class MenuProductSelector extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: I18n.t('choose_product'),
            headerRight: <TouchableRipple
                onPress={navigation.getParam('onPressCreateNew')}
                rippleColor={COLORS.RIPPLE}
            >
                <View style={[SURFACE_STYLES.rowCenter, { paddingHorizontal: 16, paddingVertical: 8 }]}>
                    <Text style={{ color: COLORS.BLUE }}>{I18n.t('create_new')}</Text>
                </View>
            </TouchableRipple>
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            keyword: '',
            productList: props.productList,
            searchResult: {},
            isSearching: false,
            selectedProduct: {}
        }
    }


    _handPress = (item) => {
        if (!this.state.selectedProduct[item.id]) {
            this.setState({
                selectedProduct: {
                    ...this.state.selectedProduct,
                    [item.id]: item
                }
            })
        } else {
            this.setState({
                selectedProduct: {
                    ...this.state.selectedProduct,
                    [item.id]: false
                }
            })
        }
    }

    _renderProductItem = ({ item, index }) => {
        const avatar = item && item.listProductMedia && item.listProductMedia[0] ? item.listProductMedia[0].thumbnailUrl : item.productAvatar
        return (
            <TouchableRipple onPress={() => this._handPress(item)}>
                <View style={[SURFACE_STYLES.rowAllStart, SURFACE_STYLES.borderBottom, { paddingVertical: 10 }]}>
                    <Image
                        source={{ uri: avatar || 'https://vanteacafe.com/img/placeholders/xcomfort_food_placeholder.png,qv=1.pagespeed.ic.mWp7cl8OIL.webp' }}
                        style={{ width: 80, height: 80, marginRight: 10 }}
                    />
                    <View style={[SURFACE_STYLES.flex]}>
                        <Text style={TEXT_STYLES.listItemTitle}>{item.productName}</Text>
                        {!!item.description && <Text style={TEXT_STYLES.listItemCaption}>{item.description}</Text>}
                        <Text style={[TEXT_STYLES.listItemCaption, { color: COLORS.BLUE }]}>{formatMoney(item.price)} {I18n.t('d')}</Text>
                    </View>
                    <Checkbox checked={!!this.state.selectedProduct[item.id]} onPress={() => this._handPress(item)} />
                </View>

            </TouchableRipple>
        )
    }

    _load = (page = 1, totalPage = 1) => {
        const { merchantId, getProductList } = this.props
        getProductList(merchantId, page, totalPage, (err, data) => {
            console.log('Product List Err', err)
            console.log('Product List Data', data)
        })
    }

    _loadMore = () => {
        if (this.state.loading || this.state.refreshing) return
        if (!this.state.isSearching) {
            const { syncProductListFromDBToRedux } = this.props
            const pageNumber = +chainParse(this.props, ['productList', 'pagingInfo', 'pageNumber'])
            const totalPages = +chainParse(this.props, ['productList', 'totalPages'])
            console.log('PageNumber, TotalPage', pageNumber, totalPages)
            if (pageNumber >= totalPages) return
            syncProductListFromDBToRedux(pageNumber + 1)
        }
    }

    _handPressCreateNew = () => {
        this.props.navigation.navigate('ProductInfo', {
            mode: FORM_MODE.ADD
        })
    }

    componentDidMount() {
        const { syncProductListFromDBToRedux } = this.props
        syncProductListFromDBToRedux(1)
        this.props.navigation.setParams({ onPressCreateNew: this._handPressCreateNew })
        this._load()
    }

    _renderFooter = () => {
        return <View style={SURFACE_STYLES.bottomButtonSpace} />
    }

    _clearKeyword = () => {
        this.setState({ keyword: '', isSearching: false })
    }

    _getSearchProduct = lodash.debounce((keyword) => {
        productModel.search(keyword)
            .then(searchResult => {
                console.log('Search Data', searchResult)
                this.setState({ isSearching: true, searchResult })
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

    _handleSave = () => {
        const selectedProduct = Object.values(this.state.selectedProduct).filter(item => !!item)
        if (!selectedProduct || selectedProduct.length == 0) return
        const callback = this.props.navigation.getParam('callback')
        callback && callback(selectedProduct)
        this.props.navigation.goBack()
    }

    render() {
        const { productList } = this.props
        const content = this.state.isSearching ? this.state.searchResult :
            (productList && productList.content ? productList.content : [])
        return (
            <View style={SURFACE_STYLES.flex}>
                <View style={[SURFACE_STYLES.containerHorizontalMargin]}>
                    <View style={[SURFACE_STYLES.rowStart, { paddingVertical: 8 }]}>
                        <View style={SURFACE_STYLES.flex}>
                            <TextInput
                                descriptionIcon={'magnify'}
                                iconRight={'close-circle'}
                                placeholder={I18n.t('search_product_placeholder')}
                                showIconRight={!!this.state.keyword}
                                onChangeText={this._handleChangeKeyword}
                                value={this.state.keyword}
                                onPressIconRight={this._clearKeyword}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </View>
                    <FlatList
                        data={content}
                        extraData={this.state}
                        renderItem={this._renderProductItem}
                        keyExtractor={item => '' + item.id}
                        ListFooterComponent={this._renderFooter}
                        showsVerticalScrollIndicator={false}
                        onEndReached={this._loadMore}
                        onEndReachedThreshold={0.2}
                    />
                </View>
                <View
                    style={[
                        SURFACE_STYLES.rowCenter,
                        { position: "absolute", bottom: 10, width: "100%", zIndex: 100 },
                    ]}
                >
                    <Button
                        mode="contained"
                        onPress={this._handleSave}
                        disabled={false}
                    >
                        {I18n.t("save")}
                    </Button>
                </View>
            </View>
        )
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
    productList: productListSelector(state),
    menuInfo: singleMenuSelector(state)
}), { getProductList, syncProductListFromDBToRedux })(MenuProductSelector)