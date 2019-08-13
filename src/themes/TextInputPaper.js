import React, { Component } from 'react'
import { View, TextInput as TextInputRN, TouchableOpacity } from 'react-native'
import { Text, TouchableRipple, TextInput, HelperText, Caption } from 'react-native-paper'
import commonStyle, { COLORS, DEVICE_WIDTH, SURFACE_STYLES } from '~/src/themes/common'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class TextInputPaper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
    }


    render() {
        return (
            <View>
                <Caption>Email</Caption>
                <TextInput
                    label={'Email'}
                    value={this.state.text}
                    onChangeText={text => this.setState({ text })}
                    mode='outlined'
                    style={{ backgroundColor: COLORS.WHITE, paddingHorizontal: 5 }}
                    error={false}
                    render={props => (
                        <View style={[SURFACE_STYLES.rowStart]}>
                            <Icon name={'bank'} size={24} color={COLORS.BLUE} />
                            <TextInputRN
                                underlineColorAndroid='transparent'
                                {...props}
                            />
                            {!!props.value && <TouchableOpacity onPress={() => {
                                console.log('Press Right')
                                this.setState({ text: '' })
                            }}>
                                <View style={{ padding: 5 }}>
                                    <Icon name={'close'} size={20} color={COLORS.BLUE} />
                                </View>
                            </TouchableOpacity>}
                        </View>
                    )}
                />
                {/* <HelperText
                    type="error"
                    visible={!this.state.text.includes('@')}
                >
                    Email address is invalid!
                    </HelperText> */}
            </View>
        )
    }
}
