import React, { PureComponent } from 'react'
import { Image, StyleSheet } from 'react-native'
import { Text, View } from '~/src/themesnew/ThemeComponent'
import { COLORS } from '~/src/themesnew/common'
import { generateHighlightText } from '~/src/utils'
import { textStyles } from '~/src/themesnew/Text'
import * as Animatable from 'react-native-animatable'

export default class SuccessToast extends PureComponent {

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
            this.animatedView && this.animatedView.slideInUp(1000)
            setTimeout(() => {
                this.animatedView && this.animatedView.slideOutDown(1000)
                    .then(() => {
                        this.setState({ visible: false })
                    })
            }, 3000)
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
                animation={'slideInUp'}
                ref={ref => this.animatedView = ref}
            >
                <View className='row-start white ph24 pv18'>
                    <Image
                        source={require('~/src/image/round_green_checked.png')}
                        style={styles.successIcon}
                    />
                    <Text className='flex'>{generateHighlightText(text, styles.normalText, styles.highlightText)}</Text>
                </View>
            </Animatable.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTopWidth: 1,
        borderTopColor: COLORS.BORDER_COLOR2
    },
    successIcon: {
        width: 24,
        height: 24,
        marginRight: 12
    },
    normalText: {
        ...textStyles.default,
        ...textStyles.gray
    },
    highlightText: {
        ...textStyles.default,
        ...textStyles.bold,
        ...textStyles.cerulean
    },
})