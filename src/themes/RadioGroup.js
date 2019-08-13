import React, { PureComponent } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import Text from '~/src/themes/Text'
import commonStyle, { SURFACE_STYLES } from '~/src/themes/common'
import { COLORS } from '~/src/themes/common'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Radio from '~/src/themes/Radio'
import { Caption } from 'react-native-paper'


export default class RadioGroup extends PureComponent {
    constructor(props) {
        super(props)
        // value props is id only
        const { options, value } = props
        const selected = (options && options.length > 0) ?
            (value ? options.find(item => item.id == value) : options[0]) : -1
        this.state = {
            selected
        }
    }


    _handlePressRadio = (item) => {
        console.log('Pressing Radio', item)
        if (item.id != this.state.selected.id) {
            this.setState({ selected: item }, () => {
                const { onSelect } = this.props
                onSelect && onSelect(item)
            })
        }
    }

    getSelected = () => {
        return this.state.selected
    }

    render() {
        const { options, label } = this.props
        return (
            <View>
                {!!label && <Caption style={{ color: 'rgba(0, 0, 0, 0.54)' }}>{label}</Caption>}
                {options.map((item, index) => (
                    <Radio label={item.title} checked={item.id == this.state.selected.id}
                        onPress={() => this._handlePressRadio(item)}
                        key={item.id}
                    />
                ))}
            </View>
        )
    }
}