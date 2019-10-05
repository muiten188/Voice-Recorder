import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, DatePickerAndroid, DatePickerIOS, Platform } from "react-native";
import { SURFACE_STYLES, COLORS } from "~/src/themes/common";
import I18n from "~/src/I18n";
import { View } from "~/src/themes/ThemeComponent"
import Text from './Text'
import BottomSheetContainer from "~/src/components/BottomSheetContainer";
import moment from "moment"
export default class DateInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || ""
        }
    }

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
    }

    closeValue = () => {
        this.setState({ value: "" })
    };

    render() {
        const { label, style, touchableStyle, hasError, placeholder, ...props } = this.props;
        const initDate = this.state.value
            ? new Date(
                this.state.value.year(),
                this.state.value.month(),
                this.state.value.date()
            )
            : new Date();
        return (
            <TouchableOpacity onPress={this._handlePressChooseDate} style={touchableStyle}>
                <View style={[styles.contaierStyle, style]}>
                    {!!label && <Text className='s13 textBlack bold'>{label}</Text>}
                    <Text style={styles.dateText}>{this.getDisplayDate()}</Text>
                    <BottomSheetContainer ref={ref => (this.bottomSheet = ref)}>
                        <View
                            style={[
                                SURFACE_STYLES.rowSpacebetween,
                                SURFACE_STYLES.borderBottom
                            ]}
                        >
                            <TouchableOpacity onPress={this._handleCancelDatePicker}>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 10 }}>
                                    <Text className='textBlack'>{I18n.t("cancel")}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._handleChooseDatePicker}>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 10 }}>
                                    <Text className='green'>{I18n.t("choose")}</Text>
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
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    dateText: {
        paddingTop: 6,
        paddingBottom: 6,
        fontSize: 13,
        color: COLORS.TEXT_BLACK
    },
    contaierStyle: {
        borderBottomWidth: 1,
        borderBottomColor: '#ededed',
    }
})
