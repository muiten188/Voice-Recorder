import React, { PureComponent } from "react";
import { Image, StyleSheet, View, StatusBar, Platform } from 'react-native'
import { Text, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent"
import { STATUSBAR_HEIGHT, TOOLBAR_HEIGHT } from '~/src/themes/common'
import { withNavigation } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient'
import { COLORS } from "./common";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


class GradientToolbar extends PureComponent {
    constructor(props) {
        super(props)
    }

    _handlePressLeft = () => {
        const { onPressLeft } = this.props
        if (onPressLeft) {
            onPressLeft()
            return
        }
        this.props.navigation.goBack()
    }

    _handlePressRight = () => {
        const { onPressRight } = this.props
        onPressRight && onPressRight()
    }

    render() {
        const { title, leftIcon = require('~/src/image/back.png'), avatar, rightIcon } = this.props
        const height = STATUSBAR_HEIGHT + TOOLBAR_HEIGHT
        return (
            <LinearGradient
                colors={['#d63e3b', '#209955']}
                style={[styles.container, { height }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={[styles.toolbar]}>
                    <TouchableOpacityHitSlop onPress={this._handlePressLeft}>
                        <Image source={leftIcon}
                            style={styles.leftIcon}
                        />
                    </TouchableOpacityHitSlop>
                    <View style={styles.titleContainer} pointerEvents={'none'}>
                        <Text className='title white'>{title}</Text>
                    </View>
                    {!!avatar &&
                        <View style={styles.rightContainer}>
                            <FastImage
                                source={avatar}
                                style={styles.avatar}
                            />
                        </View>
                    }
                    {!!rightIcon &&
                        <TouchableOpacityHitSlop onPress={this._handlePressRight} style={styles.rightContainer}>
                            <Icon name={rightIcon} color={COLORS.WHITE} size={24} />
                        </TouchableOpacityHitSlop>
                    }
                </View>
            </LinearGradient>
        )
    }
}

export default withNavigation(GradientToolbar)


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 44
    },
    titleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        // paddingTop: 13,
        // paddingBottom: 9,
        top: 0,
        bottom: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0
    },
    leftIcon: {
        width: 24,
        height: 24,
        zIndex: 100
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderColor: COLORS.WHITE,
        borderWidth: 2,
    },
    rightContainer: {
        position: 'absolute',
        right: 12
    },
    rightText: {
        fontSize: 13
    }
});