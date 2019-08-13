import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { COLORS } from './common'

export default Container = (props) => {
    const { children, blue } = props
    const backgroundColor = blue ? COLORS.CERULEAN : COLORS.WHITE
    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor }]}>
            <StatusBar
                barStyle={blue ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundColor}
            />
            {children}
        </SafeAreaView>
    )
}

