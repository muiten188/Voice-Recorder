import React, { Component } from 'react';
import { View } from 'react-native'
import { TouchableRipple, Text } from 'react-native-paper'
import { SURFACE_STYLES, COLORS } from '~/src/themes/common'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import I18n from '~/src/I18n'
import moment from 'moment'


export default class VerticalStepper extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { stepperData, currentStep } = this.props
        return (
            <View style={[SURFACE_STYLES.columnAlignStart, SURFACE_STYLES.fullWidth]}>
                {stepperData.map((item, index) => {
                    return (
                        <View style={[SURFACE_STYLES.columnAlignStart, SURFACE_STYLES.fullWidth]} key={item.name}>
                            <View style={[SURFACE_STYLES.rowSpacebetween, SURFACE_STYLES.fullWidth]} >
                                <View style={[SURFACE_STYLES.rowStart]}>
                                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: index <= currentStep ? COLORS.BLUE : COLORS.GRAY, marginRight: 10 }} />
                                    <Text style={{ fontSize: 14, color: index <= currentStep ? COLORS.BLACK : COLORS.GRAY, lineHeight: 24 }}>{item.name}</Text>
                                </View>
                                {!!item.time && <Text style={{ fontSize: 12, color: 'rgba(0,0 ,0 ,0.5)' }}>{item.time}</Text>}
                            </View>
                            {(index < stepperData.length - 1) &&
                                <View style={{ marginTop: 2, marginBottom: 2, height: 15, width: 1, backgroundColor: COLORS.GRAY, left: 11 }} />
                            }
                        </View>
                    )
                })}
            </View>
        )
    }
}