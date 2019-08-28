import React from 'react'
import { StyleSheet, Image } from 'react-native'
import TouchableOpacityHitSlop from './TouchableOpacityHitSlop'
import View from './View'
import Text from './Text'

export default Checkbox = (props) => {
    const { checked = false, text, onPress, ...passProps } = props

    return (
        <TouchableOpacityHitSlop onPress={onPress} {...passProps}>
            <View className='row-start'>
                {checked ?
                    <Image source={require('~/src/image/check_box.png')}
                        style={styles.checkbox}
                    />
                    :
                    <Image source={require('~/src/image/check_box_gray.png')}
                        style={styles.checkbox}
                    />
                }
                {!!text && <Text className='textGray s13' style={{ marginLeft: 12 }}>{text}</Text>}
            </View>
        </TouchableOpacityHitSlop>
    )
}

const styles = StyleSheet.create({
    checkbox: {
        width: 18, height: 18
    }
})