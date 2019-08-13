import React, { Component } from 'react';
import { View, Image, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Text, Caption, TouchableRipple } from 'react-native-paper'
import { COLORS } from '~/src/themes/common'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import I18n from '~/src/I18n'
import ImagePicker from 'react-native-image-picker'
import styles from './styles'
import NavigationUtils from '~/src/utils/NavigationUtils'
import FastImage from 'react-native-fast-image';
const MAX_IMAGE = 1

export default class StoreInfo extends Component {
    static navigationOptions = {
        headerTitle: I18n.t('store_info'),
    }

    constructor(props) {
        super(props)
        this.state = {
            images: props.listImage || []
        }
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (prevState.images !== nextProps.listImage) {
    //         return {
    //             images: nextProps.listImage
    //         };
    //     }
    //     return null;
    // }


    _handleAddPhoto = () => {
        
        if (this.state.images.length >= MAX_IMAGE) {
            NavigationUtils.navigate('Toast', {
                text: I18n.t('choose_max_1_image')
            })
            return
        }
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
                const findIndex = this.state.images.findIndex(item => item.uri == response.uri)
                if (findIndex >= 0) {
                    NavigationUtils.navigate('Toast', {
                        text: I18n.t('image_exist')
                    })
                    return
                }
                const { onUpdateImage, imageKey } = this.props
                this.setState({
                    images: [...this.state.images, {
                        id: '',
                        uri: response.uri
                    }]
                }, () => {
                    onUpdateImage && onUpdateImage(this.state.images, imageKey)
                })
            }
        })
    }

    _clear = (item) => {
        let cloneImages = [...this.state.images]
        let index = cloneImages.findIndex(image => image.uri == item.uri)
        if (index > -1) {
            const { onUpdateImage, imageKey } = this.props
            cloneImages.splice(index, 1)
            this.setState({
                images: [...cloneImages]
            }, () => {
                onUpdateImage && onUpdateImage(this.state.images, imageKey)
            })
        }
    }

    _renderImage = (item) => {
        const { editable = true } = this.props
        return (
            <View style={styles.imageItem} key={item.uri}>
                <Image style={styles.image} source={{ uri: item.uri }} />
                {!!editable && <TouchableWithoutFeedback onPress={() => this._clear(item)}>
                    <View style={styles.closeContainer}>
                        <Icon name='close' style={styles.close} />
                    </View>
                </TouchableWithoutFeedback>}
            </View>
        )
    }

    getImages = () => {
        return this.state.images
    }

    getStorageImage = () => {
        // return this.state.images.filter(item => (!item.startsWith('http') && !item.startsWith('https')))
        return this.state.images.filter(item => !item.id)
    }

    getServerImage = () => {
        // return this.state.images.filter(item => (item.startsWith('http') || item.startsWith('https')))
        return this.state.images.filter(item => !!item.id)
    }


    render() {
        const { label, editable = true } = this.props
        return (
            <View>
                <Caption style={{ color: 'rgba(0,0,0,0.54)' }}>{label}</Caption>
                <ScrollView horizontal={true}>
                    {this.state.images.map(item => this._renderImage(item))}
                    {!!editable && <TouchableRipple onPress={this._handleAddPhoto}
                        rippleColor={COLORS.RIPPLE}
                    >
                        <View style={styles.addImage}>
                            <Icon name='plus' size={24} color={COLORS.TEXT_GRAY} />
                            <Text style={{ color: COLORS.TEXT_GRAY }}>Thêm ảnh</Text>
                        </View>
                    </TouchableRipple>}
                </ScrollView>
            </View>
        );
    }
}