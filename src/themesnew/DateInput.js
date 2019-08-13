import React, { Component } from "react";
import { Image, TouchableOpacity, DatePickerAndroid, DatePickerIOS, Platform } from "react-native";
import { SURFACE_STYLES, COLORS } from "~/src/themesnew/common";
import I18n from "~/src/I18n";
import { View } from "~/src/themesnew/ThemeComponent"
import Text from './Text'
import BottomSheetContainer from "~/src/components/BottomSheetContainer";
import moment from "moment"
export default class DateInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorText: COLORS.BLACK,
            value: props.value || ""

        };
    }
    
    getDisplayDate = () => {
        if (!this.state.value) return "";
        return this.state.value.format(I18n.t("date_format"));
    };
    _handlePressChooseDate = async () => {
        const { onChange, minDate, maxDate } = this.props;
        if (Platform.OS == "android") {
            try {
                const initDate = this.state.value
                    ? new Date(
                        this.state.value.year(),
                        this.state.value.month(),
                        this.state.value.date()
                    )
                    : new Date();
                const { action, year, month, day } = await DatePickerAndroid.open({
                    date: initDate,
                    minDate: this.props.minDate,
                    maxDate: this.props.maxDate
                });

                if (action !== DatePickerAndroid.dismissedAction) {
                    // Selected year, month (0-11), day
                    const chooseMoment = moment();
                    chooseMoment.year(year);
                    chooseMoment.month(month);
                    chooseMoment.date(day);
                    this.setState({ value: chooseMoment }, () => {
                        onChange && onChange(this.state.value);
                    });
                }
            } catch ({ code, message }) {
                console.warn("Cannot open date picker", message);
            }
        } else {
            this.chooseDate = this.state.value
                ? new Date(
                    this.state.value.year(),
                    this.state.value.month(),
                    this.state.value.date()
                )
                : minDate
                    ? minDate
                    : new Date();
            this.bottomSheet && this.bottomSheet.open();
        }
    };

    _onChangeDatePickerIOS = newDate => {
        console.log("_onChangeDatePickerIOS", newDate.getTime());
        this.chooseDate = newDate;
    };

    _handleCancelDatePicker = () => {
        console.log("_handleCancelDatePicker");
        this.bottomSheet && this.bottomSheet.close();
    };

    _handleChooseDatePicker = () => {
        console.log("_handleChooseDatePicker", this.chooseDate);
        if (this.chooseDate) {
            this.setState({ value: moment(this.chooseDate.getTime()) }, () => {
                this.bottomSheet && this.bottomSheet.close();
                const { onChange } = this.props;
                onChange && onChange(this.state.value);
            });
        } else {
            this.bottomSheet && this.bottomSheet.close();
        }
    };

    getDisplayDate = () => {
        if (!this.state.value) return "";
        return this.state.value.format(I18n.t("date_format"));
    };
    closeValue = () => {
        this.setState({
            value: ""
        });
    };
    render() {
        const { title, height, style, hasError, showCalendar = false, placeholder, ...props } = this.props;
        const initDate = this.state.value
            ? new Date(
                this.state.value.year(),
                this.state.value.month(),
                this.state.value.date()
            )
            : new Date();
        return (
            <View style={{ width: "100%" }}>
                <View
                    style={[
                        {
                            width: "100%",
                            flexDirection: "row",
                            alignItems: 'center',
                            backgroundColor: COLORS.WHITE,
                            height: height ? height : 45
                        },
                        style
                    ]}
                >
                    <View
                        // className ="pv16"
                        style={{
                            width: 118,
                            backgroundColor: COLORS.WHITE,
                            paddingLeft: 24,
                            paddingRight: 16
                            // alignItems: "center",
                            // justifyContent: "center"
                        }}
                    >
                        <Text
                            style={{
                                color: COLORS.TEXT_BLACK,
                                // fontWeight: "bold",
                                fontSize: 12
                            }}
                        >
                            {title}
                        </Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: COLORS.FEATURE_BACKGROUND,
                            height: height ? height : 45,
                            width: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                    <Text
                        style={[
                            {
                                // paddingLeft:15,
                                marginLeft: 16,
                                color: this.state.value ? COLORS.TEXT_BLACK : COLORS.PLACEHOLDER_COLOR,
                                fontSize: 14,
                                // fontWeight: "bold",
                            }
                        ]}
                    >
                        {this.getDisplayDate() || placeholder || ""}
                    </Text>


                    <BottomSheetContainer ref={ref => (this.bottomSheet = ref)}>
                        <View
                            style={[
                                SURFACE_STYLES.rowSpacebetween,
                                SURFACE_STYLES.borderBottom
                            ]}
                        >
                            <TouchableOpacity onPress={this._handleCancelDatePicker}>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 10 }}>
                                    <Text style={{ color: COLORS.TEXT_BLACK }}>
                                        {I18n.t("cancel")}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._handleChooseDatePicker}>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 10 }}>
                                    <Text style={{ color: COLORS.BLUE }}>{I18n.t("choose")}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <DatePickerIOS
                            mode={"date"}
                            date={initDate}
                            onDateChange={this._onChangeDatePickerIOS}
                            minimumDate={this.props.minDate}
                            maximumDate={this.props.maxDate}
                        />
                    </BottomSheetContainer>
                    <TouchableOpacity disabled={this.props.disabledEdit} style={{ height: 45, marginLeft: 'auto', justifyContent: 'center' }} onPress={this._handlePressChooseDate}>
                        {!!showCalendar ?
                            <Image source={require('~/src/image/calendar.png')} style={{ width: 24, height: 24, marginRight: 24 }} />
                            :
                            <Text
                                style={{ marginRight: 24, fontSize: 16, color: COLORS.PRIMARY }}
                            >{I18n.t("edit")}</Text>
                        }
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}
