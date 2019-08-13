import React, { PureComponent } from 'react'
import { View, FlatList, Text, Modal, TouchableWithoutFeedback, } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { COLORS, SURFACE_STYLES } from '~/src/themes/common'
import I18n from '~/src/I18n'
import { toElevation } from '~/src/utils'

export default class ContextMenu extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            visible: props.visible || false
        }
    }

    _handlePressMenuItem = (item) => {
        this.setState({
            visible: false
        }, () => {
            const { onPress } = this.props
            onPress && onPress(item)
        })
    }

    open = () => {
        this.setState({ visible: true })
    }

    _renderMenuItem = ({ item, index }) => {
        return (
            <TouchableRipple
                onPress={() => this._handlePressMenuItem(item)}
                rippleColor={COLORS.RIPPLE}
            >
                <View style={{ padding: 16 }}>
                    <Text style={{ color: COLORS.TEXT_BLACK }}>{item.name}</Text>
                </View>
            </TouchableRipple>
        )

    }

    render = () => {
        const { data, style } = this.props
        return (
            <Modal
                animationType='none'
                visible={this.state.visible}
                onRequestClose={() => this.setState({ visible: false })}
                transparent={true}
            >
                <TouchableWithoutFeedback
                    onPress={() => this.setState({ visible: false })}
                >
                    <View style={SURFACE_STYLES.flex}>
                        <View
                            style={[
                                {
                                    position: "absolute",
                                    backgroundColor: COLORS.WHITE
                                },
                                toElevation(2),
                                style
                            ]}
                        >
                            <FlatList
                                data={data}
                                renderItem={this._renderMenuItem}
                                keyExtractor={item => item.id + ''}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

