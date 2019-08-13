import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import { TouchableRipple, Button } from 'react-native-paper'
import styles from './styles';
import { formatMoney } from '~/src/utils'
import I18n from '~/src/I18n'

const KEY_TYPES = {
    NUMBER: 'NUMBER',
    EMPTY: 'EMPTY',
    CLEAR: 'CLEAR',
    PLUS_NUMBER: 'PLUS_NUMBER',
    PLUS_ZERO: 'PLUS_ZERO'
}
const KEY_WIDTH = 70
const KEY_HEIGHT = 50
const NUM_COLUMN = 4
const NUM_ROW = 5
const KEYBOARD_HEIGHT = KEY_HEIGHT * NUM_ROW + 50
const KEYBOARD_WIDTH = KEY_WIDTH * NUM_COLUMN

export default class CashierKeyboard extends React.PureComponent {

    constructor(props) {
        super(props)
        this.value = ''
        this.state = {
            value: 0
        }
        this.keyboardData = [
            {
                keyID: '+10k',
                keyValue: 10000,
                keyType: KEY_TYPES.PLUS_NUMBER
            },
            {
                keyID: '+20k',
                keyValue: 20000,
                keyType: KEY_TYPES.PLUS_NUMBER
            },
            {
                keyID: '+50k',
                keyValue: 50000,
                keyType: KEY_TYPES.PLUS_NUMBER
            },
            {
                keyID: '',
                keyValue: '',
                keyType: KEY_TYPES.EMPTY
            },
            {
                keyID: 1,
                keyValue: 1,
                keyType: KEY_TYPES.NUMBER
            },
            {
                keyID: 2,
                keyValue: 2,
                keyType: KEY_TYPES.NUMBER
            },
            {
                keyID: 3,
                keyValue: 3,
                keyType: KEY_TYPES.NUMBER
            },
            {
                keyID: '+100k',
                keyValue: 100000,
                keyType: KEY_TYPES.PLUS_NUMBER
            },
            {
                keyID: 4,
                keyValue: 4,
                keyType: KEY_TYPES.NUMBER
            },
            {
                keyID: 5,
                keyValue: 5,
                keyType: KEY_TYPES.NUMBER
            },
            {
                keyID: 6,
                keyValue: 6,
                keyType: KEY_TYPES.NUMBER
            },
            {
                keyID: '+200k',
                keyValue: 200000,
                keyType: KEY_TYPES.PLUS_NUMBER
            },
            {
                keyID: 7,
                keyValue: 7,
                keyType: KEY_TYPES.NUMBER
            },
            {
                keyID: 8,
                keyValue: 8,
                keyType: KEY_TYPES.NUMBER
            },
            {
                keyID: 9,
                keyValue: 9,
                keyType: KEY_TYPES.NUMBER
            },
            {
                keyID: '+500k',
                keyValue: 500000,
                keyType: KEY_TYPES.PLUS_NUMBER
            },
            {
                keyID: 'CLEAR',
                keyValue: 'CLEAR',
                keyType: KEY_TYPES.CLEAR
            },

            {
                keyID: 0,
                keyValue: 0,
                keyType: KEY_TYPES.NUMBER
            },
            {
                keyID: '00',
                keyValue: '00',
                keyType: KEY_TYPES.PLUS_ZERO
            },
            {
                keyID: '000',
                keyValue: '000',
                keyType: KEY_TYPES.PLUS_ZERO
            },
        ]
    }

    _handlePressKey = (item) => {
        if (item.keyType == KEY_TYPES.EMPTY) return
        if (item.keyType == KEY_TYPES.NUMBER || item.keyType == KEY_TYPES.PLUS_ZERO) {
            let newValue = this.state.value + '' + item.keyValue
            newValue = '' + (+newValue)
            this.setState({ value: newValue }, () => {
                this._onChangValue(this.state.value)
            })
        } else if (item.keyType == KEY_TYPES.CLEAR) {
            const value = '' + this.state.value
            if (value.length > 0) {
                const newValue = value.substring(0, value.length - 1)
                this.setState({ value: newValue }, () => {
                    this._onChangValue(this.state.value)
                })
            }
        } else if (item.keyType == KEY_TYPES.PLUS_NUMBER) {
            const newValue = (+this.state.value) + (+item.keyValue)
            this.setState({ value: newValue }, () => {
                this._onChangValue(this.state.value)
            })
        }
    }

    _onChangValue = (newValue) => {
        const { onChangeValue } = this.props
        onChangeValue && onChangeValue(newValue)
    }

    _renderKeyboard = ({ item, index }) => {
        const rowIndex = Math.floor(index / NUM_COLUMN)
        const borderStyle = (rowIndex == NUM_ROW - 1) ? { borderBottomWidth: 0, borderRightWidth: 1 } : { borderBottomWidth: 1, borderRightWidth: 1 }
        const keyStyle = { width: KEY_WIDTH, height: KEY_HEIGHT, borderColor: COLORS.RIPPLE, ...borderStyle }
        return (
            <TouchableRipple onPress={() => this._handlePressKey(item)}>
                <View style={[SURFACE_STYLES.rowCenter, keyStyle]}>
                    <Text style={styles.keyText}>{item.keyID}</Text>
                </View>
            </TouchableRipple>
        )
    }

    _handlePressPay = () => {
        console.log('_handlePressPay')
        const { onPressPay } = this.props
        onPressPay && onPressPay()
    }

    render() {
        console.log('KEYBOARD_WIDTH', KEYBOARD_WIDTH)
        const { enablePayBtn } = this.props
        return (
            <View style={{ height: KEYBOARD_HEIGHT }}>
                <View style={[styles.valueTextOuter]}>
                    <View style={styles.valueTextContainer}>
                        <Text style={styles.valueText}>{formatMoney(this.state.value) || 0}{I18n.t('d')}</Text>
                    </View>
                </View>
                <View style={[SURFACE_STYLES.rowAllStart, { borderTopWidth: 1, borderTopColor: COLORS.RIPPLE }]}>
                    <View style={{ width: KEYBOARD_WIDTH }}>
                        <FlatList
                            data={this.keyboardData}
                            renderItem={this._renderKeyboard}
                            keyExtractor={item => item.keyID}
                            numColumns={NUM_COLUMN}
                            bounces={false}
                            style={{ width: KEYBOARD_WIDTH, height: KEYBOARD_HEIGHT }}
                        />
                    </View>
                    <View style={{ flex: 1, padding: 10 }}>
                        <Button mode="contained" onPress={this._handlePressPay}
                            style={{borderRadius: 20}}
                            disabled={!enablePayBtn}
                        >
                            {I18n.t('pay_money')}
                        </Button>
                    </View>
                </View>
            </View>
        )
    }
}
