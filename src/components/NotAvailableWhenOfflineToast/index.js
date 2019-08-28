import React, { PureComponent } from 'react'
import { Image, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { Text, View } from '~/src/themes/ThemeComponent'
import * as Animatable from 'react-native-animatable'
import { COLORS } from '~/src/themes/common'
import I18n from '~/src/I18n'

export default class NotAvailableWhenOfflineToast extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }

    show = (text) => {
        this.setState({
            visible: true,
            text
        }, () => {
            this.animatedView && this.animatedView.slideInDown(1000)
            setTimeout(() => {
                this.animatedView && this.animatedView.slideOutUp(1000)
                    .then(() => {
                        this.setState({ visible: false })
                    })
            }, 3000)
        })
    }

    _handlePressClose = () => {
        this.animatedView && this.animatedView.slideOutUp(1000)
            .then(() => {
                this.setState({ visible: false })
            })
    }


    render() {
        const { text = '' } = this.state
        if (!this.state.visible) return <View />
        return (
            <Animatable.View style={styles.container}
                useNativeDriver={true}
                easing={'ease-in-out'}
                duration={1500}
                animation={'slideInDown'}
                ref={ref => this.animatedView = ref}
            >
                <View className='row-start ph24 pv18'>
                    <Image
                        source={require('~/src/image/no_internet_red.png')}
                        style={styles.errorIcon}
                    />
                    <Text className='flex textBlack' numberOfLines={2}>{I18n.t('feature_not_available_when_offline')}</Text>
                    <TouchableOpacity onPress={this._handlePressClose}>
                        <Image
                            source={require('~/src/image/close_white.png')}
                            style={styles.closeIcon}
                        />
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: COLORS.LIGHT_RED,
        paddingTop: Platform.OS == 'ios' ? 20 : 0,
    },
    errorIcon: {
        width: 24,
        height: 24,
        marginRight: 12
    },
    closeIcon: {
        width: 20,
        height: 20,
        marginLeft: 16
    },
})