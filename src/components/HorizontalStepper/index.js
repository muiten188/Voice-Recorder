import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { COLORS, DEVICE_WIDTH, SURFACE_STYLES, TEXT_STYLES } from '~/src/themes/common'
import styles from './styles'
import Dash from 'react-native-dash'

export default class HorizontalStepper extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    _renderItem = (item, index) => {
        const { currentStep, stepData } = this.props
        const iconColor = (index <= currentStep) ? COLORS.BLUE : COLORS.DARK_GRAY
        const lineColor = (index < currentStep) ? COLORS.BLUE : COLORS.DARK_GRAY
        return (
            <View style={SURFACE_STYLES.rowStart} key={item.icon}>
                <View style={SURFACE_STYLES.columnCenter}>
                    <Icon name={item.icon} size={40} color={iconColor} />
                    <Text style={{color: iconColor}}>{item.text}</Text>
                </View>
                {!!(index < stepData.length - 1) && <Dash style={{ width: 40, height: 1, flexDirection: 'row', marginLeft: 5, marginRight: 5, top: -10 }} dashColor={lineColor} />}
            </View>
        )
    }

    render() {
        console.log('Active Color', this.props)
        return (
            <View style={SURFACE_STYLES.rowCenter}>
                {this.props.stepData.map(this._renderItem)}
            </View>
        )
    }
}
