import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS } from './common'
import View from './View'

export default Switch = (props) => {
    const { enable, onPress } = props
    const backgroundColor = enable ? COLORS.CERULEAN : COLORS.BORDER_COLOR
    _handlePress = () => {
        onPress && onPress()
    }

    return (
        <TouchableOpacity onPress={_handlePress}>
            <View className={enable ? 'row-end' : 'row-start'}
                style={[styles.container, { backgroundColor }]}
            >
                <View style={styles.indicator} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 64,
        height: 32,
        borderRadius: 16,
        padding: 4
    },
    indicator: {
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: COLORS.WHITE
    }
})

