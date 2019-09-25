import React from "react";
import { View, Text } from "~/src/themes/ThemeComponent"
import { TouchableOpacity } from 'react-native'
import { COLORS } from "~/src/themes/common"

export default TranscriptItem = React.memo((props) => {
    const { text, transcriptKey, shouldHightlight, onPress } = props

    _handlePress = () => {
        onPress && onPress({ transcriptKey, text })
    }
    return (
        <TouchableOpacity onPress={_handlePress}>
            <View className='row-center'>
                <Text
                    style={{
                        color: shouldHightlight ? '#55eaa4' : COLORS.WHITE54,
                        fontWeight: shouldHightlight ? 'bold' : 'normal',
                        fontSize: 15,
                        lineHeight: 24,
                        textAlign: 'center',
                        letterSpacing: 0
                    }}>
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    )
})
