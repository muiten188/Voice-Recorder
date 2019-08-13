import React, { Component } from "react";
import { SafeAreaView, TouchableOpacity, InputAccessoryView, Platform } from "react-native";
import { connect } from "react-redux";
import I18n from "~/src/I18n";
import {
    formatMoney, chainParse, revertFormatMoney,
    convertFileUri, isLocalImage,
    replacePatternString
} from "~/src/utils";
import {
    generateProductId,
    createProduct,
    updateProduct,
    getProductList,
    getProductDetail,
    removeProduct,
    syncProductFromNetwork,
    getAttribute,
    generateProductCode
} from "~/src/store/actions/product";
import { merchantIdSelector } from "~/src/store/selectors/merchant";
import LoadingModal from "~/src/components/LoadingModal";
import RNFetchBlob from "rn-fetch-blob";
import { FORM_MODE, PRODUCT_STATUS } from "~/src/constants";
import lodash from "lodash";
import { accessTokenSelector } from "~/src/store/selectors/auth";
import APIManager from '~/src/store/api/APIManager'
import { syncProductAndMenu } from '~/src/store/actions/backgroundSync'
import {
    View, Toolbar, Button, BottomView, Text,
    Caption, Label, ActionText, MultipleTagSelector,
    RoundCheckbox, TextInputBase as TextInput,
    PopupConfirm
} from '~/src/themesnew/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themesnew/common'
import ImagePicker from 'react-native-image-picker'
import Image from 'react-native-fast-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { menuSelectorWithoutOther } from '~/src/store/selectors/menu'
import styles from './styles'
import ToastUtils from '~/src/utils/ToastUtils'

class ProductInfo extends Component {

    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props);
        const product = props.navigation.getParam("product");
        const quantity = chainParse(product, ["quantity"]);
        const listProductMedia = chainParse(product, ["listProductMedia"]);
        console.log("Product", product);
        const mode = props.navigation.getParam("mode") || FORM_MODE.EDIT
        this.state = {
            mode,
            canEditProductCode: (mode == FORM_MODE.ADD),
            productId: props.navigation.getParam("id", ""),
            productName: chainParse(product, ["productName"]) || "",
            productCode: chainParse(product, ["productCode"]) || "",
            productImage: listProductMedia && lodash.isArray(listProductMedia) ?
                listProductMedia[0] : '',
            productStatus: chainParse(product, ["status"]) || 0,
            description: chainParse(product, ["description"]) || "",
            originPrice: chainParse(product, ["orinalPrice"]) || "",
            salePrice: chainParse(product, ["price"]) || "",
            quantity: quantity ? quantity + "" : "",
            menuIds: props.navigation.getParam("menuIds", []),
            errProductCode: '',
            loading: false,
            popupDeleteContent: ''
        };
    }

    componentDidMount() {
        if (this.state.mode != FORM_MODE.ADD) {
            const { getProductDetail } = this.props;
            getProductDetail(this.state.productId, (err, data) => {
                console.log("getProductDetail err", err);
                console.log("getProductDetail data", data);
                if (data && data.saleProduct) {
                    const saleProductMedias = data.saleProductMedias;
                    const listMerchantMenu = data.listMerchantMenu;
                    const productCode = chainParse(data, ["saleProduct", "productCode"])
                    this.setState({
                        productName: chainParse(data, ["saleProduct", "name"]),
                        salePrice: chainParse(data, ["saleProduct", "price"]),
                        quantity: '', // chainParse(data, ["saleProduct", "quantity"])
                        productCode,
                        productStatus: chainParse(data, ["saleProduct", "status"]),
                        productImage: saleProductMedias && lodash.isArray(saleProductMedias) ? saleProductMedias[0] : '',
                        description: chainParse(data, ["saleProduct", "description"]) || "",
                        menuIds: (listMerchantMenu && listMerchantMenu.length > 0) ?
                            listMerchantMenu.map(item => item.id).filter(item => !!item) : []
                    });
                }
            })
        }
    }

    _uploadImage = imageFile => {
        const { merchantId, accessToken } = this.props;
        const fileUri = convertFileUri(imageFile);
        const IMAGE_UPLOAD_URL = APIManager.apiInstance ? APIManager.apiInstance.IMAGE_UPLOAD_URL : ''
        console.log(
            "Start fetch",
            `${IMAGE_UPLOAD_URL}/upload-file?merchantId=${merchantId}`
        );
        console.log("Authorization", `Bearer ${accessToken}`);
        return RNFetchBlob
            .config({
                trusty: true
            })
            .fetch(
                "POST",
                `${IMAGE_UPLOAD_URL}/upload-file?merchantId=${merchantId}`,
                {
                    "Content-Type": "image/jpeg",
                    Authorization: `Bearer ${accessToken}`
                },
                RNFetchBlob.wrap(fileUri)
            )
            .then(res => {
                console.log("Fet res", res);
                return Promise.resolve(res.json());
            })
            .catch(err => {
                // error handling .
                console.log("Image Upload Catch", err);
                return Promise.resolve("error");
            });
    };

    _handleSave = lodash.throttle(async () => {
        console.log("Pressing Save", this.state);
        const { merchantId, createProduct, updateProduct, syncProductAndMenu } = this.props;
        // Upload image
        let avatarImage = chainParse(this.state.productImage, ['uploadImageId']) || ''
        let listImage = chainParse(this.state.productImage, ['uploadImageId']) || ''

        this.setState({ loading: true });
        // Local file image
        if (this.state.productImage && this.state.productImage.url && isLocalImage(this.state.productImage.url)) {
            const uploadImagesResponse = await this._uploadImage(this.state.productImage.url)
            console.log('uploadImagesResponse', uploadImagesResponse)
            const imageUploadId = chainParse(uploadImagesResponse, ["updated", "pictureId"])
            avatarImage = imageUploadId
            listImage = imageUploadId
        }

        const requestObj = {
            merchantId: merchantId,
            productId: this.state.productId,
            name: this.state.productName.trim(),
            productCode: this.state.productCode.trim(),
            description: this.state.description.trim(),
            originalPrice: +revertFormatMoney(this.state.originPrice),
            price: +revertFormatMoney(this.state.salePrice),
            quantity: '', // +revertFormatMoney(this.state.quantity)
            category: 15, // Ăn uống //this.state.categoryId,
            avatarImage,
            listImage,
            updateVariant: true,
            updateImage: true,
            searchable: 1,
            menuId: this.state.menuIds.join(','),
            status: this.state.productStatus
        };
        console.log("Request Object", requestObj);
        this.setState({ loading: true });
        if (this.state.mode == FORM_MODE.ADD) {
            createProduct(requestObj, (err, data) => {
                console.log("Create Product Err", err);
                console.log("Create Product Data", data);
                this.setState({ loading: false });
                const callback = this.props.navigation.getParam('callback')
                if (data && data.code) {
                    if (data.code == 3004) {
                        this.setState({ errProductCode: I18n.t('product_code_exists') })
                    } else {
                        ToastUtils.showErrorToast(data.msg)
                    }
                } else if (chainParse(data, ["httpHeaders", "status"]) == 200) {
                    ToastUtils.showSuccessToast(replacePatternString(I18n.t('add_product_success'), `"${requestObj.name}"`))
                    callback && callback({
                        ...data.saleProduct,
                        productName: chainParse(data, ['saleProduct', 'name']),
                        listProductMedia: chainParse(data, ['saleProductMedias']) || []
                    })
                    syncProductAndMenu()
                    this.props.navigation.goBack();
                }
            })
        } else if (this.state.mode == FORM_MODE.EDIT) {
            console.log("Update Product", updateProduct);
            updateProduct(requestObj, (err, data) => {
                console.log("updateProduct Err", err);
                console.log("updateProduct Data", data);
                this.setState({ loading: false });
                if (data && data.code) {
                    if (data.code == 3004) {
                        this.setState({ errProductCode: I18n.t('product_code_exists') })
                    } else {
                        ToastUtils.showErrorToast(data.msg)
                    }
                } else if (chainParse(data, ["httpHeaders", "status"]) == 200) {
                    ToastUtils.showSuccessToast(replacePatternString(I18n.t('update_product_success'), `"${requestObj.name}"`))
                    syncProductAndMenu()
                    this.props.navigation.goBack();
                }
            })
        }
    }, 500)

    _setStateSalePrice(price) {
        if (price === "0") {
            this.setState({
                salePrice: ""
            });
        } else {
            this.setState({
                salePrice: formatMoney(price)
            });
        }
    }
    _setStateQuatity(quatity) {
        if (quatity === "0") {
            this.setState({
                quantity: ""
            });
        } else {
            this.setState({
                quantity: formatMoney(quatity)
            });
        }
    }


    _handlePressDeleteImage = () => {
        this.setState({ productImage: '' })
    }

    _handlePressUpdateImage = () => {
        ImagePicker.launchImageLibrary({

        }, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({
                    productImage: {
                        id: '',
                        url: response.uri
                    }
                })
            }
        })
    }

    _onAddMenu = (menuId) => {
        this.setState({ menuIds: [...this.state.menuIds, menuId] })
    }

    _handlePressAddMenu = () => {
        this.props.navigation.navigate('AddMenu', {
            goBack: true,
            callback: this._onAddMenu
        })
    }

    _updateMenu = (newMenuIds) => {
        this.setState({ menuIds: newMenuIds })
    }

    _handlePressStatus = (item) => {
        if (item.value != this.state.productStatus) {
            this.setState({ productStatus: item.value })
        }
    }

    _render = () => {
        console.log('ProductInfo', this.state)
        const { menus } = this.props
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
            >
                <View>

                    {(this.state.mode == FORM_MODE.EDIT) ?
                        <View>
                            <View className='space10' />
                            <View className='white border-bottom2'>
                                <View className='row-all-start'>
                                    <View className='row-start pv16' style={styles.leftView}>
                                        <Label>{I18n.t('status')}</Label>
                                    </View>
                                    <View className='flex ph16 pv16 border-left2'>
                                        <View className='row-space-between'>
                                            {PRODUCT_STATUS.map(item =>
                                                <RoundCheckbox
                                                    key={item.value}
                                                    checked={item.value == this.state.productStatus}
                                                    text={item.name}
                                                    onPress={() => this._handlePressStatus(item)}
                                                />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className='space10' />
                        </View>
                        :
                        <View className='space18' />


                    }

                    <View className='row-all-start white'>
                        <View className='pv14 row-all-start' style={styles.leftView}>
                            <Label>{I18n.t('product_image')}</Label>
                        </View>
                        <View className='row-start flex border-left2' style={{ padding: 14 }}>
                            {(!this.state.productImage || !this.state.productImage.url) ?
                                <View style={[SURFACE_STYLES.rowCenter, { width: 80, height: 80, borderRadius: 9.4, backgroundColor: COLORS.BACKGROUND2 }]}>
                                    <Image source={require('~/src/image/image_placeholder.png')} style={{ width: 50, height: 55 }} />
                                </View>
                                :
                                <Image
                                    source={{ uri: this.state.productImage.url }}
                                    style={{ width: 80, height: 80, borderRadius: 9.4, backgroundColor: COLORS.BACKGROUND }}
                                />
                            }
                            <View style={{ marginLeft: 24 }}>
                                {(!this.state.productImage || !this.state.productImage.url) ?
                                    <TouchableOpacity onPress={this._handlePressUpdateImage}>
                                        <ActionText>
                                            {I18n.t('add_image')}
                                        </ActionText>
                                    </TouchableOpacity>
                                    :
                                    <View>
                                        <TouchableOpacity onPress={this._handlePressDeleteImage}>
                                            <ActionText>{I18n.t('delete_image')}</ActionText>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this._handlePressUpdateImage}>
                                            <ActionText style={{ marginTop: 16 }}>
                                                {I18n.t('update_image')}
                                            </ActionText>
                                        </TouchableOpacity>
                                    </View>
                                }

                            </View>
                        </View>
                    </View>
                    <View className='space8' />

                    <View className='white border-bottom2'>
                        <View className='row-all-start'>
                            <View className='row-start pv16' style={styles.leftView}>
                                <Label>{I18n.t('product_name')}</Label>
                            </View>
                            <View className='flex ph16 border-left2'>
                                <TextInput
                                    style={{
                                        fontSize: 14,
                                        color: COLORS.TEXT_BLACK,
                                        flex: 1,
                                    }}
                                    onChangeText={text => this.setState({ productName: text })}
                                    value={this.state.productName}
                                    underlineColorAndroid={'transparent'}
                                    maxLength={80}
                                    returnKeyType={'next'}
                                    onSubmitEditing={() => {
                                        this.moneyInput && this.moneyInput.focus()
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View className='white border-bottom2'>
                        <View className='row-all-start'>
                            <View className='row-start pv16' style={styles.leftView}>
                                <Label>{I18n.t('sale_price')}</Label>
                            </View>
                            <View className='flex pv16 ph16 border-left2'>
                                {Platform.OS == 'ios' && <InputAccessoryView nativeID={'moneyInputAccessoryView'}>
                                    <View className='inputAccessoryView'>
                                        <TouchableOpacity onPress={() => {
                                            this.descriptionInput && this.descriptionInput.focus()
                                        }}>

                                            <Text className='inputAccessoryText'>{I18n.t('next_en')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </InputAccessoryView>}
                                <View className='row-start flex'>
                                    <TextInput
                                        style={{
                                            fontSize: 14,
                                            height: 16,
                                            color: COLORS.TEXT_BLACK,
                                            flex: 1,
                                            paddingTop: 0,
                                            paddingBottom: 0
                                        }}
                                        onChangeText={text => this._setStateSalePrice(text)}
                                        value={formatMoney(this.state.salePrice)}
                                        keyboardType={"number-pad"}
                                        underlineColorAndroid={'transparent'}
                                        maxLength={19}
                                        returnKeyType={'next'}
                                        ref={ref => this.moneyInput = ref}
                                        inputAccessoryViewID={'moneyInputAccessoryView'}
                                        onSubmitEditing={() => {
                                            this.descriptionInput && this.descriptionInput.focus()
                                        }}
                                    />
                                    <Text className='s12 lightGray' style={{ marginLeft: 24 }}>{I18n.t('vnd')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* <View className='white border-bottom2'>
                        <View className='row-all-start'>
                            <View className='row-start pv16' style={styles.leftView}>
                                <Label>{I18n.t('quantity')}</Label>
                            </View>
                            <View className='flex ph16 border-left2'>
                                <TextInput
                                    style={{
                                        fontSize: 14,
                                        color: COLORS.TEXT_BLACK,
                                        flex: 1,
                                    }}
                                    placeholder={I18n.t('not_require')}
                                    onChangeText={text => this._setStateQuatity(text)}
                                    value={formatMoney(this.state.quantity)}
                                    keyboardType={"number-pad"}
                                    maxLength={19}
                                />
                            </View>
                        </View>
                    </View> */}
                    <View className='space8' />
                    <View className='white'>
                        <View className='ph24 border-bottom2'>
                            <View className='row-start pv16'>
                                <Text style={{ color: COLORS.TEXT_BLACK }}>
                                    {I18n.t('choose_category_hint')} <Caption>{I18n.t('choose_category_guide')}</Caption>
                                </Text>
                            </View>
                            <View>
                                <MultipleTagSelector
                                    data={menus}
                                    values={this.state.menuIds}
                                    onChange={this._updateMenu}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={[SURFACE_STYLES.rowCenter, { paddingVertical: 8 }]}
                            onPress={this._handlePressAddMenu}
                        >
                            <View style={[SURFACE_STYLES.rowCenter, { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.BACKGROUND3 }]}>
                                <Image source={require('~/src/image/add_opacity.png')} style={{ width: 10, height: 10 }} />
                            </View>
                            <Text style={{ marginLeft: 8 }}>{I18n.t('add_menu')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View className='space8' />
                    <View className='row-start white'>
                        <View className='row-all-start pv16' style={styles.leftViewLarge}>
                            <Label>{I18n.t('product_description')}</Label>
                        </View>
                        <View className='flex ph16 pv16 border-left2'>
                            <TextInput
                                style={{
                                    fontSize: 14,
                                    color: COLORS.TEXT_BLACK,
                                    flex: 1,
                                    height: 57,
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    textAlignVertical: 'top'
                                }}
                                multiline={true}
                                placeholder={I18n.t('not_require')}
                                onChangeText={text => this.setState({ description: text })}
                                value={this.state.description}
                                maxLength={512}
                                ref={ref => this.descriptionInput = ref}
                                returnKeyType={'done'}
                            />
                        </View>
                    </View>

                    <View className='space100' />
                </View>
            </KeyboardAwareScrollView>
        )
    }

    _handlePressRightText = () => {
        if (this.state.mode == FORM_MODE.ADD) {
            this.props.navigation.goBack()
        } else {
            const warnMessage = replacePatternString(I18n.t('warn_delete_product'), `"${this.state.productName}"`)
            this.setState({
                popupDeleteContent: warnMessage
            }, () => {
                this.popupConfirmDelete && this.popupConfirmDelete.open()
            })
        }
    }

    _deleteProduct = () => {
        const { removeProduct, syncProductAndMenu } = this.props;
        this.setState({ loading: true });
        removeProduct(this.state.productId, (err, data) => {
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

    render() {
        const disabledButton = !(
            this.state.productName &&
            this.state.salePrice
        )
        const toolbarTitle = this.state.mode == FORM_MODE.ADD ? I18n.t('add_product') : I18n.t('update_product')
        const buttonTitle = this.state.mode == FORM_MODE.ADD ? I18n.t('done') : I18n.t('save_change')
        const rightText = this.state.mode == FORM_MODE.ADD ? I18n.t('cancel') : I18n.t('delete')
        return (
            <SafeAreaView
                style={[SURFACE_STYLES.flex]}
            >
                <View style={[SURFACE_STYLES.flex, { backgroundColor: COLORS.BACKGROUND }]}>
                    <LoadingModal visible={this.state.loading} />
                    <PopupConfirm
                        ref={ref => this.popupConfirmDelete = ref}
                        content={this.state.popupDeleteContent}
                        onPressYes={this._deleteProduct}
                        onPressNo={() => { }}
                    />
                    <Toolbar
                        title={toolbarTitle}
                        rightText={rightText}
                        onPressRight={this._handlePressRightText}
                    />
                    {this._render()}
                    <BottomView>
                        <Button
                            onPress={this._handleSave}
                            text={buttonTitle}
                            disabled={disabledButton}
                            style={SURFACE_STYLES.flex}
                        />
                    </BottomView>
                </View>

            </SafeAreaView>
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
        getAttribute,
        generateProductId,
        createProduct,
        updateProduct,
        getProductList,
        getProductDetail,
        removeProduct,
        syncProductFromNetwork,
        generateProductCode,
        syncProductAndMenu
    }
)(ProductInfo);
