import React from "react";
import { TextInput, StyleSheet, Image } from "react-native";
import { COLORS } from "~/src/themes/common"
import View from './View'
import Text from './Text'

export default RoundTextInput = (props) => {
    const { error, ...passProps } = props
    const backgroundColor = !!props.value ? COLORS.WHITE : COLORS.BACKGROUND_INPUT_COLOR
    const borderColor = !!error ? COLORS.ERROR : COLORS.BORDER_COLOR
    return (
        <View>
            <TextInput
                style={[styles.input, { backgroundColor, borderColor  }]}
                underlineColorAndroid={'transparent'}
                {...passProps}
            />
            {!!error &&
                <View className='row-start pv8' style={{ marginHorizontal: 23 }}>
                    <Image source={require('~/src/image/caution.png')}
                        style={styles.errorIcon}
                    />
                    <Text className='error s13'>{error}</Text>
                </View>
            }
        </View>

    )
}

const styles = StyleSheet.create({
    input: {
        height: 46,
        borderRadius: 23,
        borderWidth: 1,
        paddingLeft: 23,
        paddingRight: 23
    },
    errorIcon: {
        width: 14,
        height: 14,
        marginRight: 4
    }
})