import React, { Component } from "react";
import { Image, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { View, Text, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import moment from 'moment'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { COLORS } from "~/src/themes/common"
import { MEETING_STATUS } from '~/src/constants'

export default class VoiceItem extends Component {
    constructor(props) {
        super(props);
    }

    _renderRightAction = (progress, dragX) => {
        const { onPressInfo, onPressDelete } = this.props
        const scale = dragX.interpolate({
            inputRange: [-120, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
                <View className='row-start'>
                    <TouchableOpacityHitSlop onPress={onPressInfo}>
                        <View
                            className='row-center border-right'
                            style={{ width: 60, height: 55 }}
                        >
                            <Image source={require('~/src/image/info.png')} style={{ width: 20, height: 21 }} />
                        </View>
                    </TouchableOpacityHitSlop>
                    <TouchableOpacityHitSlop onPress={onPressDelete}>
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
        const { data } = this.props

        // else if (data.status == MEETING_STATUS.UPLOADING) {
        //     return (
        //         <View className='row-start'>
        //             <Text className='s12 orange' style={{ marginRight: 4 }}>{I18n.t('processing')}</Text>
        //             <Image source={require('~/src/image/dangxuly.png')} style={{ width: 16, height: 16 }} />
        //         </View>
        //     )
        // }

        if (data.status == MEETING_STATUS.INITIAL) {
            return (
                <View className='row-start'>
                    <Text className='s12 green' style={{ marginRight: 4 }}>{I18n.t('process_init')}</Text>
                    <Image source={require('~/src/image/moikhoitao.png')} style={{ width: 20, height: 16 }} />
                </View>
            )
        } else if (data.status == MEETING_STATUS.WAITING || data.status == MEETING_STATUS.QUEUING) {
            return (
                <View className='row-start'>
                    <Text className='s12 orange' style={{ marginRight: 4 }}>{I18n.t('process_queuing')}</Text>
                    <Image source={require('~/src/image/duavaohangcho.png')} style={{ width: 16, height: 16 }} />
                </View>
            )
        } else if (data.status == MEETING_STATUS.PROCESSING) {
            return (
                <View className='row-start'>
                    <Text className='s12 blue' style={{ marginRight: 4 }}>{I18n.t('processing')}</Text>
                    <Image source={require('~/src/image/dangcho.png')} style={{ width: 16, height: 16 }} />
                </View>
            )
        } else if (data.status == MEETING_STATUS.DONE) {
            return (
                <View className='row-start'>
                    <Text className='s12 green' style={{ marginRight: 4 }}>{I18n.t('process_done')}</Text>
                    <Image source={require('~/src/image/xulyxong.png')} style={{ width: 13, height: 10 }} />
                </View>
            )
        } else if (data.status == MEETING_STATUS.FAILED) {
            return (
                <View className='row-start'>
                    <Text className='error s12' style={{ marginRight: 4 }}>{I18n.t('process_failed')}</Text>
                    <Image source={require('~/src/image/failed.png')} style={{ width: 15, height: 15 }} />
                </View>
            )
        }
    }

    _handlePress = () => {
        const { data, onPress } = this.props
        onPress && onPress(data)
    }

    render() {
        const { data } = this.props
        return (
            <Swipeable
                renderRightActions={this._renderRightAction}
                rightThreshold={40}
                friction={2}
            >
                <TouchableOpacity onPress={this._handlePress}>
                    <View className='row-start'>
                        <Image source={require('~/src/image/audio.png')} style={{ width: 22, height: 28, marginHorizontal: 16 }} />
                        <View className='pv16 border-bottom flex' style={{ paddingRight: 14 }}>
                            <Text className='bold s14 mb8'>{data.name}</Text>
                            <View className='row-start'>
                                <Text className='s13 gray flex'>{moment(data.create_time * 1000).format(I18n.t('full_date_time_format'))}</Text>
                                {this._renderStatus()}
                            </View>

                        </View>
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
    }
})