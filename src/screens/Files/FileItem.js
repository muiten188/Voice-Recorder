import React, { PureComponent } from "react";
import { Image, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { View, Text, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent"
import I18n from '~/src/I18n'
import moment from 'moment'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { DEVICE_WIDTH, COLORS } from "~/src/themes/common"
import { MEETING_STATUS } from '~/src/constants'

export default class FileItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    _handlePressDelete = () => {
        this.swipeable && this.swipeable.close()
        setTimeout(() => {
            const { onPressDelete, item } = this.props
            onPressDelete && onPressDelete(item)
        }, 0)
    }

    _handlePressUpload = () => {
        this.swipeable && this.swipeable.close()
        setTimeout(() => {
            const { onPressUpload, item } = this.props
            onPressUpload && onPressUpload(item)
        }, 0)
    }


    _renderRightAction = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-120, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        const opacity = dragX.interpolate({
            inputRange: [-120, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <Animated.View style={[styles.container, { transform: [{ scale }], opacity }]}>
                <View className='row-start'>
                    <TouchableOpacityHitSlop onPress={this._handlePressUpload}>
                        <View
                            className='row-center border-right'
                            style={{ width: 60, height: 55 }}
                        >
                            <Image source={require('~/src/image/import.png')} style={{ width: 20, height: 20 }} />
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


    _handlePress = () => {
        const { item, onPress } = this.props
        onPress && onPress(item)
    }

    render() {
        const { item } = this.props
        return (
            <Swipeable
                renderRightActions={this._renderRightAction}
                rightThreshold={40}
                friction={2}
                ref={ref => this.swipeable = ref}
            >
                <TouchableOpacity onPress={this._handlePress}>
                    <View className='row-start'>
                        <Image source={require('~/src/image/audio.png')} style={styles.audioIcon} />
                        <View className='pv16 border-bottom flex' style={{ paddingRight: 14 }}>
                            <Text className='bold s14'>{item}</Text>
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