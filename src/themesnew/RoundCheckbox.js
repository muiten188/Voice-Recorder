import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import View from './View'
import Text from './Text'

export default RoundCheckbox = (props) => {
    const { checked = false, text, onPress, ...passProps } = props

    return (
        <TouchableOpacity onPress={onPress} {...passProps}>
            <View className='row-start'>
                {checked ?
                    <Image source={require('~/src/image/round_checkbox.png')}
                        style={{ width: 16, height: 16, marginRight: !!text ? 10 : 0 }}
                    />
                    :
                    <View style={{
                        width: 16, height: 16,
                        borderRadius: 8,
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#979797",
                        marginRight: !!text ? 10 : 0
                    }} />
                }
                {!!text && <Text className={checked ? 'action' : 'caption'} numberOfLines={1}>{text}</Text>}
            </View>


        </TouchableOpacity>
    )

}