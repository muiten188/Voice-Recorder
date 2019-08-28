import React, { PureComponent } from 'react'
import { FlatList, ScrollView, TouchableOpacity } from 'react-native'
import I18n from '~/src/I18n'
import Image from 'react-native-fast-image'
import productModel from '~/src/db/product'
import lodash from 'lodash'
import {
    View, Toolbar, BottomView, Button, Text,
    Label, TextBold, Caption, RoundBottomSheet,
    SearchBox
} from '~/src/themes/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import Accordion from 'react-native-collapsible/Accordion'
import styles from './styles'
import ProductItem from '~/src/components/ProductItem'
import { getShortenString } from '~/src/utils'

export default class ProductSelector extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            refreshing: false,
            keyword: '',
            isSearching: false,
            searchResult: [],
            activeSections: [0],
            selectedProduct: props.selectedProduct ? props.selectedProduct : [],
            modalVisible: false
        }
    }


    _handPressProduct = (item) => {
        console.log('Pressing Product', item)
        const index = this.state.selectedProduct.findIndex(it => it.id == item.id)
        let newSelectedProduct = [...this.state.selectedProduct]
        if (index < 0) {
            newSelectedProduct.push(item)
        } else {
            newSelectedProduct.splice(index, 1)
        }
        this.setState({ selectedProduct: newSelectedProduct })
    }

    _clearKeyword = () => {
        this.setState({ keyword: '', isSearching: false })
    }

    _getSearchProduct = lodash.debounce((keyword) => {
        productModel.searchActive(keyword)
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


    _handlePressSelectedProduct = () => {
        console.log('_handlePressSelectedProduct')
        this.setState({ modalVisible: true })
    }

    _handlePressSave = () => {
        const { onSave } = this.props
        onSave && onSave(this.state.selectedProduct)

    }

    _renderHeader = (section, index, isActive, sections) => {
        const numProduct = section && section.productList ? section.productList.length : 0
        return (
            <View className='row-start white ph24 pv14 border-bottom'>
                <View className='flex row-start'>
                    <View className='row-start'>
                        <Text style={{ marginRight: 8 }}>{getShortenString(section.name, 15)}</Text>
                        <Caption>({numProduct} {I18n.t('product').toLowerCase()})</Caption>
                    </View>
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
        const isSelected = !!(this.state.selectedProduct.find(it => item.id == it.id))

        return (
            <ProductItem
                showCheckbox={true}
                isSelected={isSelected}
                isLastItem={isLastItem}
                data={item}
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
                extraData={this.state}
            />
        )
    }

    _updateSections = (activeSections) => {
        console.log('activeSections', activeSections)
        this.setState({ activeSections })
    }

    _handlePressCancel = () => {
        this.props.navigation.goBack()
    }

    _onPressOverlay = () => {
        this.setState({ modalVisible: false })
    }

    _handlePressDeleteSelectedProduct = (product) => {
        console.log('_handlePressDeleteSelectedProduct', product)
        this._handPressProduct(product)
    }

    _renderProductItemForDelete = ({ item, index }) => {
        const isLastItem = (index == this.state.selectedProduct.length - 1)
        return (
            <ProductItem
                showDelete={true}
                data={item}
                onPressDelete={this._handlePressDeleteSelectedProduct}
            />
        )
    }

    _closeModal = () => {
        this.setState({ modalVisible: false })
    }

    _renderChoosedProductModal = () => {
        return (
            <RoundBottomSheet
                title={I18n.t('choosed_product2')}
                visible={this.state.modalVisible}
                onClose={this._closeModal}
            >
                <FlatList
                    data={this.state.selectedProduct}
                    keyExtractor={item => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    renderItem={this._renderProductItemForDelete}
                    ListFooterComponent={<View className='space50' />}
                />
                {this._renderBottomButton()}
            </RoundBottomSheet>
        )
    }

    _renderBottomButton = () => {
        const { buttonRightText } = this.props
        return (
            <BottomView>
                <Button
                    passive
                    onPress={this._handlePressSelectedProduct}
                    style={SURFACE_STYLES.flex}
                >
                    <View className='row-center'>
                        <View style={styles.badgeView}>
                            <TextBold style={styles.badgeText}>{this.state.selectedProduct.length}</TextBold>
                        </View>
                        <Label style={{ fontSize: 11 }}>{I18n.t('choosed_product')}</Label>
                    </View>

                </Button>
                <Button
                    text={buttonRightText || I18n.t('save')}
                    onPress={this._handlePressSave}
                    style={styles.saveBtn}
                />
            </BottomView>
        )
    }

    _renderSearchResultTitle = () => (
        <View className='row-start background ph24 pt16 pb8' >
            <Text className='caption'>{I18n.t('search_result')}</Text>
        </View>
    )

    render() {
        const { productMenu } = this.props
        return (
            <View className='flex background'>
                {this._renderChoosedProductModal()}
                <Toolbar
                    title={I18n.t('choose_product').toUpperCase()}
                    rightText={I18n.t('cancel')}
                    onPressRight={this._handlePressCancel}
                />
                <View className='ph16 pv8 white row-start'>
                    <SearchBox
                        keyword={this.state.keyword}
                        onChangeKeyword={this._handleChangeKeyword}
                        onClear={this._clearKeyword}
                        placeholder={I18n.t('search')}
                    />
                </View>
                {this.state.isSearching ?
                    <FlatList
                        data={this.state.searchResult}
                        renderItem={this._renderProductItem}
                        ListHeaderComponent={this._renderSearchResultTitle}
                        ListFooterComponent={<View className={'space50'} />}
                        keyExtractor={item => item.id + ''}
                    />
                    :
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
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
                        <View className='space50' />
                    </ScrollView>
                }

                {this._renderBottomButton()}
            </View>
        )
    }
}