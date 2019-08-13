import React, { PureComponent } from 'react'
import { View, FlatList, Text } from 'react-native'
import commonStyle, { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { TouchableRipple } from 'react-native-paper'
import styles from './styles'

export default class ChipFilter extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            selected: props.selected || (props.data && props.data[0] ? props.data[0].id : 0),
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.selected && nextProps && nextProps.data && nextProps.data[0]) {
            return {
                selected: nextProps.data[0].id
            }
        }
        return null
    }

    _handlePress = (item) => {
        if (this.state.selected != item.id) {
            this.setState({ selected: item.id }, () => {
                const { onChange } = this.props
                onChange && onChange(item)
            })
        }
    }

    _renderItem = ({ item, index }) => {
        const isSelected = (item.id == this.state.selected)
        const borderColor = isSelected ? COLORS.BLUE : COLORS.RIPPLE
        const color = isSelected ? COLORS.BLUE : 'rgba(0, 0, 0, 0.85)'
        return (
            <View style={styles.chipContainer}>
                <TouchableRipple style={[styles.chipItem, { borderColor }]} rippleColor={COLORS.RIPPLE} onPress={() => this._handlePress(item)}>
                    <Text style={{ color }}>{item.name}</Text>
                </TouchableRipple>
            </View>
        )
    }

    render() {
        const { data } = this.props
        return (
            <FlatList
                extraData={this.state.selected}
                data={data}
                keyExtractor={(item, index) => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={this._renderItem}
            />
        )
    }
}