import React, { Component } from 'react';
import { Text, View, FlatList } from 'react-native';
import { SURFACE_STYLES, DEVICE_WIDTH, COLORS } from '~/src/themes/common'
import styles from './styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableRipple } from 'react-native-paper';

export default class SingleTagSelector extends Component {

    constructor(props) {
        super();
        this.state = {
        }
    }

    _handlePressTag = (item) => {
        const { value, onPress } = this.props
        if (value != item.id) {
            onPress && onPress(item)
        }
    }

    _renderItem = ({ item, index }) => {
        const { data, value } = this.props
        const isSelected = value ? (value == item.id) : (data[0].id == item.id)
        const tagStyle = isSelected ? styles.tagSelected : styles.tagUnselected
        const textTagStyle = isSelected ? styles.textTagSelected : styles.textTagUnselected
        const iconColor = isSelected ? COLORS.WHITE : COLORS.TEXT_GRAY
        return (
            <TouchableRipple
                onPress={() => this._handlePressTag(item)}
                rippleColor={COLORS.RIPPLE}
            >
                <View
                    style={tagStyle}>
                    <View style={styles.iconContainer}>
                        <Icon name={item.icon} size={18} color={iconColor} />
                    </View>
                    <Text style={textTagStyle}>{item.name}</Text>
                </View>
            </TouchableRipple>
        )
    }

    render() {
        const { data, value } = this.props
        return (
            <FlatList
                extraData={value}
                data={data}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={this._renderItem}
                keyExtractor={item => item.id + ''}
            />
        );
    }
}
