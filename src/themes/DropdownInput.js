import React, { Component } from 'react';
import { FlatList, TouchableOpacity, Image, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { COLORS } from '~/src/themes/common'
import { Container, View, Text } from '~/src/themes/ThemeComponent'

export default class DropdownInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || "",
            choose: false
        };
    }
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this._handleOnPressChoose(item.value)}>
                <View className='row-start border-bottom2 mh16'>
                    <View key={item.value + ""} className="ph32 pv16 white row-start">
                        <Text className='s14 textBlack'>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    _handleOnPressShow = () => {
        this.setState({
            choose: true
        })
    }
    _handleOnPressChoose = (value) => {
        this.setState({
            value: value,
            choose: false
        }, () => {
            const { onPressItem } = this.props
            onPressItem && onPressItem(value)
        })

    }

    _onPressOverlay = () => {
        this.setState({ choose: false })
    }

    _getDisplayValue = () => {
        const { values } = this.props
        const currentValue = values.find(item => item.value == this.state.value)
        if (!currentValue) return ''
        return currentValue.content
    }

    render() {
        const { style, popupTitle, values } = this.props
        return (
            <View style={style}>
                <Modal
                    visible={this.state.choose}
                    animationType={'none'}
                    transparent={true}
                    onRequestClose={() => this.close()}
                >
                    <TouchableWithoutFeedback onPress={this._onPressOverlay}>
                        <View style={styles.backdrop}>
                            <View style={styles.popupOuter}>
                                <View style={styles.popupContainer}>
                                    <View className='row-center pv12 border-bottom2'>
                                        <Text className='medium textBlack s16 lh24'>{popupTitle}</Text>
                                    </View>
                                    <FlatList
                                        data={values}
                                        renderItem={this.renderItem}
                                        keyExtractor={item => item.value + ""}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <TouchableOpacity onPress={this._handleOnPressShow}>
                    <View className="white row-start">
                        <Text style={{ fontSize: 12, color: COLORS.TEXT_GRAY }}>{this._getDisplayValue()}</Text>
                        {/* <Image source={imgChevronDown} style={{ width: 24, height: 24 }}></Image> */}
                        <Image source={require('~/src/image/dropdown.png')} style={{ width: 8, height: 4 }} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.BACKDROP
    },
    popupOuter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 6,
        marginHorizontal: 24,
        flex: 1,
        overflow: 'hidden'
    },
    header: {
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER_COLOR
    },
    warningIcon: {
        width: 21,
        height: 18,
        marginRight: 8
    },
    popupContent: {
        paddingHorizontal: 24,
    },
    popupTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    popupText: {
        marginTop: 47,
        marginBottom: 44,
        color: COLORS.TEXT_BACK,
        textAlign: 'center'
    },
    textHightLight: {
        color: COLORS.CERULEAN
    },
})