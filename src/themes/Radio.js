import React, { PureComponent } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import Text from '~/src/themes/Text'
import commonStyle, { SURFACE_STYLES } from '~/src/themes/common'
import { COLORS } from '~/src/themes/common'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


export default class Radio extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {

        const { label, checked = false, onPress } = this.props
        const iconName = checked ? 'radiobox-marked' : 'radiobox-blank'
        const iconColor = checked ? COLORS.BLUE : 'rgba(0,0,0,0.54)'
        return (
            <TouchableOpacity onPress={onPress} >
                <View style={SURFACE_STYLES.rowStart}>
                    <View style={{ paddingRight: 5 }}>
                        <Icon name={iconName} size={20} color={iconColor}></Icon>
                    </View>
                    {!!label && <Text style={{ color: 'rgba(0,0,0,0.85)' }}>{label}</Text>}
                </View>
            </TouchableOpacity >
        )
    }
}