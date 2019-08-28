import React, { Component } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import I18n from "~/src/I18n";
import { formatMoney, chainParse, revertFormatMoney, replacePatternString } from "~/src/utils";
import { merchantIdSelector } from "~/src/store/selectors/merchant";
import LoadingModal from "~/src/components/LoadingModal";
import { FORM_MODE, DISCOUNT_METHOD, DISCOUNT_TYPE } from "~/src/constants";
import { accessTokenSelector } from "~/src/store/selectors/auth";
import {
    View, Toolbar, Button, Text,
    DateInput, Label, RoundCheckbox, TextInputBase as TextInput,
    Container, SingleRowInput, PopupConfirm
} from '~/src/themes/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import Image from 'react-native-fast-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { menuSelectorWithoutOther } from '~/src/store/selectors/menu'
import styles from './styles'
import ToastUtils from '~/src/utils/ToastUtils'
import { checkAndSyncMasterData } from '~/src/store/actions/backgroundSync'
import { createSaleCampain, deleteSaleCampain } from "~/src/store/actions/product";
import moment from 'moment'

class DiscountInfo extends Component {

    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props);
        const mode = props.navigation.getParam('mode', FORM_MODE.EDIT)
        const discountInfo = props.navigation.getParam('discountInfo', '')
        const startTime = chainParse(discountInfo, ['saleDiscount', 'startTime'])
        const endTime = chainParse(discountInfo, ['saleDiscount', 'endTime'])

        this.state = {
            mode,
            loading: false,
            discountId: chainParse(discountInfo, ['saleDiscount', 'id']) || '',
            discountName: chainParse(discountInfo, ['saleDiscount', 'name']) || '',
            discountValue: chainParse(discountInfo, ['saleDiscount', 'promotionValue']) || '',
            discountType: chainParse(discountInfo, ['saleDiscount', 'promotionType']) || DISCOUNT_TYPE.AMOUNT,
            startDate: startTime ? moment(startTime * 1000) : moment(),
            endDate: endTime ? moment(endTime * 1000) : '',
            productList: chainParse(discountInfo, ['saleProductList']) || [],
            errDiscountName: '',
            errDiscountValue: '',
            changed: false,
            popupDeleteContent: ''
        }
    }

    componentDidMount() {

    }



    _handleSave = async () => {
        console.log("Pressing Save", this.state);
        const { createSaleCampain, merchantId, checkAndSyncMasterData } = this.props;
        const discountValue = +revertFormatMoney(this.state.discountValue)
        if (this.state.discountType == DISCOUNT_TYPE.PERCENTAGE && discountValue > 100) {
            this.setState({ errDiscountValue: I18n.t('err_invalid_discount_value') })
            return
        }
        const requestObj = {
            merchantId: merchantId,
            discountId: this.state.discountId,
            name: this.state.discountName.trim(),
            promotionType: this.state.discountType,
            promotionValue: revertFormatMoney(this.state.discountValue),
            startTime: this.state.startDate.startOf('day').unix(),
            endTime: this.state.endDate.endOf('day').unix(),
            listProductId: this.state.productList.map(item => item.id).join(","),
            type: 1,
            limitUse: 1000,
            available: 1000
        };
        console.log("Request Obj", requestObj);
        this.setState({ loading: true })
        createSaleCampain(requestObj, (err, data) => {
            console.log("createSaleCampain err", err);
            console.log("createSaleCampain data", data);
            this.setState({ loading: false });
            if (chainParse(data, ["httpHeaders", "status"]) == 200) {
                checkAndSyncMasterData();
                ToastUtils.showSuccessToast(this.state.mode == FORM_MODE.ADD ? I18n.t('create_discount_success') : I18n.t('update_discount_success'))
                this.props.navigation.goBack();
            }
        });
    }

    _handlePressDiscountType = (item) => {
        if (item.id != this.state.discountType) {
            this.setState({ discountType: item.id, changed: true, errDiscountValue: '' })
        }
    }

    _onChooseProduct = (selectedProduct) => {
        console.log('_onChooseProduct', selectedProduct)
        this.setState({ productList: selectedProduct, changed: true })
    }

    _handlePressChooseProduct = () => {
        console.log('_handlePressChooseProduct')
        this.props.navigation.navigate('DiscountProductSelector', {
            selectedProduct: this.state.productList,
            callback: this._onChooseProduct
        })
    }


    _handleChangeStartDate = (startDate) => {
        console.log('_handleChangeStartDate', startDate)
        this.setState({ startDate, changed: true })
    }

    _handleChangeEndDate = (endDate) => {
        console.log('_handleChangeEndDate', endDate)
        this.setState({ endDate, changed: true })
    }

    _handPressDeleteProduct = (item, index) => {
        const newProductList = [...this.state.productList]
        newProductList.splice(index, 1)
        this.setState({ productList: newProductList, changed: true })
    }

    _renderProductItem = (item, index) => {
        const isLastItem = (index == this.state.productList.length - 1)
        return (
            <ProductItem
                key={item.id}
                isLastItem={isLastItem}
                data={item}
                style={{ paddingLeft: 0 }}
                innerStyle={{ paddingLeft: 24, paddingRight: 24, }}
                showDelete={true}
                onPressDelete={this._handPressDeleteProduct}
            />
        )
    }

    _renderEmptyProduct = () => {
        return (
            <View className='white pv32 row-center'>
                <Text className='gray bold'>{I18n.t('no_product')}</Text>
            </View>
        )
    }

    _render = () => {
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
            >
                <View>

                    <View className='space8' />

                    <View className='row-start white border-bottom2'>
                        <View className='leftLabel'>
                            <Text className='s12 textBlack'>{I18n.t('discount_name')}</Text>
                        </View>
                        <View className='ph16 flex pt16 border-left2' style={{ paddingBottom: !!this.state.errDiscountName ? 0 : 16 }}>
                            <TextInput
                                onChangeText={text => this.setState({ discountName: text, changed: true, errDiscountValue: '' })}
                                value={this.state.discountName}
                                style={{ fontSize: 14, flex: 1, height: 16, paddingTop: 0, paddingBottom: 0 }}
                                selectionColor={COLORS.CERULEAN}
                                maxLength={80}
                            />
                            {!!this.state.errDiscountName && <Text className='error pv8'>{this.state.errDiscountName}</Text>}
                        </View>
                    </View>
                    <View className='space8' />

                    <View className='white border-bottom2'>
                        <View className='row-all-start'>
                            <View className='row-all-start pv16' style={styles.leftView}>
                                <Label>{I18n.t('discount_by')}</Label>
                            </View>
                            <View className='flex ph16 pv16 border-left2'>
                                <View>
                                    {DISCOUNT_METHOD.map((item, index) =>
                                        <RoundCheckbox
                                            key={item.id}
                                            checked={item.id == this.state.discountType}
                                            text={item.title}
                                            onPress={() => this._handlePressDiscountType(item)}
                                            style={{ marginBottom: index == DISCOUNT_METHOD.length - 1 ? 0 : 5 }}
                                        />
                                    )}

                                </View>
                            </View>
                        </View>
                    </View>

                    <SingleRowInput
                        label={I18n.t('discount_value')}
                        onChangeText={text => this.setState({ discountValue: formatMoney(text), changed: true })}
                        value={formatMoney(this.state.discountValue)}
                        keyboardType={"number-pad"}
                        maxLength={this.state.discountType == DISCOUNT_TYPE.PERCENTAGE ? 3 : 19}
                        error={this.state.errDiscountValue}
                        rightLabel={this.state.discountType == DISCOUNT_TYPE.AMOUNT ? I18n.t('vnd') : I18n.t('percent_sign')}
                    />

                    <View className='space12' />
                    <View className='white'>
                        <View className='ph24 pv12 row-start border-bottom2'>
                            <Text className='textBlack s12'>{I18n.t('apply_time')}</Text>
                        </View>
                        <View className='white border-bottom2'>
                            <DateInput
                                value={this.state.startDate}
                                title={I18n.t('from_date')}
                                onChange={this._handleChangeStartDate}
                                showCalendar={true}
                                maxDate={this.state.endDate ?
                                    new Date(
                                        this.state.endDate.year(),
                                        this.state.endDate.month(),
                                        this.state.endDate.date()
                                    )
                                    :
                                    undefined
                                }
                                placeholder={I18n.t('date_input_placeholder')}
                            />
                        </View>
                        <View className='white border-bottom2'>
                            <DateInput
                                value={this.state.endDate}
                                title={I18n.t('to_date')}
                                onChange={this._handleChangeEndDate}
                                showCalendar={true}
                                minDate={this.state.startDate ?
                                    new Date(
                                        this.state.startDate.year(),
                                        this.state.startDate.month(),
                                        this.state.startDate.date()
                                    )
                                    :
                                    null
                                }
                                placeholder={I18n.t('date_input_placeholder')}
                            />
                        </View>
                    </View>
                    <View className='space10' />
                    <View className='white'>
                        <View className='ph24 pv12 row-start border-bottom2'>
                            <Text className='textBlack s12'>{I18n.t('apply_product')}</Text>
                        </View>
                        <View className='border-bottom2 row-center'>
                            <TouchableOpacity onPress={this._handlePressChooseProduct}>
                                <View className='row-center pv16'>
                                    <Image
                                        source={require('~/src/image/location.png')}
                                        style={{ width: 16, height: 16, marginRight: 8 }}
                                    />
                                    <Text className='s12 cerulean'>{I18n.t('choose_product')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {!!(this.state.productList && this.state.productList.length > 0) ?
                            this.state.productList.map(this._renderProductItem)
                            :
                            this._renderEmptyProduct()
                        }
                    </View>



                    <View className='space50' />
                </View>
            </KeyboardAwareScrollView>
        )
    }

    _deleteDiscount = () => {
        this.setState({ loading: true })
        const { deleteSaleCampain, checkAndSyncMasterData } = this.props
        deleteSaleCampain(this.state.discountId, (err, data) => {
            console.log('deleteSaleCampain err', err)
            console.log('deleteSaleCampain data', data)
            this.setState({ loading: false, isDeleting: false })
            if (data && data.updated && data.updated.result === true) {
                ToastUtils.showSuccessToast(I18n.t('delete_discount_success'))
                this.props.navigation.goBack()
                checkAndSyncMasterData()
            }
        })
    }

    _handlePressRight = () => {
        if (this.state.mode == FORM_MODE.ADD) {
            this.props.navigation.goBack()
        } else {
            const warnMessage = replacePatternString(I18n.t('warning_delete_discount'), `"${this.state.discountName}"`)
            this.setState({
                popupDeleteContent: warnMessage
            }, () => {
                this.popupConfirmDelete && this.popupConfirmDelete.open()
            })
        }

    }

    render() {
        const discountValue = +revertFormatMoney(this.state.discountValue)
        const disabledButton = !(
            this.state.discountName &&
            this.state.discountType &&
            discountValue && discountValue > 0 &&
            this.state.startDate &&
            this.state.endDate &&
            this.state.productList &&
            this.state.productList.length > 0 &&
            this.state.changed
        )

        const toolbarTitle = this.state.mode == FORM_MODE.ADD ? I18n.t('create_discount') : I18n.t('update_discount')
        const buttonTitle = this.state.mode == FORM_MODE.ADD ? I18n.t('done') : I18n.t('save_change')
        const rightText = this.state.mode == FORM_MODE.ADD ? I18n.t('cancel') : I18n.t('delete')
        return (
            <Container>
                <View className='flex background'>
                    <LoadingModal visible={this.state.loading} />
                    <PopupConfirm
                        ref={ref => this.popupConfirmDelete = ref}
                        content={this.state.popupDeleteContent}
                        onPressYes={this._deleteDiscount}
                        onPressNo={() => {
                        }}
                    />
                    <Toolbar
                        title={toolbarTitle}
                        rightText={rightText}
                        onPressRight={this._handlePressRight}
                    />
                    {this._render()}
                    <View className='bottom'>
                        <Button
                            onPress={this._handleSave}
                            text={buttonTitle}
                            disabled={disabledButton}
                            style={SURFACE_STYLES.flex}
                        />
                    </View>
                </View>

            </Container>
        );
    }
}

export default connect(
    state => ({
        merchantId: merchantIdSelector(state),
        accessToken: accessTokenSelector(state),
        menus: menuSelectorWithoutOther(state)
    }),
    {
        createSaleCampain,
        checkAndSyncMasterData,
        deleteSaleCampain
    }
)(DiscountInfo);
