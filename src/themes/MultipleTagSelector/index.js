import React from 'react'
import { COLORS } from '~/src/themes/common'
import { Caption } from '~/src/themes/Text'
import { View, TouchableOpacity, StyleSheet } from 'react-native'

export default MultipleTagSelector = (props) => {
    const { data, values, onChange, style, tagStyle, ...passProps } = props

    const _handlePressItem = (item) => {
        console.log('Pressing Item', item)
        let newValues = [...values]
        const currentIndex = newValues.findIndex(it => it == item.id)
        if (currentIndex < 0) {
            newValues.push(item.id)
        } else {
            newValues.splice(currentIndex, 1)
        }
        onChange && onChange(newValues)
    }

    const _renderTagItem = (item, index) => {
        const isSelected = !!(values.find(it => it == item.id))
        const tagViewColor = isSelected ? COLORS.CERULEAN : 'rgba(0, 0, 0, 0.25)'
        const textColor = isSelected ? COLORS.CERULEAN : COLORS.TEXT_GRAY

        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.tagItem, { borderColor: tagViewColor }, tagStyle]}
                onPress={() => _handlePressItem(item)}
            >
                <Caption style={{ color: textColor }}>{item.name}</Caption>
            </TouchableOpacity>
        )
    }
    return (
        <View {...passProps} style={[styles.container, style]}>
            {!!data && data.length > 0 && data.map(_renderTagItem)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
    },
    tagItem: {
        paddingHorizontal: 16,
        paddingVertical: 13,
        borderRadius: 6,
        borderWidth: 1,
        marginRight: 8, marginBottom: 8,
    }
});