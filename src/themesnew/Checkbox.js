import React from 'react'
import { COLORS } from '~/src/themesnew/common'
import { View, TouchableOpacity, Image } from 'react-native'

export default Checkbox = (props) => {
    const { checked = false, onPress, ...passProps } = props

    return (
        <TouchableOpacity onPress={onPress} {...passProps}>
            {checked ?
                <Image source={require('~/src/image/checked_checkbox.png')}
                    styled={{ width: 16, height: 16 }}
                />
                :
                <View style={{
                    width: 16, height: 16,
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#979797"
                }} />
            }

        </TouchableOpacity>
    )

}