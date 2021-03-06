import React from "react";
import { TextInput as TextInputRN, StyleSheet } from "react-native";
import View from './View'
import Text from './Text'

export default TextInput = (props) => {
    const { label, error, style, ...passProps } = props
    return (
        <View style={style}>
            {!!label && <Text className='s13 textBlack bold'>{label}</Text>}
            <TextInputRN
                underlineColorAndroid={'transparent'}
                {...passProps}
                style={[styles.textInput, style]}
            />
            {!!error && <Text className='error pt8'>{error}</Text>}
        </View>

    )
}

const styles = StyleSheet.create({
    textInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#ededed',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 0,
        paddingRight: 0
    },
})