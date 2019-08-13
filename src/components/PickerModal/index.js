import React from 'react';
import {
    Text,
    View,
    Modal,
    TouchableWithoutFeedback,
    ScrollView,
    Platform,
    Keyboard
} from 'react-native';
import styles from './styles'
import { TouchableRipple } from 'react-native-paper'
import Linearicon from '~/src/components/Linearicon'

export default class Picker extends React.Component {

    constructor(props) {
        super(props)
        // {value, name}
        this.state = {
            select: props.value || (props.placeholderComponent ? '' : this.props.listValue[0]),
            modalVisible: false,
            top: 0,
            right: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        const { onChange, shouldSelectDefaultValueOnLoadData } = this.props
        if (shouldSelectDefaultValueOnLoadData && nextProps.listValue
            && nextProps.listValue[0] && nextProps.listValue.length != this.props.listValue.length) {
            console.log('Picker receiveProps')
            this.setState({ select: nextProps.listValue[0] })
            onChange && onChange(nextProps.listValue[0])
        }

    }

    _handlePress = () => {
        const { listValue, isFixed } = this.props
        if (isFixed) {
            return
        }

        if (!listValue || listValue.length <= 1) return
        Keyboard.dismiss()
        this.selectItem && this.selectItem.measure((x, y, width, height, pageX, pageY) => {
            console.log('Select Item Measure', { x, y, width, height, pageX, pageY })
            let right = 3 //window.width - pageX - width
            let top = pageY + height + (Platform.OS == 'ios' ? 10 : -10)
            console.log('Right', right)
            this.open({ x: (pageX + width), top, right })
        })
    }

    setItemSelected = (item) => {
        this.setState({select: item});
    }

    _onPressItem = (item) => {
        const { onChange } = this.props
        this.setState({ select: item, modalVisible: false, top: 0, right: 0 })
        onChange && onChange(item)
    }

    close = () => {
        this.setState({ modalVisible: false, x: 0, y: 0 })
    }

    open = (position) => {
        this.setState({ modalVisible: true, ...position })
    }

    getSelected = () => {
        console.log('Get Selected state', this.state)
        return this.state.select
    }

    render() {
        const { listValue, isFixed } = this.props
        // if (!this.state.select || !this.state.select.name || !listValue) return false
        const { containerStyle, dropdownPopupStyle, dropdownTextStyle, placeholderComponent, icon = 'chevron-down', iconStyle } = this.props
        return (
            <View style={[styles.container, containerStyle]}>
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.close()}>
                    <TouchableWithoutFeedback onPress={() => this.close()}>
                        <View style={styles.modalOverlay}>
                            <View style={[{
                                top: this.state.top,
                                right: this.state.right,
                                margin: 5,
                                ...styles.listValueContainer
                            }, dropdownPopupStyle]}>
                                <ScrollView
                                    bounces={false}
                                    style={{
                                        ...styles.listValueContainerScroll
                                    }}
                                >
                                    {listValue.map(item => (
                                        <TouchableWithoutFeedback onPress={() => this._onPressItem(item)} key={item.value}>
                                            <View style={styles.listValueItem}>
                                                <Text style={styles.text}>{item.name}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                </Modal>
                <TouchableRipple onPress={this._handlePress}>
                    <View style={{ ...styles.selectItem, ...this.props.dropdownStyle }} ref={ref => this.selectItem = ref}>
                        {!!this.state.select ?
                            <Text style={[styles.text, dropdownTextStyle]}>{this.state.select.name}</Text>
                            :
                            placeholderComponent ? placeholderComponent() : <View />
                        }
                        {!!listValue && (listValue.length > 1) && !isFixed &&<Linearicon name={icon} style={[styles.dropdownIcon, iconStyle]} />}
                    </View>
                </TouchableRipple>
            </View>
        )
    }
}
