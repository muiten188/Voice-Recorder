import React, { } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { formatMoney, getPrice } from '~/src/utils'
import I18n from '~/src/I18n'
import Image from 'react-native-fast-image'
import { Stepper, Text, Caption, View } from '~/src/themesnew/ThemeComponent'
import { SURFACE_STYLES, COLORS } from '~/src/themesnew/common'

export default ProductItem = (props) => {
    const { data, isLastItem = false, onPress,
        forwardArrow = false,
        showDelete = false, onPressDelete, // delete product
        showCheckbox = false, isSelected = false, // for product with checkbox
        showStepper = false, number = 0, onPlus, onMinus, onChangeNumber, editable = true, // for product with stepper
        style, innerStyle,
        index
    } = props
    // data.productAvatar
    const avatarData = data && data.listProductMedia && data.listProductMedia[0] ? data.listProductMedia[0].thumbnailUrl : (data.productAvatar || '')
    const productAvatar = avatarData ? { uri: avatarData } : require('~/src/image/product_placeholder.png')
    const price = getPrice(data)
    const originPrice = data.price
    const status = data.status || 0

    const _handlePress = () => {
        onPress && onPress(data, index)
    }

    const _handlePressDelete = () => {
        onPressDelete && onPressDelete(data, index)
    }

    const _handlePlus = () => {
        onPlus && onPlus(data, index)
    }

    const _handleMinus = () => {
        onMinus && onMinus(data, index)
    }

    const _handleChangeNumber = (number) => {
        onChangeNumber && onChangeNumber(data, number)
    }

    return (
        <TouchableOpacity onPress={_handlePress}>
            <View className='row-start white' style={[{ paddingLeft: 24 }, style]}>
                <View className='row-start'
                    style={[{
                        borderBottomColor: isLastItem ? 'transparent' : COLORS.BORDER_COLOR,
                        borderBottomWidth: isLastItem ? 0 : 1,
                        opacity: status == -2 ? 0.5 : 1
                    }, innerStyle]}
                >
                    {showDelete ?
                        <TouchableOpacity onPress={_handlePressDelete}>
                            <Image
                                source={require('~/src/image/delete_red.png')}
                                style={styles.deleteIcon}
                            />
                        </TouchableOpacity>
                        :
                        showCheckbox ?
                            <Checkbox checked={isSelected} style={styles.checkbox} onPress={_handlePress} />
                            :
                            <View />
                    }
                    <View className='row-start pv16 flex' style={{ paddingRight: 24 }}>
                        <View style={[SURFACE_STYLES.rowStart, SURFACE_STYLES.flex]}>
                            <Image
                                source={productAvatar}
                                style={styles.productAvatar}
                            />
                            <View className='flex'>
                                <Text className='bold flex' style={styles.productName}>{data.productName}</Text>
                                <View className='row-start'>
                                    <Text className='s12 gray lh16'>{formatMoney(price)}{I18n.t('d')}</Text>
                                    {!!data.promotionPrice && <Text className='s12 lightGray lh16 line-through' style={{ marginLeft: 12 }}>{formatMoney(originPrice)}{I18n.t('d')}</Text>}
                                </View>
                            </View>
                        </View>
                        {forwardArrow && <Image
                            source={require('~/src/image/chevron_right_gray.png')}
                            style={styles.forwardArrow}
                        />}
                        {showStepper && (
                            editable ?
                                <Stepper
                                    onPlus={_handlePlus}
                                    onMinus={_handleMinus}
                                    value={number}
                                    onChangeNumber={_handleChangeNumber}
                                     />
                                :
                                <Text className='s20 textBlack bold'>{number}</Text>
                        )

                        }

                    </View>
                </View>

            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    productAvatar: {
        width: 48,
        height: 48,
        borderRadius: 5.6,
        marginRight: 16
    },
    productName: {
        marginBottom: 4
    },
    price: {
        fontSize: 12,
        color: COLORS.TEXT_GRAY,
        lineHeight: 20
    },
    forwardArrow: {
        width: 6,
        height: 10,
        backgroundColor: COLORS.WHITE,
        marginLeft: 8
    },
    deleteIcon: {
        width: 24,
        height: 24,
        marginRight: 24
    },
    checkbox: {
        marginRight: 24
    }
})