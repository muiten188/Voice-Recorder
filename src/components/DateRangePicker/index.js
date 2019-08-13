import React, { PureComponent } from "react";
import {
    Platform,
    DatePickerAndroid,
    DatePickerIOS,
    Image,
    TouchableOpacity
} from "react-native";
import { Text, View } from "~/src/themesnew/ThemeComponent";
import { SURFACE_STYLES } from "~/src/themes/common";
import I18n from "~/src/I18n";
import { COLORS } from "~/src/themes/common";
import moment from "moment";
import BottomSheetContainer from "~/src/components/BottomSheetContainer";
import Linearicon from "~/src/components/Linearicon";
import imgClear from "~/src/image/imgClear.png";

export default class DateRangePicker extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pickerCurrentDate: new Date(),
            showButtonClear: props.showButtonClear || false
        };
    }

    _handlePressStartDate = async () => {
        console.log("Pressing start date");
        const { startDate, endDate } = this.props;
        const endDateForPicker = endDate
            ? new Date(endDate.year(), endDate.month(), endDate.date())
            : new Date();
        if (Platform.OS == "android") {
            try {
                const initDate = startDate
                    ? new Date(startDate.year(), startDate.month(), startDate.date())
                    : new Date();
                const { action, year, month, day } = await DatePickerAndroid.open({
                    date: initDate,
                    maxDate: endDateForPicker
                });
                if (action !== DatePickerAndroid.dismissedAction) {
                    // Selected year, month (0-11), day
                    const chooseMoment = moment();
                    chooseMoment.year(year);
                    chooseMoment.month(month);
                    chooseMoment.date(day);
                    const { onChangeStartDate } = this.props;
                    onChangeStartDate && onChangeStartDate(chooseMoment.startOf("day"));
                }
            } catch ({ code, message }) {
                console.warn("Cannot open date picker", message);
            }
        } else {
            this.startDateTemp = startDate ? new Date(
                startDate.year(),
                startDate.month(),
                startDate.date()
            ) : new Date()
            this.startDateBottomSheet && this.startDateBottomSheet.open();
        }
    };

    _handlePressEndDate = async () => {
        console.log("Pressing end date");
        const { startDate, endDate } = this.props;
        const startDateForPicker = startDate
            ? new Date(startDate.year(), startDate.month(), startDate.date())
            : null;
        if (Platform.OS == "android") {
            try {
                const initDate = endDate
                    ? new Date(endDate.year(), endDate.month(), endDate.date())
                    : new Date();
                const { action, year, month, day } = await DatePickerAndroid.open({
                    date: initDate,
                    minDate: startDateForPicker ? startDateForPicker : new Date()
                    //   if(startDateForPicker) {
                    //     minDate: startDateForPicker;
                    //   }
                });
                if (action !== DatePickerAndroid.dismissedAction) {
                    // Selected year, month (0-11), day
                    const chooseMoment = moment();
                    chooseMoment.year(year);
                    chooseMoment.month(month);
                    chooseMoment.date(day);
                    const { onChangeEndDate } = this.props;
                    onChangeEndDate && onChangeEndDate(chooseMoment.endOf("day"));
                }
            } catch ({ code, message }) {
                console.warn("Cannot open date picker", message);
            }
        } else {
            this.endDateTemp = endDate ? new Date(
                endDate.year(),
                endDate.month(),
                endDate.date()
            ) : new Date()
            this.endDateBottomSheet && this.endDateBottomSheet.open();
        }
    };
    //   _handleOnPressClear()
    _onChangeStartDatePickerIOS = newStartDate => {
        console.log("newStartDate", newStartDate);
        this.startDateTemp = newStartDate;
    };

    _onChangeEndDatePickerIOS = newEndDate => {
        console.log("newEndDate", newEndDate);
        this.endDateTemp = newEndDate;
    };

    _handleChooseStartDatePicker = () => {
        const { onChangeStartDate } = this.props;
        this.startDateBottomSheet && this.startDateBottomSheet.close();
        onChangeStartDate &&
            onChangeStartDate(moment(this.startDateTemp.getTime()).startOf("day"));
    };

    _handleCancelStartDatePicker = () => {
        this.startDateBottomSheet && this.startDateBottomSheet.close();
    };

    _handleChooseEndDatePicker = () => {
        const { onChangeEndDate } = this.props;
        this.endDateBottomSheet && this.endDateBottomSheet.close();
        onChangeEndDate &&
            onChangeEndDate(moment(this.endDateTemp.getTime()).endOf("day"));
    };

    _handleCancelEndDatePicker = () => {
        this.endDateBottomSheet && this.endDateBottomSheet.close();
    };

    render() {
        const { startDate, endDate, visible, visibleButtonClear, style } = this.props;

        const startDateForPicker = startDate
            ? new Date(startDate.year(), startDate.month(), startDate.date())
            : new Date();

        const endDateMinimum = startDate
            ? new Date(startDate.year(), startDate.month(), startDate.date())
            : null;

        const endDateForPicker = endDate
            ? new Date(endDate.year(), endDate.month(), endDate.date())
            : new Date();
        const showButtonClear = (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.props.onPressClose()}
            >
                <Image source={imgClear} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
        );
        const hideButtonClear = <View />;

        const ButtonClear = this.props.visibleButtonClear ? showButtonClear : hideButtonClear;
        if (visible) {
            return (
                <View
                    style={[
                        SURFACE_STYLES.rowStart,
                        { paddingHorizontal: 24, paddingVertical: 16 },
                        style
                    ]}
                >
                    <TouchableOpacity onPress={this._handlePressStartDate}>
                        <View style={[SURFACE_STYLES.rowStart]}>
                            <Text style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.85)" }}>
                                {startDate
                                    ? startDate.format(I18n.t("date_format"))
                                    : I18n.t("from_date")}
                            </Text>
                            <View
                                style={[SURFACE_STYLES.rowCenter, { width: 24, height: 24 }]}
                            >
                                <Linearicon
                                    name="chevron-down"
                                    style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.5)" }}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View
                        style={[
                            SURFACE_STYLES.rowCenter,
                            { width: 20, height: 20, marginRight: 8 }
                        ]}
                    >
                        <Linearicon
                            name="arrow-right"
                            style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.25)" }}
                        />
                    </View>
                    <TouchableOpacity onPress={this._handlePressEndDate}>
                        <View style={[SURFACE_STYLES.rowStart]}>
                            <Text style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.85)" }}>
                                {endDate
                                    ? endDate.format(I18n.t("date_format"))
                                    : I18n.t("to_date")}
                            </Text>
                            <View
                                style={[SURFACE_STYLES.rowCenter, { width: 24, height: 24 }]}
                            >
                                <Linearicon
                                    name="chevron-down"
                                    style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.5)" }}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <BottomSheetContainer ref={ref => (this.startDateBottomSheet = ref)}>
                        <View
                            style={[
                                SURFACE_STYLES.rowSpacebetween,
                                SURFACE_STYLES.borderBottom
                            ]}
                        >
                            <TouchableOpacity onPress={this._handleCancelStartDatePicker}>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 10 }}>
                                    <Text style={{ color: COLORS.TEXT_BLACK }}>
                                        {I18n.t("cancel")}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._handleChooseStartDatePicker}>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 10 }}>
                                    <Text style={{ color: COLORS.BLUE }}>{I18n.t("choose")}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <DatePickerIOS
                            mode={"date"}
                            date={startDateForPicker}
                            onDateChange={this._onChangeStartDatePickerIOS}
                            maximumDate={endDateForPicker}
                        />
                    </BottomSheetContainer>

                    <BottomSheetContainer ref={ref => (this.endDateBottomSheet = ref)}>
                        <View
                            style={[
                                SURFACE_STYLES.rowSpacebetween,
                                SURFACE_STYLES.borderBottom
                            ]}
                        >
                            <TouchableOpacity onPress={this._handleCancelEndDatePicker}>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 10 }}>
                                    <Text style={{ color: COLORS.TEXT_BLACK }}>
                                        {I18n.t("cancel")}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._handleChooseEndDatePicker}>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 10 }}>
                                    <Text style={{ color: COLORS.BLUE }}>{I18n.t("choose")}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <DatePickerIOS
                            mode={"date"}
                            date={endDateForPicker}
                            onDateChange={this._onChangeEndDatePickerIOS}
                            minimumDate={endDateMinimum}
                        />
                    </BottomSheetContainer>
                    {ButtonClear}
                </View>
            );
        } else {
            return <View />;
        }
    }
}
