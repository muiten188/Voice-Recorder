import React, { Component } from 'react';
import { TouchableOpacity, StatusBar, Platform, InputAccessoryView } from 'react-native'
import styles from './styles'
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import I18n from '~/src/I18n'
import { createMerchant, getListMerchant } from '~/src/store/actions/merchant'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { chainParse, convertFileUri, isValidPhoneNumer, isValidEmail, isValidWebsite, formatPhoneNumber, isLocalImage } from '~/src/utils'
import LoadingModal from '~/src/components/LoadingModal'
import RNFetchBlob from 'rn-fetch-blob'
import { FORM_MODE } from '~/src/constants'
import { merchantSelector } from '~/src/store/selectors/merchant'
import Image from 'react-native-fast-image'
import lodash from 'lodash'
import { accessTokenSelector } from '~/src/store/selectors/auth'
import APIManager from '~/src/store/api/APIManager'
import {
    View, Toolbar, Button, Text,
    Label, TextInputBase as TextInput,
    SingleRowInput
} from '~/src/themes/ThemeComponent'
import ImagePicker from 'react-native-image-picker'
import ToastUtils from '~/src/utils/ToastUtils'

class StoreInfo extends Component {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props)
        const { merchantInfo } = props
        console.log('Merchant Info', merchantInfo)
        this.state = {
            mode: props.navigation.getParam('mode') || FORM_MODE.ADD,
            merchantId: chainParse(merchantInfo, ['merchant', 'id']) || '',
            loading: false,
            storeImage: merchantInfo && merchantInfo.listMerchantMedia && merchantInfo.listMerchantMedia.length > 0 ?
                merchantInfo.listMerchantMedia[0] : {},
            storeName: chainParse(merchantInfo, ['merchant', 'fullName']) || '',
            errStoreName: '',
            phoneNumber: chainParse(merchantInfo, ['merchant', 'phone']) || '',
            errPhoneNumber: '',
            email: chainParse(merchantInfo, ['merchant', 'email']) || '',
            errEmail: '',
            website: chainParse(merchantInfo, ['merchant', 'website']) || '',
            errWebsite: '',
            taxCode: chainParse(merchantInfo, ['merchant', 'taxCode']) || '',
            errTaxCode: '',
            address: chainParse(merchantInfo, ['merchant', 'address']) || '',
            description: chainParse(merchantInfo, ['merchant', 'description']) || '',
            bankAccount: chainParse(merchantInfo, ['merchant', 'bankAccount']) || '',
            bankAccountName: chainParse(merchantInfo, ['merchant', 'bankAccountName']) || '',
            errBankAccount: '',
            errBankAccountName: '',
            changed: false
        }

        console.log('Init State', this.state)
    }

    _uploadImage = (imageFile) => {
        const fileUri = convertFileUri(imageFile)
        const { accessToken } = this.props
        const IMAGE_UPLOAD_URL = APIManager.apiInstance ? APIManager.apiInstance.IMAGE_UPLOAD_URL : ''
        console.log('Start fetch', `${IMAGE_UPLOAD_URL}/upload-file?merchantId=${this.state.merchantId}`)
        return RNFetchBlob
            .config({
                trusty: true
            })
            .fetch('POST', `${IMAGE_UPLOAD_URL}/upload-file?merchantId=${this.state.merchantId}`, {
                'Content-Type': 'image/jpeg',
                'Authorization': `Bearer ${accessToken}`
            }, RNFetchBlob.wrap(fileUri))
            .then((res) => {
                console.log('Fet res', res)
                return Promise.resolve(res.json())
            })
            .catch((err) => {
                // error handling .
                console.log('Image Upload Catch', err)
                return Promise.resolve('error')
            })
    }


    _handleSave = lodash.throttle(async () => {
        const phoneNumber = this.state.phoneNumber.replace(/\s/g, "")
        if (!!phoneNumber && !isValidPhoneNumer(phoneNumber)) {
            this.setState({ errPhoneNumber: I18n.t('err_invalid_phone_number') })
            return
        } else if (this.state.email && this.state.email.trim() && !isValidEmail(this.state.email.trim())) {
            this.setState({ errEmail: I18n.t('err_invalid_email') })
            return
        } else if (this.state.website && this.state.website.trim() && !isValidWebsite(this.state.website.trim())) {
            this.setState({ errWebsite: I18n.t('err_invalid_website') })
            return
        } else if (this.state.taxCode && this.state.taxCode.trim() && /[^A-Za-z0-9]/.test(this.state.taxCode.trim())) {
            this.setState({ errTaxCode: I18n.t('err_invalid_tax_code') })
            return
        } else if (this.state.bankAccount && this.state.bankAccount.trim() && /\D/.test(this.state.bankAccount.trim())) {
            this.setState({ errBankAccount: I18n.t('err_invalid_bank_account') })
            return
        }
        console.log('Store image', this.state.storeImage)
        // Upload image
        let logo = chainParse(this.state.storeImage, ['uploadImageId']) || ''
        let listImage = chainParse(this.state.storeImage, ['uploadImageId']) || ''

        this.setState({ loading: true });
        // Local file image
        if (this.state.storeImage && this.state.storeImage.url && isLocalImage(this.state.storeImage.url)) {
            const uploadImagesResponse = await this._uploadImage(this.state.storeImage.url)
            console.log('uploadImagesResponse', uploadImagesResponse)
            const imageUploadId = chainParse(uploadImagesResponse, ["updated", "pictureId"])
            logo = imageUploadId
            listImage = imageUploadId
        }

        const requestObj = {
            merchantId: this.state.merchantId,
            shortName: this.state.storeName.trim(),
            fullName: this.state.storeName.trim(),
            description: this.state.description.trim(),
            address: this.state.address.trim(),
            phone: phoneNumber,
            email: this.state.email,
            website: this.state.website,
            deliveryMethod: 1,
            categoryId: 1,
            taxCode: this.state.taxCode.trim(),
            bankAccount: this.state.bankAccount.trim(),
            bankAccountName: this.state.bankAccountName.trim(),
            logo,
            listImage
        }
        console.log('Request Obj', requestObj)
        this.props.createMerchant(requestObj, (err, data) => {
            console.log('Create Merchant Err', err)
            console.log('Create Merchant Data', data)
            this.setState({ loading: false })
            if (chainParse(data, ['httpHeaders', 'status']) == 200) {
                ToastUtils.showSuccessToast(I18n.t('update_store_info_success'))
                this.props.getListMerchant()
                this.props.navigation.goBack()
            } else if (data && data.code) {
                ToastUtils.showErrorToast(data.msg)
            }
        })
    }, 500)

    componentDidMount() {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }
    }

    // _measureAddressInput = () => {
    //     setTimeout(() => {
    //         console.log('Address Input Ref', this.addressInputContainer)
    //         if (!!this.addressInputContainer) {
    //             this.addressInputContainer.measure((x, y, width, height, pageX, pageY) => {
    //                 console.log('Measure addressInput', x, y, width, height, pageX, pageY)
    //                 this.setState({
    //                     autoCompletePosition: {
    //                         x: pageX,
    //                         y: pageY + 20,
    //                         width
    //                     }
    //                 })
    //             })
    //         }
    //     }, 300)
    // }

    // _queryPlaceAutoComplete = lodash.debounce(text => {
    //     const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${this.state.address}&language=vi&key=${GOOGLE_API_KEY}`
    //     console.log('PlaceAutoComplete URL', url)
    //     fetch(url)
    //         .then(response => response.json())
    //         .then(responseJSON => {
    //             if (responseJSON.status == 'OK') {
    //                 console.log('Response JSON', responseJSON)
    //                 this.setState({ autoCompleteData: responseJSON.predictions, showingAutoComplete: true })
    //             }
    //         })
    // }, 300)

    // _handleChangeAddress = (text) => {
    //     this.setState({ address: text }, () => {
    //         this._queryPlaceAutoComplete(this.state.address)
    //     })
    // }

    // _queryPlaceByPlaceId = (placeId) => {
    //     console.log('Place Id', placeId)
    //     const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}`
    //     console.log('Place Detail Url', url)
    //     fetch(url)
    //         .then(response => response.json())
    //         .then(responseJSON => {
    //             if (responseJSON.status == 'OK') {
    //                 console.log('Response JSON', responseJSON)
    //                 const lat = chainParse(responseJSON, ['result', 'geometry', 'location', 'lat'])
    //                 const long = chainParse(responseJSON, ['result', 'geometry', 'location', 'lng'])
    //                 console.log('Lat Long', lat, long)
    //                 this.setState({ lat, long })
    //             }
    //         })
    // }


    // _handlePressAutoCompleteItem = (item) => {
    //     console.log('_handlePressAutoCompleteItem', item)
    //     this.setState({ showingAutoComplete: false, address: item.description }, () => {
    //         this._queryPlaceByPlaceId(item.place_id)
    //     })
    // }

    // _renderAutoCompleteItem = ({ item }) => {
    //     return (
    //         <TouchableOpacity onPress={() => this._handlePressAutoCompleteItem(item)}>
    //             <View style={styles.autoCompleteItem}>
    //                 <Text style={styles.autoCompleteText}>{item.description}</Text>
    //             </View>
    //         </TouchableOpacity>
    //     )
    // }

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
                    storeImage: {
                        id: '',
                        url: response.uri
                    },
                    changed: true
                })
            }
        })
    }

    _handlePressDeleteImage = () => {
        this.setState({ storeImage: '', changed: true })
    }

    render() {
        const { merchantInfo } = this.props
        const enableButton = !!(this.state.storeName && this.state.merchantId && this.state.changed)
        return (
            <Container>
                <LoadingModal visible={this.state.loading} />
                <Toolbar
                    title={I18n.t('store_info')}
                />
                <View className='flex background'>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View className='ph24 pt16 pb12'>
                            <Text className='s12 textBlack'>{I18n.t('tenant_code')}</Text>
                            <Text className='s15 bold textBlack' style={{ marginTop: 5 }}>{(chainParse(merchantInfo, ['merchant', 'tenantCode']) || '').toLowerCase()}</Text>
                        </View>

                        <View className='row-all-start white'>
                            <View className='pv14 row-all-start' style={styles.leftView}>
                                <Label>{I18n.t('avatar')}</Label>
                            </View>
                            <View className='row-start flex border-left2' style={{ padding: 14 }}>
                                {(!this.state.storeImage || !this.state.storeImage.url) ?
                                    <View style={[SURFACE_STYLES.rowCenter, { width: 80, height: 80, borderRadius: 9.4, backgroundColor: COLORS.BACKGROUND2 }]}>
                                        <Image source={require('~/src/image/image_placeholder.png')} style={{ width: 50, height: 55 }} />
                                    </View>
                                    :
                                    <Image
                                        source={{ uri: this.state.storeImage.url }}
                                        style={{ width: 80, height: 80, borderRadius: 9.4, backgroundColor: COLORS.BACKGROUND }}
                                    />
                                }
                                <View style={{ marginLeft: 24 }}>
                                    {(!this.state.storeImage || !this.state.storeImage.url) ?
                                        <TouchableOpacity onPress={this._handlePressUpdateImage}>
                                            <Text className='action'>
                                                {I18n.t('add_image')}
                                            </Text>
                                        </TouchableOpacity>
                                        :
                                        <View>
                                            <TouchableOpacity onPress={this._handlePressDeleteImage}>
                                                <Text className='action'>{I18n.t('delete_image')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={this._handlePressUpdateImage}>
                                                <Text className='action' style={{ marginTop: 16 }}>
                                                    {I18n.t('update_image')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    }

                                </View>
                            </View>
                        </View>
                        <View className='space10' />


                        <View className='white border-bottom2'>
                            <SingleRowInput
                                onChangeText={text => this.setState({ storeName: text, changed: true })}
                                value={this.state.storeName}
                                maxLength={80}
                                autoCapitalize={'none'}
                                label={I18n.t('store_name')}
                                error={this.state.errStoreName}
                                ref={ref => this.storeNameInput = ref}
                                returnKeyType={'next'}
                                onSubmitEditing={() => {
                                    this.phoneInput && this.phoneInput.focus()
                                }}
                            />
                        </View>

                        <View className='white border-bottom2'>
                            {Platform.OS == 'ios' && <InputAccessoryView nativeID={'phoneInputAccessoryView'}>
                                <View className='inputAccessoryView'>
                                    <TouchableOpacity onPress={() => {
                                        this.addressInput && this.addressInput.focus()
                                    }}>

                                        <Text className='inputAccessoryText'>{I18n.t('next_en')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </InputAccessoryView>}
                            <SingleRowInput
                                onChangeText={text => this.setState({ phoneNumber: formatPhoneNumber(text), changed: true, errPhoneNumber: '' })}
                                value={formatPhoneNumber(this.state.phoneNumber)}
                                maxLength={12}
                                autoCapitalize={'none'}
                                keyboardType={'number-pad'}
                                returnKeyType={'next'}
                                label={I18n.t('phone_number')}
                                error={this.state.errPhoneNumber}
                                ref={ref => this.phoneInput = ref}
                                enablesReturnKeyAutomatically={true}
                                inputAccessoryViewID={'phoneInputAccessoryView'}
                                onSubmitEditing={() => {
                                    this.addressInput && this.addressInput.focus()
                                }}
                            />
                        </View>

                        <View className='row-all-start white border-bottom2'>
                            <View className='row-all-start pv16' style={styles.leftViewLarge}>
                                <Text className='s12 textBlack'>{I18n.t('address')}</Text>
                            </View>
                            <View className='flex ph16 pv16 border-left2'>
                                <TextInput
                                    style={styles.textInputAddress}
                                    multiline={true}
                                    onChangeText={text => this.setState({ address: text, changed: true })}
                                    value={this.state.address}
                                    maxLength={512}
                                    autoCapitalize={'none'}
                                    returnKeyType={'next'}
                                    ref={ref => this.addressInput = ref}
                                    onSubmitEditing={() => {
                                        this.emailInput && this.emailInput.focus()
                                    }}
                                />
                            </View>
                        </View>

                        <View className='white border-bottom2'>
                            <SingleRowInput
                                onChangeText={text => this.setState({ email: text, changed: true, errEmail: '' })}
                                value={this.state.email}
                                maxLength={320}
                                autoCapitalize={'none'}
                                label={I18n.t('email_label')}
                                error={this.state.errEmail}
                                returnKeyType={'next'}
                                ref={ref => this.emailInput = ref}
                                onSubmitEditing={() => {
                                    this.websiteInput && this.websiteInput.focus()
                                }}
                            />
                        </View>

                        <View className='white border-bottom2'>
                            <SingleRowInput
                                onChangeText={text => this.setState({ website: text, changed: true, errWebsite: '' })}
                                value={this.state.website}
                                maxLength={255}
                                autoCapitalize={'none'}
                                label={I18n.t('website')}
                                error={this.state.errWebsite}
                                returnKeyType={'next'}
                                ref={ref => this.websiteInput = ref}
                                onSubmitEditing={() => {
                                    this.taxCodeInput && this.taxCodeInput.focus()
                                }}
                            />
                        </View>

                        <View className='white border-bottom2'>
                            <SingleRowInput
                                onChangeText={text => this.setState({ taxCode: text, errTaxCode: '', changed: true })}
                                value={this.state.taxCode}
                                maxLength={32}
                                autoCapitalize={'none'}
                                label={I18n.t('tax_code')}
                                error={this.state.errTaxCode}
                                returnKeyType={'next'}
                                ref={ref => this.taxCodeInput = ref}
                                onSubmitEditing={() => {
                                    this.descriptionInput && this.descriptionInput.focus()
                                }}
                            />
                        </View>

                        <View className='row-all-start white'>
                            <View className='row-all-start pv16' style={styles.leftViewLarge}>
                                <Text className='s12 textBlack'>{I18n.t('description')}</Text>
                            </View>
                            <View className='flex ph16 pv16 border-left2'>
                                <TextInput
                                    style={styles.textInputDescription}
                                    multiline={true}
                                    onChangeText={text => this.setState({ description: text, changed: true })}
                                    value={this.state.description}
                                    maxLength={512}
                                    autoCapitalize={'none'}
                                    returnKeyType={'next'}
                                    ref={ref => this.descriptionInput = ref}
                                    onSubmitEditing={() => {
                                        this.bankAccountInput && this.bankAccountInput.focus()
                                    }}
                                />
                            </View>
                        </View>

                        <View className='ph24 pt16 pb8'>
                            <Text className='caption'>{I18n.t('payment_info')}</Text>
                        </View>


                        <View className='white border-bottom2'>
                            {Platform.OS == 'ios' && <InputAccessoryView nativeID={'bankAccountInputAccessoryView'}>
                                <View className='inputAccessoryView'>
                                    <TouchableOpacity onPress={() => {
                                        this.banAccountNameInput && this.banAccountNameInput.focus()
                                    }}>
                                        <Text className='inputAccessoryText'>{I18n.t('next_en')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </InputAccessoryView>}
                            <SingleRowInput
                                onChangeText={text => this.setState({ bankAccount: text, errBankAccount: '', changed: true })}
                                value={this.state.bankAccount}
                                maxLength={32}
                                autoCapitalize={'none'}
                                label={I18n.t('bank_account_number')}
                                error={this.state.errBankAccount}
                                keyboardType={'number-pad'}
                                returnKeyType={'next'}
                                ref={ref => this.bankAccountInput = ref}
                                inputAccessoryViewID={'bankAccountInputAccessoryView'}
                                onSubmitEditing={() => {
                                    this.banAccountNameInput && this.banAccountNameInput.focus()
                                }}
                            />
                        </View>

                        <View className='white border-bottom2'>
                            <SingleRowInput
                                onChangeText={text => this.setState({ bankAccountName: text, changed: true })}
                                value={this.state.bankAccountName}
                                maxLength={80}
                                autoCapitalize={'none'}
                                label={I18n.t('bank_account_name')}
                                error={this.state.errBankAccountName}
                                returnKeyType={'done'}
                                ref={ref => this.banAccountNameInput = ref}
                            />
                        </View>


                        <View className='space50' />

                    </KeyboardAwareScrollView>
                    <View className='bottom'>
                        <Button
                            onPress={this._handleSave}
                            text={I18n.t('save_change')}
                            style={{ flex: 1 }}
                            disabled={!enableButton}
                        />
                    </View>
                </View>

            </Container>
        )
    }
}

export default connect(state => ({
    merchantInfo: merchantSelector(state),
    accessToken: accessTokenSelector(state)
}), { createMerchant, getListMerchant })(StoreInfo)