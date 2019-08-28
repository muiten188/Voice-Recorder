import React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import View from './View'
import TextInput from './TextInputBase'
import { COLORS } from './common'


export default SearchBox = (props) => {
    const { keyword, onChangeKeyword, onClear, ...passProps } = props
    return (
        <View className='row-start flex ph8' style={styles.textInputContainer}>
            <Image source={require('~/src/image/search.png')} style={styles.searchIcon} />
            <TextInput
                placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
                onChangeText={onChangeKeyword}
                value={keyword}
                style={styles.textInput}
                underlineColorAndroid={'transparent'}
                {...passProps}
            />

            {!!keyword &&
                <TouchableOpacity onPress={onClear}>
                    <Image source={require('~/src/image/imgClear.png')} style={styles.clearIcon} />
                </TouchableOpacity>
            }
        </View>
    )

}


const styles = StyleSheet.create({
    searchIcon: {
        width: 24, height: 24
    },
    clearIcon: {
        width: 20, height: 20
    },
    textInput: {
        marginHorizontal: 8,
        fontSize: 14,
        flex: 1,
        paddingTop: 0,
        paddingBottom: 0,
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
    textInputContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        height: 32,
        borderRadius: 8
    }
})