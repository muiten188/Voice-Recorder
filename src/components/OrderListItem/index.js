import React, { PureComponent, Component } from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { formatMoney, chainParse, } from '~/src/utils'
import I18n from '~/src/I18n'
import { Text, TextBold, View, Caption } from '~/src/themes/ThemeComponent'
import { COLORS } from '~/src/themes/common'
import moment from 'moment'

export default OrderListItem = (props) => {
    const { data, onPress, showDelete, onDelete } = props
    const orderId = chainParse(data, ['order', 'id'])
    const orderCode = chainParse(data, ['order', 'orderCode'])
    const orderStatus = chainParse(data, ['order', 'status'])
    const createdAt = chainParse(data, ['order', 'createdAt'])
    const paidAmount = chainParse(data, ['order', 'paidAmount'])
    const isSyncData = chainParse(data, ['order', 'isSync'])
    const isSync = !(isSyncData == 0)
    const tableDisplayName = chainParse(data, ['order', 'tableDisplayName'])
    const creatorName = chainParse(data, ['order', 'creatorName']) || ''
    const isWaitingOrder = orderStatus == 0 || orderStatus == 1
    const textTime = tableDisplayName ?
        `${moment(createdAt * 1000).format(I18n.t('full_time_format'))} - ${tableDisplayName}`
        : moment(createdAt * 1000).format(I18n.t('full_time_format'))

    _handlePressOrder = () => {
        onPress && onPress(data)
    }

    return (
        <TouchableOpacity onPress={_handlePressOrder}>
            <View className='white ph24 pt16 pb12 border-bottom2'>

                <View className='row-start'>
                    {!!showDelete &&
                        <TouchableOpacity onPress={() => onDelete && onDelete({ orderId, orderCode })}>
                            <Image
                                source={require('~/src/image/delete_red.png')}
                                style={{ width: 24, height: 24, marginRight: 24 }}
                            />
                        </TouchableOpacity>
                    }
                    {!isSync &&
                        <Image
                            source={require('~/src/image/no_internet_gray.png')}
                            style={{ width: 24, height: 24, marginRight: 9 }}
                        />
                    }

                    <View className='flex'>
                        <View className='row-start'>
                            {/* <View className='row-start flex'> */}
                            <Text className='flex'>
                                <Text className='bold'>{I18n.t('title_order')}</Text>
                                <Text className='bold' style={{
                                    color: isWaitingOrder ? 'rgb(127, 127, 127)' : COLORS.CERULEAN,
                                    letterSpacing: -0.24,
                                }}> {orderCode}</Text>
                            </Text>
                            {/* </View> */}
                            <Text className='bold' style={{
                                color: isWaitingOrder ? COLORS.TEXT_GRAY : COLORS.GREENISHTEAL,
                                letterSpacing: -0.24,
                                marginLeft: 8
                            }}>{formatMoney(paidAmount)}</Text>
                        </View>
                        <View className='row-start' style={{ marginTop: 4 }}>
                            <Text className='caption flex lh16' numberOfLines={1}>{textTime}</Text>
                            {!!creatorName && <Text className='lightGray s12 lh16' numberOfLines={1} style={{ marginLeft: 16 }}>{creatorName}</Text>}
                        </View>

                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}