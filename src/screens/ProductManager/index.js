import React, { PureComponent } from 'react'
import { FlatList, ScrollView, ActivityIndicator, TouchableOpacity, StatusBar, Platform } from 'react-native'
import { connect } from 'react-redux'
import I18n from '~/src/I18n'
import { getProductList, syncProductListFromDBToRedux, syncProductFromNetwork } from '~/src/store/actions/product'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import { productListSelector } from '~/src/store/selectors/product'
import Image from 'react-native-fast-image'
import { FORM_MODE } from '~/src/constants'
import { checkAndSyncMasterData } from '~/src/store/actions/backgroundSync'
import productModel from '~/src/db/product'
import lodash from 'lodash'
import {
    Container, Toolbar, BottomView, Button, Text, View,
    TextInputBase as TextInput, SearchBox
} from '~/src/themes/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import Accordion from 'react-native-collapsible/Accordion'
import { allProductMenuSelector } from '~/src/store/selectors/menu'
import ProductItem from '~/src/components/ProductItem'
import { syncMenuFromDBToRedux } from '~/src/store/actions/menu'
import styles from './styles'
import { generateHighlightText, getWidth, getShortenString } from '~/src/utils'
import { textStyles } from '~/src/themes/Text'

class ProductManager extends PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            refreshing: false,
            keyword: '',
            searchResult: [],
            isSearching: false,
            activeSections: [0]
        }
    }


    _handPressProduct = (item) => {
        console.log('Pressing Product', item)
        this.props.navigation.navigate('ProductInfo', {
            mode: FORM_MODE.EDIT,
            product: item,
            id: item.id
        })
    }

    componentDidMount = async () => {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }
        const { syncMenuFromDBToRedux, syncProductListFromDBToRedux, checkAndSyncMasterData } = this.props
        syncProductListFromDBToRedux(1)
        // checkAndSyncMasterData()
        syncMenuFromDBToRedux()
    }

    _renderFooter = () => {
        if (this.state.loading) {
            return (
                <View style={SURFACE_STYLES.rowCenter}>
                    <ActivityIndicator size={Platform.OS == 'android' ? 60 : 'large'} color={COLORS.BLUE} />
                </View>
            )
        }
        return <View style={SURFACE_STYLES.bottomButtonSpace} />
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
            return
        }
        this.setState({ keyword, isSearching: true }, () => {
            this._getSearchProduct(this.state.keyword)
        })
    }

    _handlePressDetele = () => {
        this.props.navigation.navigate('ProductMenuDelete')
    }


    _handlePressAddMenu = () => {
        this.props.navigation.navigate('AddMenu')
    }

    _handlePressAddProduct = () => {
        this.props.navigation.navigate('ProductInfo', {
            mode: FORM_MODE.ADD
        })
    }

    _handlePressUpdateMenu = (section) => {
        console.log('_handlePressUpdateMenu', section)
        this.props.navigation.navigate('UpdateMenu', {
            id: section.id
        })
    }

    _renderHeader = (section, index, isActive, sections) => {
        const numProduct = section && section.productList ? section.productList.length : 0
        const isOtherMenu = !(section.id)
        return (
            <View className='row-start border-bottom ph24 pv14 white'>
                <View className='row-start flex'>
                    <View className='row-start' style={{ paddingRight: 9, borderRightColor: isOtherMenu ? 'transparent' : COLORS.BORDER_COLOR, borderRightWidth: 1 }}>
                        <Text>
                            <Text style={{ marginRight: 8 }}>{getShortenString(section.name, 15)} </Text>
                            <Text className='caption'>({numProduct} {I18n.t('product').toLowerCase()})</Text>
                        </Text>
                    </View>
                    {!isOtherMenu &&
                        <TouchableOpacity onPress={() => this._handlePressUpdateMenu(section)}>
                            <Text className='action flex' style={{ marginLeft: 16 }}>{I18n.t('update')}</Text>
                        </TouchableOpacity>
                    }
                </View>
                <Image
                    source={require('~/src/image/chevron_down.png')}
                    style={{ marginLeft: 12, width: 10, height: 6, backgroundColor: COLORS.WHITE, transform: [{ rotate: isActive ? '180deg' : '0deg' }] }}
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
                isLastItem={isLastItem}
                forwardArrow={true}
                onPress={this._handPressProduct}
            />
        )
    }

    _renderSearchProductItem = ({ item, index }) => {
        const isLastItem = (index == this.state.searchResult.length - 1)
        return (
            <ProductItem
                data={item}
                isLastItem={isLastItem}
                onPress={this._handPressProduct}
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
                extraData={this.props.productMenu}
            />
        )
    }

    _updateSections = (activeSections) => {
        this.setState({ activeSections })
    }

    _handlePressRight = () => {
        this.props.navigation.navigate('ProductMenuSort')
    }

    _clearKeyword = () => {
        this.setState({ keyword: '', isSearching: false })
    }


    _renderSearchResultTitle = () => (
        <View className='row-start background ph24 pt16 pb8' >
            <Text className='caption'>{I18n.t('search_result')}</Text>
        </View>
    )

    _renderEmptyState = () => {
        return (
            <View className='white flex'>
                <View className='space12 background' />
                <View className='row-center' style={{ marginTop: getWidth(80) }}>
                    <Image source={require('~/src/image/empty_product.png')}
                        style={{ width: getWidth(180), height: getWidth(103) }}
                    />
                </View>
                <View className='column-center' style={{ marginTop: getWidth(25), marginHorizontal: getWidth(42) }}>
                    <Text className='center'>
                        <Text className='s14 gray bold'>{I18n.t('no_setup_product')}</Text>
                        {"\n\n"}
                        {generateHighlightText(
                            I18n.t('add_product_hint'),
                            { ...textStyles.gray, ...textStyles.s14 },
                            { ...textStyles.cerulean, ...textStyles.s14, ...textStyles.bold }
                        )}
                    </Text>
                </View>
                <View className='column-center' style={{ marginTop: getWidth(40) }}>
                    <Image source={require('~/src/image/guide_arrow.png')}
                        style={{ width: getWidth(27), height: getWidth(77.4), position: 'absolute', right: getWidth(101), top: 0 }}
                    />
                </View>

            </View>
        )

    }


    render() {
        const { productMenu } = this.props
        return (
            <Container>
                <View className='flex background'>
                    <Toolbar
                        title={I18n.t('product_manager').toUpperCase()}
                        rightText={I18n.t('sort')}
                        onPressRight={this._handlePressRight}
                    />
                    <View className='row-start ph16 pv8 white'>
                        <SearchBox
                            keyword={this.state.keyword}
                            onChangeKeyword={this._handleChangeKeyword}
                            onClear={this._clearKeyword}
                            placeholder={I18n.t('search_product')}
                        />
                        <TouchableOpacity onPress={this._handlePressDetele}>
                            <Image source={require('~/src/image/delete2.png')} style={styles.deleteIcon} />
                        </TouchableOpacity>
                    </View>
                    {this.state.isSearching ?
                        <FlatList
                            data={this.state.searchResult}
                            renderItem={this._renderSearchProductItem}
                            ListHeaderComponent={this._renderSearchResultTitle}
                            ListFooterComponent={<View className={'space50'} />}
                            keyExtractor={item => item.id + ''}
                        />
                        :
                        ((!productMenu || productMenu.length == 0) ?
                            this._renderEmptyState()
                            :
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >
                                <View className={'space12'} />
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
                                <View className={'space50'} />
                            </ScrollView>
                        )
                    }

                    <BottomView>
                        <Button
                            passive
                            text={I18n.t('add_menu')}
                            onPress={this._handlePressAddMenu}
                            style={SURFACE_STYLES.flex}
                        />
                        <Button
                            text={I18n.t('add_product')}
                            onPress={this._handlePressAddProduct}
                            style={SURFACE_STYLES.flex}
                        />
                    </BottomView>
                </View>
            </Container>
        )
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
    productList: productListSelector(state),
    productMenu: allProductMenuSelector(state)
}), {
        getProductList, syncProductListFromDBToRedux,
        syncProductFromNetwork, checkAndSyncMasterData,
        syncMenuFromDBToRedux
    })(ProductManager)