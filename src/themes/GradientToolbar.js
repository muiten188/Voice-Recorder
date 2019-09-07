import React, { PureComponent } from "react";
import { Image, StyleSheet, View, StatusBar, Platform } from 'react-native'
import { Text, TouchableOpacityHitSlop } from "~/src/themes/ThemeComponent"
import { COLORS } from '~/src/themes/common'
import { withNavigation } from 'react-navigation'
import imgBackWhite from '~/src/image/back.png'
import LinearGradient from 'react-native-linear-gradient'
const TOOLBAR_HEIGHT = 44
import { isIphoneX } from 'react-native-iphone-x-helper'

class GradientToolbar extends PureComponent {
    constructor(props) {
        super(props)
    }

    _handlePressBack = () => {
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
        const { title } = this.props
        const statusbarHeight = Platform.OS == 'android' ? StatusBar.currentHeight : (isIphoneX() ? 44 : 20)
        const height = statusbarHeight + TOOLBAR_HEIGHT
        return (
            <LinearGradient
                colors={['#d63e3b', '#209955']}
                style={[styles.container, { height }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={[styles.toolbar]}>
                    <TouchableOpacityHitSlop onPress={this._handlePressBack}>
                        <Image source={imgBackWhite}
                            style={styles.backImage}
                        />
                    </TouchableOpacityHitSlop>
                    <View style={styles.titleContainer} pointerEvents={'none'}>
                        <Text className='title white'>{title}</Text>
                    </View>
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
    backImage: {
        width: 46,
        height: 46,
        zIndex: 100
    },
    rightContainer: {
        position: 'absolute',
        right: 16
    },
    rightText: {
        fontSize: 13
    }
});