import React from "react";
import commonStyle, {
    DEVICE_WIDTH,
    DEVICE_HEIGHT,
    COLORS,
    SURFACE_STYLES
} from "~/src/themes/common";
import {
    Picker as PickerRN,
    Text,
    View,
    TouchableOpacity,
    Platform
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";
import { Button, Caption } from "react-native-paper";

export default class Picker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showingModal: false,
            value:
                props.defaultValue ||
                (props.options && props.options.length > 0
                    ? props.options[0].value
                    : ""),
            tempValue: ""
        };
    }

    componentDidMount() { }

    componentWillUnmount() { }

    getValue = () => {
        return this.state.value;
    };

    _handleCancel = () => {
        this._closeModal();
    };

    _handleOk = () => {
        this.setState({ value: this.state.tempValue, showingModal: false });
    };

    _openModal = () => {
        this.props.onPress(this.state.value);
        this.setState({ tempValue: this.state.value, showingModal: true });
    };

    _closeModal = () => {
        this.setState({ showingModal: false });
    };

    _renderPickerIOS = () => {
        const { options, placeholder, label, value } = this.props;
        const currentItem = options.find(item => item.value == this.state.value)
        const valueDisplay = currentItem && currentItem.label ? currentItem.label : ''
        return (
            <View>
                {!!label && (
                    <Caption style={{ color: "rgba(0, 0, 0, 0.54)" }}>{label}</Caption>
                )}
                <TouchableOpacity onPress={this._openModal}>
                    <View
                        style={[
                            SURFACE_STYLES.rowSpacebetween,
                            {
                                paddingVertical: 8,
                                borderBottomWidth: 1,
                                borderColor: "rgba(0,0,0,0.54)"
                            }
                        ]}
                    >
                        <Text style={{ color: "rgba(0, 0, 0, 0.85)" }}>{valueDisplay}</Text>
                        <Icon name={"chevron-down"} size={20} color={"gray"} />
                    </View>
                </TouchableOpacity>
                <Modal
                    isVisible={this.state.showingModal}
                    deviceWidth={DEVICE_WIDTH}
                    deviceHeight={DEVICE_HEIGHT}
                    style={{
                        margin: 0
                    }}
                    useNativeDriver={true}
                >
                    <View style={[SURFACE_STYLES.flex, SURFACE_STYLES.columnEnd]}>
                        <View
                            style={[
                                SURFACE_STYLES.columnCenter,
                                SURFACE_STYLES.white,
                                { maxHeight: 200 }
                            ]}
                        >
                            <View
                                style={[
                                    SURFACE_STYLES.rowSpacebetween,
                                    {
                                        width: DEVICE_WIDTH,
                                        backgroundColor: COLORS.FEATURE_BACKGROUND
                                    }
                                ]}
                            >
                                <Button mode="text" onPress={this._handleCancel}>
                                    Huỷ
                </Button>
                                <Button mode="text" onPress={this._handleOk}>
                                    Đồng ý
                </Button>
                            </View>
                            <PickerRN

                                selectedValue={this.state.tempValue}
                                style={{ width: DEVICE_WIDTH }}
                                onValueChange={(itemValue, itemIndex) => {
                                    console.log("On Change Value", itemValue);
                                    this.setState({ tempValue: itemValue });
                                }}
                            >
                                {options.map((item, index) => (
                                    <PickerRN.Item
                                        label={item.label}
                                        value={item.value}
                                        key={item.value}
                                    />
                                ))}
                            </PickerRN>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    };

    _renderPickerAndroid = () => {
        const { options, placeholder, label } = this.props;
        return (
            <View>
                {!!label && <Caption>{label}</Caption>}
                <View
                    style={{
                        minWidth: 200,
                        borderRadius: 2,
                        borderWidth: 1,
                        borderColor: "rgba(0,0,0,0.12)"
                    }}
                >
                    <PickerRN
                        selectedValue={this.state.value}
                        onValueChange={(itemValue, itemIndex) => {
                            this.props.onPress(itemValue);

                            console.log("On Change Value", itemValue);
                            this.setState({ value: itemValue });
                        }}
                        mode={"dropdown"}
                    >
                        {options.map((item, index) => (
                            <PickerRN.Item
                                label={item.label}
                                value={item.value}
                                key={item.value}
                            />
                        ))}
                    </PickerRN>
                </View>
            </View>
        );
    };

    render() {
        if (Platform.OS == "ios") {
            return this._renderPickerIOS();
        }
        return this._renderPickerAndroid();
    }
}
