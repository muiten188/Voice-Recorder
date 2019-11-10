import React, { Component } from 'react'
import { FlatList, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { COLORS, DEVICE_HEIGHT } from '~/src/themes/common'
import { View, Text, SmallButton } from '~/src/themes/ThemeComponent'
import I18n from '~/src/I18n'

export default class DropdownInput extends Component {
    constructor(props) {
        super(props)
    }
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => this._handleSelectItem(item)}>
                <View className='row-start border-bottom2 mh16'>
                    <View key={item.value + ""} className="ph32 pv16 white row-start">
                        <Text className='s14 textBlack'>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _handleSelectItem = (item) => {
        const { onSelect } = this.props
        onSelect && onSelect(item)
    }

    _onPressOverlay = () => {
        const { onPressOverlay } = this.props
        onPressOverlay && onPressOverlay()
    }

    _onRequestClose = () => {
        const { onRequestClose } = this.props
        onRequestClose && onRequestClose()
    }

    _handlePressAgree = () => {
        const { onAgree } = this.props
        onAgree && onAgree()
    }

    render() {
        const { popupTitle, values, visible, showButton } = this.props
        return (
            <Modal
                visible={visible}
                animationType={'none'}
                transparent={true}
                onRequestClose={this._onRequestClose}
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
                                {showButton && <View className='row-center mt8 mb10 ph24'>
                                    <SmallButton
                                        text={I18n.t('agree')}
                                        onPress={this._handlePressAgree}
                                        style={{ flex: 1 }}
                                    />
                                </View>}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
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
        overflow: 'hidden',
        maxHeight: DEVICE_HEIGHT - 100
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