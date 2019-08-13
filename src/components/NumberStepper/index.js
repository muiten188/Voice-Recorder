import React, { Component } from 'react';
import { View } from 'react-native'
import { TouchableRipple, Text } from 'react-native-paper'
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from './styles'

export default class NumberStepper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // value: props.value || 1
        }
    }


    // static getDerivedStateFromProps(props, state){
    //     if (props.value != state.value){
    //         return {
    //             value: props.value
    //         }
    //     }
    //     return null
    // }

    _hanlePressMinus = () => {
        const { onChange, value } = this.props
        if (value >= 1) {
            // onChange && onChange(value - 1)
            onChange && onChange(-1)
        }
    }

    _hanlePressPlus = () => {
        const { onChange, value } = this.props
        // onChange && onChange(value + 1)
        onChange && onChange(1)
    }

    render() {
        return (
            <View style={SURFACE_STYLES.rowStart}>
                <View style={styles.stepperContainer}>
                    <TouchableRipple
                        onPress={() => this._hanlePressMinus()}
                        rippleColor={COLORS.RIPPLE}
                    >
                        <View style={styles.minusContainer}>
                            <Icon name={'minus'} size={22} color={COLORS.BLUE} />
                        </View>
                    </TouchableRipple>
                    <Text style={styles.textValue}>{this.props.value}</Text>
                    <TouchableRipple
                        onPress={() => this._hanlePressPlus()}
                        rippleColor={COLORS.RIPPLE}
                    >
                        <View style={styles.plusContainer}>
                            <Icon name={'plus'} size={22} color={COLORS.BLUE} />
                        </View>
                    </TouchableRipple>
                </View>
            </View>
        )
    }
}