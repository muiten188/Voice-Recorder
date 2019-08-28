import React, { useState, useEffect } from 'react'
import { COLORS } from '~/src/themes/common'
import View from './View'
import Text from './Text'
import TextInput from './TextInputBase'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'


export default Stepper = (props) => {
    const { value = '', onPlus, onMinus, onChangeNumber } = props
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value)
    }, [value])

    _getValue = () => {
        if (!inputValue) return ''
        return (inputValue + '').replace(/\D/g, "")
    }

    return (
        <View className='row-start'>
            {!!value &&
                <View className='row-start'>
                    <TouchableOpacity onPress={onMinus}>
                        <Image source={require('~/src/image/minus_round.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => setInputValue(text)}
                        value={_getValue()}
                        onBlur={() => onChangeNumber(inputValue)}
                        maxLength={2}
                        keyboardType={'number-pad'}
                        returnKeyType={'done'}
                    />
                </View>
            }
            <TouchableOpacity onPress={onPlus}>
                <Image source={require('~/src/image/plus_round_blue.png')} style={styles.icon} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    value: {
        fontSize: 20,
        letterSpacing: -0.34,
        color: COLORS.TEXT_BLACK,
        paddingHorizontal: 16
    },
    icon: {
        width: 24,
        height: 24
    },
    textInput: {
        fontSize: 20,
        fontWeight: "bold",
        letterSpacing: -0.34,
        height: 32,
        paddingHorizontal: 11,
        borderWidth: 1,
        borderColor: COLORS.BORDER_COLOR,
        borderRadius: 6,
        textAlign: 'center',
        marginHorizontal: 12,
        padding: 0
    },
})