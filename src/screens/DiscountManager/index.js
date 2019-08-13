import React, { PureComponent } from 'react'
import { FlatList, ActivityIndicator, Platform, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import I18n from '~/src/I18n'
import { merchantIdSelector } from '~/src/store/selectors/merchant'
import Image from 'react-native-fast-image'
import lodash from 'lodash'
import {
    Container, Toolbar,
    Button, Text, View, SearchBox, PopupConfirm
} from '~/src/themesnew/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themesnew/common'
import Accordion from 'react-native-collapsible/Accordion'
import ProductItem from '~/src/components/ProductItem'
import styles from './styles'
import { generateHighlightText, chainParse, formatMoney, replacePatternString, toNormalCharacter, getWidth } from '~/src/utils'
import { textStyles } from '~/src/themesnew/Text'
import { saleCampainSelector } from '~/src/store/selectors/product'
import moment from 'moment'
import { FORM_MODE, DISCOUNT_TYPE } from '~/src/constants'
import { deleteSaleCampain } from '~/src/store/actions/product'
import { checkAndSyncMasterData } from '~/src/store/actions/backgroundSync'
import LoadingModal from '~/src/components/LoadingModal'
import ToastUtils from '~/src/utils/ToastUtils'

class DiscountManager extends PureComponent {
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
            activeSections: [0],
            isDeleting: false,
            popupDeleteContent: ''
        }
        this.selectedDiscountId = ''
        this.selectedDiscountName = ''
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

    _getSearchDiscount = lodash.debounce((keyword) => {
        const { saleCampain } = this.props
        const normalizeKeyword = toNormalCharacter(keyword.toLowerCase())
        const searchResult = saleCampain.filter(item => {
            const normalizeDiscountName = toNormalCharacter((chainParse(item, ['saleDiscount', 'name']) || '').toLowerCase())
            return normalizeDiscountName.indexOf(normalizeKeyword) > -1
        })
        this.setState({ searchResult })
    }, 300)

    _handleChangeKeyword = (keyword) => {
        if (!keyword) {
            this.setState({ keyword, isSearching: false })
            return
        }
        this.setState({ keyword, isSearching: true }, () => {
            this._getSearchDiscount(this.state.keyword)
        })
    }

    _handlePressDetele = () => {
        this.setState({ isDeleting: !this.state.isDeleting })
    }

    _renderHeader = (section, index, isActive, sections) => {
        const numDiscount = section && section.discountList ? section.discountList.length : 0
        return (
            <View className='row-start border-bottom ph24 pv14 white'>
                <View className='row-start flex'>
                    <Text>
                        <Text className='lh20' style={{ marginRight: 8 }}>{section.title} </Text>
                        <Text className='caption'>({numDiscount} {I18n.t('discount').toLowerCase()})</Text>
                    </Text>
                </View>
                <Image
                    source={require('~/src/image/chevron_down.png')}
                    style={{ marginLeft: 12, width: 10, height: 6, backgroundColor: COLORS.WHITE, transform: [{ rotate: isActive ? '180deg' : '0deg' }] }}
                />
            </View>
        )
    }

    _handlePressDiscountItem = (item) => {
        if (this.state.isDeleting) return
        this.props.navigation.navigate('DiscountInfo', {
            mode: FORM_MODE.EDIT,
            discountInfo: item
        })
    }

    _renderDiscountItem = ({ item, index, section }) => {
        const sectionLength = section && section.productList ? section.productList.length : 0
        const isLastItem = (index == sectionLength - 1)
        const name = chainParse(item, ['saleDiscount', 'name'])
        const startTime = chainParse(item, ['saleDiscount', 'startTime'])
        const endTime = chainParse(item, ['saleDiscount', 'endTime'])
        const discountType = chainParse(item, ['saleDiscount', 'promotionType'])
        const discountTypeDisplay = discountType == DISCOUNT_TYPE.AMOUNT ? I18n.t('by_amount') : I18n.t('by_percent_sign')
        const discountValue = chainParse(item, ['saleDiscount', 'promotionValue'])
        return (
            <TouchableOpacity onPress={() => this._handlePressDiscountItem(item)}>
                <View className='row-start ph24 pv12 white border-bottom2'>
                    {!!this.state.isDeleting &&
                        <TouchableOpacity onPress={() => this._handlePressDeleteDiscountItem(item)}>
                            <Image
                                source={require('~/src/image/delete_red.png')}
                                style={styles.deleteDiscountIcon}
                            />
                        </TouchableOpacity>
                    }
                    <View className='flex' style={{ marginRight: 16 }}>
                        <Text className='bold textBlack' numberOfLines={1}>{name}</Text>
                        <Text className='s12 gray lh16' style={{ marginTop: 4 }}>{moment(startTime * 1000).format(I18n.t('date_format'))} - {moment(endTime * 1000).format(I18n.t('date_format'))}</Text>
                    </View>
                    <View className='column-align-end'>
                        <Text className='s12 gray lh16 right'>{discountTypeDisplay}</Text>
                        <Text className='orange bold right' style={{ marginTop: 4 }}>{formatMoney(discountValue) || 0}</Text>
                    </View>
                    <Image
                        source={require('~/src/image/chevron_right_gray.png')}
                        style={styles.forwardArrow}
                    />
                </View>
            </TouchableOpacity>
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
        const { saleCampain } = this.props
        const discountForAccordion = this._getDiscountForAccordion(saleCampain)
        return (
            <FlatList
                extraData={this.state.isDeleting}
                data={section.discountList}
                renderItem={({ item, index }) => this._renderDiscountItem({ item, index, section })}
                keyExtractor={item => chainParse(item, ['saleDiscount', 'id'])}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
            />
        )
    }

    _updateSections = (activeSections) => {
        console.log('activeSections', activeSections)
        this.setState({ activeSections })
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
                <View className='row-center' style={{ marginTop: getWidth(72) }}>
                    <View style={[SURFACE_STYLES.rowCenter]}>
                        <Image
                            source={require('~/src/image/empty_menu.png')}
                            resizeMode={'contain'}
                            style={{ width: getWidth(167), height: getWidth(90) }} />
                    </View>
                </View>
                <View className='column-center' style={{ marginTop: getWidth(25), marginHorizontal: getWidth(42) }}>
                    <Text className='center'>
                        <Text className='s14 gray bold'>{I18n.t('no_setup_discount')}</Text>
                        {"\n\n"}
                        {generateHighlightText(
                            I18n.t('create_discount_hint'),
                            { ...textStyles.gray, ...textStyles.s14 },
                            { ...textStyles.cerulean, ...textStyles.s14, ...textStyles.bold }
                        )}
                    </Text>
                </View>
                <View className='column-center' style={{ marginTop: getWidth(40) }}>
                    <Image source={require('~/src/image/imgArrow.png')}
                        style={{ width: getWidth(27), height: getWidth(77.4), position: 'absolute', left: getWidth(136), top: 0 }}
                    />
                </View>

            </View>
        )

    }


    _handlePressCreateDiscount = () => {
        this.props.navigation.navigate('DiscountInfo', {
            mode: FORM_MODE.ADD
        })
    }

    _getDiscountForAccordion = lodash.memoize(saleCampain => {
        const now = moment()
        const endOfToday = now.clone().endOf('day').unix()
        const startOfToday = now.clone().startOf('day').unix()
        const activeDiscount = []
        const upcomingDiscount = []
        const endedDiscount = []
        saleCampain.forEach((item, index) => {
            const discountStartTime = +chainParse(item, ['saleDiscount', 'startTime'])
            const discountEndTime = +chainParse(item, ['saleDiscount', 'endTime'])
            if (discountStartTime > endOfToday) {
                upcomingDiscount.push(item)
            } else if (discountEndTime < startOfToday) {
                endedDiscount.push(item)
            } else {
                activeDiscount.push(item)
            }
        })
        return [
            {
                id: 1,
                title: I18n.t('active_discount'),
                discountList: activeDiscount
            },
            {
                id: 2,
                title: I18n.t('upcoming_discount'),
                discountList: upcomingDiscount
            },
            {
                id: 3,
                title: I18n.t('ended_discount'),
                discountList: endedDiscount
            }
        ]
    })

    _handlePressDeleteDiscountItem = (item) => {
        console.log('_handlePressDeleteDiscountItem', item)
        this.selectedDiscountId = chainParse(item, ['saleDiscount', 'id'])
        this.selectedDiscountName = chainParse(item, ['saleDiscount', 'name'])
        const warnMessage = replacePatternString(I18n.t('warning_delete_discount'), `"${this.selectedDiscountName}"`)
        this.setState({
            popupDeleteContent: warnMessage
        }, () => {
            this.popupConfirmDelete && this.popupConfirmDelete.open()
        })
    }

    _deleteDiscount = () => {
        if (!this.selectedDiscountId) return
        console.log('Deleting', this.state.discountId)
        this.setState({ loading: true })
        const { deleteSaleCampain, checkAndSyncMasterData } = this.props
        deleteSaleCampain(this.selectedDiscountId, (err, data) => {
            console.log('deleteSaleCampain err', err)
            console.log('deleteSaleCampain data', data)
            this.setState({ loading: false, isDeleting: false })
            if (data && data.updated && data.updated.result === true) {
                ToastUtils.showSuccessToast(I18n.t('delete_discount_success'))
                checkAndSyncMasterData()
            }
        })
    }

    componentDidMount() {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }
    }


    render() {
        const { saleCampain } = this.props
        const discountForAccordion = this._getDiscountForAccordion(saleCampain)

        return (
            <Container>
                <View className='flex background'>
                    <PopupConfirm
                        ref={ref => this.popupConfirmDelete = ref}
                        content={this.state.popupDeleteContent}
                        onPressYes={this._deleteDiscount}
                        onPressNo={() => {
                            this.selectedDiscountId = ''
                            this.selectedDiscountName = ''
                        }}
                    />
                    <LoadingModal visible={this.state.loading} />
                    <Toolbar
                        title={I18n.t('sale_campain_manager').toUpperCase()}
                    />
                    <View className='row-start ph16 pv8 white' style={{
                    }}>
                        <SearchBox
                            keyword={this.state.keyword}
                            onChangeKeyword={this._handleChangeKeyword}
                            onClear={this._clearKeyword}
                            placeholder={I18n.t('search_discount')}
                        />
                        <TouchableOpacity onPress={this._handlePressDetele}>
                            <Image source={this.state.isDeleting ? require('~/src/image/delete_active.png') : require('~/src/image/delete2.png')} style={styles.deleteIcon} />
                        </TouchableOpacity>
                    </View>
                    {this.state.isSearching ?
                        <FlatList
                            data={this.state.searchResult}
                            renderItem={this._renderDiscountItem}
                            ListHeaderComponent={this._renderSearchResultTitle}
                            ListFooterComponent={<View className={'space50'} />}
                            keyExtractor={item => chainParse(item, ['saleDiscount', 'id'])}
                        />
                        :
                        (!saleCampain || saleCampain.length == 0) ?
                            this._renderEmptyState()
                            :
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                            >
                                <View className={'space12'} />
                                <Accordion
                                    activeSections={this.state.activeSections}
                                    sections={discountForAccordion}
                                    renderHeader={this._renderHeader}
                                    renderContent={this._renderContent}
                                    onChange={this._updateSections}
                                    sectionContainerStyle={{ marginBottom: 8 }}
                                    touchableComponent={TouchableOpacity}
                                    expandMultiple={true}
                                />
                                <View className={'space50'} />
                            </ScrollView>
                    }

                    <View className='bottom'>
                        <Button
                            text={I18n.t('create_discount')}
                            onPress={this._handlePressCreateDiscount}
                            style={SURFACE_STYLES.flex}
                        />
                    </View>
                </View>
            </Container>
        )
    }
}

export default connect(state => ({
    merchantId: merchantIdSelector(state),
    saleCampain: saleCampainSelector(state)
}), { deleteSaleCampain, checkAndSyncMasterData })(DiscountManager)