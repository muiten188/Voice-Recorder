import React, { PureComponent } from "react";
import { Image, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { View, Text, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import moment from 'moment'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { DEVICE_WIDTH, COLORS } from "~/src/themes/common"
import { MEETING_STATUS } from '~/src/constants'

export default class VoiceItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    _handlePressInfo = () => {
        const { onPressInfo, id, name, status, create_time, first_name, last_name, email } = this.props
        onPressInfo && onPressInfo({ id, name, create_time, first_name, last_name, email, status })
    }

    _handlePressDelete = () => {
        const { onPressDelete, id, name, localPath } = this.props
        onPressDelete && onPressDelete({ id, name, localPath })
    }


    _renderRightAction = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-120, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
                <View className='row-start'>
                    <TouchableOpacityHitSlop onPress={this._handlePressInfo}>
                        <View
                            className='row-center border-right'
                            style={{ width: 60, height: 55 }}
                        >
                            <Image source={require('~/src/image/info.png')} style={{ width: 20, height: 21 }} />
                        </View>
                    </TouchableOpacityHitSlop>
                    <TouchableOpacityHitSlop onPress={this._handlePressDelete}>
                        <View
                            className='row-center'
                            style={{ width: 60, height: 55 }}
                        >
                            <Image source={require('~/src/image/delete.png')} style={{ width: 20, height: 21 }} />
                        </View>
                    </TouchableOpacityHitSlop>
                </View>
            </Animated.View>
        );

    }

    _renderStatus = () => {
        const { status, localPath, progress } = this.props

        if (localPath) {
            return (
                <View className='row-start'>
                    <Text className='s12 green' style={{ marginRight: 4 }}>{I18n.t('uploading')}</Text>
                    <Image source={require('~/src/image/moikhoitao.png')} style={{ width: 20, height: 16 }} />
                </View>
            )
        } else if (status == MEETING_STATUS.WAITING || status == MEETING_STATUS.QUEUING) {
            return (
                <View className='row-start'>
                    <Text className='s12 orange' style={{ marginRight: 4 }}>{I18n.t('process_queuing')}</Text>
                    <Image source={require('~/src/image/duavaohangcho.png')} style={{ width: 16, height: 16 }} />
                </View>
            )
        } else if (status == MEETING_STATUS.PROCESSING) {
            return (
                <View className='row-start'>
                    <Text className='s12 blue' style={{ marginRight: 4 }}>{I18n.t('processing')} <Text className='blue s14'> ({progress}%) </Text></Text>
                    <Image source={require('~/src/image/dangcho.png')} style={{ width: 16, height: 16 }} />
                </View>
            )
        } else if (status == MEETING_STATUS.DONE) {
            return (
                <View className='row-start'>
                    <Text className='s12 green' style={{ marginRight: 4 }}>{I18n.t('process_done')}</Text>
                    <Image source={require('~/src/image/xulyxong.png')} style={{ width: 13, height: 10 }} />
                </View>
            )
        } else if (status == MEETING_STATUS.FAILED) {
            return (
                <View className='row-start'>
                    <Text className='error s12' style={{ marginRight: 4 }}>{I18n.t('process_failed')}</Text>
                    <Image source={require('~/src/image/failed.png')} style={{ width: 15, height: 15 }} />
                </View>
            )
        }
    }

    _renderProcessingItem = () => {
        const { localPath, progress = 0, create_time, name } = this.props
        return (
            <View className='pv16 border-bottom flex' style={{ paddingRight: 14 }}>
                <View className='row-start'>
                    <View className='flex'>
                        <Text className='bold s14 mb8'>{name}</Text>
                        <Text className='s13 gray flex'>{moment(create_time * 1000).format(I18n.t('full_date_time_format'))}</Text>
                    </View>
                    <View className='column-center'>
                        <Text className='blue s16 mb8 bold'>{progress}%</Text>
                        <View className='row-start'>
                            <Text className='s12 blue' style={{ marginRight: 4 }}>{I18n.t('processing')}</Text>
                            <Image source={require('~/src/image/dangcho.png')} style={{ width: 16, height: 16 }} />
                        </View>
                    </View>
                </View>
            </View>
        )

    }

    _handlePress = () => {
        const { id, name, localPath, onPress, status } = this.props
        onPress && onPress({ id, name, localPath, status })
    }

    render() {
        const { localPath, progress = 0, create_time, name, status } = this.props
        const showProgress = !!localPath
        return (
            <Swipeable
                renderRightActions={this._renderRightAction}
                rightThreshold={40}
                friction={2}
            >
                <TouchableOpacity onPress={this._handlePress}>
                    <View className='row-start'>
                        <Image source={require('~/src/image/audio.png')} style={styles.audioIcon} />
                        {(status == MEETING_STATUS.PROCESSING) ?
                            this._renderProcessingItem()
                            :
                            <View className='pv16 border-bottom flex' style={{ paddingRight: 14 }}>
                                <Text className='bold s14 mb8'>{name}</Text>
                                <View className='row-start'>
                                    <Text className='s13 gray flex'>{moment(create_time * 1000).format(I18n.t('full_date_time_format'))}</Text>
                                    {this._renderStatus()}
                                </View>
                                {showProgress && <View style={styles.progressBarFull}>
                                    <View style={[styles.progressBarActive, { width: Math.floor(styles.progressBarFull.width * progress / 100) }]} />
                                </View>}
                            </View>
                        }
                    </View>
                </TouchableOpacity>
            </Swipeable>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.BACKGROUND
    },
    audioIcon: {
        width: 22,
        height: 28,
        marginHorizontal: 16
    },
    progressBarFull: {
        width: DEVICE_WIDTH - 54,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#eeeeee',
        flexDirection: 'row',
        marginTop: 8
    },
    progressBarActive: {
        flexDirection: 'row',
        height: 3,
        borderRadius: 2,
        backgroundColor: COLORS.GREEN
    }
})