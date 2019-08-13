import React, { PureComponent } from 'react'
import { FlatList, ScrollView, ActivityIndicator, Platform, TouchableOpacity, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import I18n from '~/src/I18n'
import { getProductList, syncProductListFromDBToRedux, syncProductFromNetwork } from '~/src/store/actions/product'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import { productListSelector } from '~/src/store/selectors/product'
import Image from 'react-native-fast-image'
import { FORM_MODE } from '~/src/constants'
import { TextInputBase as TextInput, Container, Toolbar, BottomView, Button, Text, View } from '~/src/themesnew/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themesnew/common'
import Accordion from 'react-native-collapsible/Accordion'
import { allProductMenuSelector } from '~/src/store/selectors/menu'
import ProductItem from '~/src/components/ProductItem'
import { updateOrdinalProductMenu } from '~/src/store/actions/menu'
import { chainParse } from '~/src/utils'
import LoadingModal from '~/src/components/LoadingModal'
import { syncProductAndMenu } from '~/src/store/actions/backgroundSync'
import ToastUtils from '~/src/utils/ToastUtils'

class ProductMenuSort extends PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            refreshing: false,
            activeSections: [0],
            productMenu: props.productMenu
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

    _handleSave = () => {
        console.log('_handleSave', this.props.productMenu)
        const requestObj = this.state.productMenu.map((item, index) => ({
            menuId: item.id,
            ordinal: +(index + 1),
            productList: item.productList ? item.productList.map((productItem, productIndex) => ({
                productId: productItem.id,
                ordinal: +(productIndex + 1)
            })) : []
        }))
        const { updateOrdinalProductMenu, syncProductAndMenu } = this.props
        this.setState({ loading: true })
        updateOrdinalProductMenu(requestObj, (err, data) => {
            console.log('updateOrdinalProductMenu err', err)
            console.log('updateOrdinalProductMenu', data)
            this.setState({ loading: false })
            if (chainParse(data, ['httpHeaders', 'status']) == 200) {
                // Reload Menu
                ToastUtils.showSuccessToast(I18n.t('update_menu_product_order_success'))
                syncProductAndMenu()
                this.props.navigation.goBack()
            }
        })
    }

    _handlePressUpCategory = (index) => {
        console.log('_handlePressUpCategory', index)
        if (index <= 0) return
        this._swapCategory(index, index - 1)
    }

    _handlePressDownCategory = (index) => {
        console.log('_handlePressDownCategory', index)
        if (index >= this.state.productMenu.length - 1) return
        this._swapCategory(index, index + 1)
    }

    _swapCategory = (index, newIndex, callback) => {
        const newProductMenu = [...this.state.productMenu]
        const currentItem = newProductMenu.splice(index, 1)[0]
        newProductMenu.splice(newIndex, 0, currentItem)
        this.setState({ productMenu: newProductMenu }, () => {
            callback && callback()
        })

    }


    _handlePressUpProduct = (index, sectionIndex) => {
        console.log('_handlePressUpProduct', index, sectionIndex)
        if (index <= 0) return
        this._swapProduct(sectionIndex, index, index - 1)
    }

    _handlePressDownProduct = (index, sectionIndex) => {
        console.log('_handlePressDownProduct', index, sectionIndex)
        if (!this.state.productMenu[sectionIndex]
            || !this.state.productMenu[sectionIndex].productList
            || index >= this.state.productMenu[sectionIndex].productList.length - 1
        ) return
        this._swapProduct(sectionIndex, index, index + 1)
    }

    _swapProduct = (sectionIndex, index, newIndex, callback) => {
        if (!this.state.productMenu[sectionIndex] || !this.state.productMenu[sectionIndex].productList) return
        const productList = this.state.productMenu[sectionIndex].productList
        const newProductList = [...productList]
        const currentItem = newProductList.splice(index, 1)[0]
        newProductList.splice(newIndex, 0, currentItem)
        const newProductMenu = [...this.state.productMenu]
        const newMenu = {
            ...newProductMenu[sectionIndex],
            productList: newProductList
        }
        newProductMenu[sectionIndex] = newMenu
        this.setState({ productMenu: newProductMenu }, () => {
            callback && callback()
        })
    }

    _renderHeader = (section, index, isActive, sections) => {
        return (
            <View className='row-start border-bottom ph24 pv14 white'>
                <View className='column-center' style={{ marginRight: 22 }}>
                    <TouchableOpacity onPress={() => this._handlePressUpCategory(index)}>
                        <View className='row-center' style={styles.iconUpDownContainer}>
                            <Image source={require('~/src/image/chevron_up_large.png')} style={styles.iconUpDown} />
                        </View>
                    </TouchableOpacity>
                    <View className='space8' />
                    <TouchableOpacity onPress={() => this._handlePressDownCategory(index)}>
                        <View className='row-center' style={styles.iconUpDownContainer}>
                            <Image source={require('~/src/image/chevron_down_large.png')} style={styles.iconUpDown} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View className='column-align-start' style={{ marginRight: 10 }}>
                    <Text className='caption' style={{ marginBottom: 4 }}>{I18n.t('position')}</Text>
                    <TextInput
                        style={{ paddingTop: 4, paddingBottom: 4, fontWeight: 'bold', fontSize: 17, color: COLORS.TEXT_GRAY, width: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.25)' }}
                        value={'' + (index + 1)}
                        keyboardType='number-pad'
                    />
                </View>
                <View className='row-start flex'>
                    <Text className='lh20'>{section.name}</Text>
                </View>
                <Image
                    source={require('~/src/image/chevron_down.png')}
                    style={{ marginLeft: 12, width: 10, height: 6, backgroundColor: COLORS.WHITE, transform: [{ rotate: isActive ? '180deg' : '0deg' }] }}
                />
            </View>
        )
    }

    _renderProductItem = ({ item, index, section, sectionIndex }) => {
        return (
            <View className='row-start border-bottom pv14 white' style={{ paddingLeft: 48, paddingRight: 24 }}>
                <View className='column-center' style={{ marginRight: 22 }}>
                    <TouchableOpacity onPress={() => this._handlePressUpProduct(index, sectionIndex)}>
                        <View className='row-center' style={styles.iconUpDownContainer}>
                            <Image source={require('~/src/image/chevron_up_large.png')} style={styles.iconUpDown} />
                        </View>
                    </TouchableOpacity>
                    <View className='space8' />
                    <TouchableOpacity onPress={() => this._handlePressDownProduct(index, sectionIndex)}>
                        <View className='row-center' style={styles.iconUpDownContainer}>
                            <Image source={require('~/src/image/chevron_down_large.png')} style={styles.iconUpDown} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View className='column-align-start' style={{ marginRight: 10 }}>
                    <Text className='caption' style={{ marginBottom: 4 }}>{I18n.t('position')}</Text>
                    <TextInput
                        style={{ paddingTop: 4, paddingBottom: 4, fontWeight: 'bold', fontSize: 17, color: COLORS.TEXT_GRAY, width: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.25)' }}
                        value={'' + (index + 1)}
                        keyboardType='number-pad'
                    />
                </View>
                <ProductItem
                    data={item}
                    isLastItem={true}
                    forwardArrow={false}
                    onPress={this._handPressProduct}
                    style={{ paddingLeft: 0, flex: 1 }}
                />
            </View>

        )
    }

    _renderContent = (section, sectionIndex) => {
        return (
            <FlatList
                data={section.productList}
                renderItem={({ item, index }) => this._renderProductItem({ item, index, section, sectionIndex })}
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

    _handlePressRight = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { productMenu } = this.state
        return (
            <Container>
                <View className='flex background'>
                    <LoadingModal visible={this.state.loading} />
                    <Toolbar
                        title={I18n.t('product_menu_sort').toUpperCase()}
                        rightText={I18n.t('cancel')}
                        onPressRight={this._handlePressRight}
                    />
                    <View className='ph24 pt16 pb8 row-start background'>
                        <Text className='caption'>{I18n.t('change_sort_order')}</Text>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
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
                    <BottomView>
                        <Button
                            text={I18n.t('save_change')}
                            onPress={this._handleSave}
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
        syncProductFromNetwork,
        updateOrdinalProductMenu,
        syncProductAndMenu
    })(ProductMenuSort)

const styles = StyleSheet.create({
    iconUpDownContainer: {
        width: 52,
        height: 24,
        borderRadius: 6,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.25)',
    },
    iconUpDown: {
        width: 13.9, height: 6.9
    }
})