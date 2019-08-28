import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { COLORS } from './common'

export default Container = (props) => {
    const { children } = props
    const backgroundColor = COLORS.WHITE
    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor }]}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={backgroundColor}
            />
            {children}
        </SafeAreaView>
    )
}

