import React, { PureComponent } from "react";
import {
  Platform,
  View,
  DatePickerAndroid,
  DatePickerIOS,
  TouchableWithoutFeedback
} from "react-native";
import Surface from "~/src/themes/Surface";
import Text from "~/src/themes/Text";

import commonStyle, {
  SURFACE_STYLES,
  TEXT_INPUT_STYLES,
  TextInput2 as TextInput
} from "~/src/themes/common";
import I18n from "~/src/I18n";
import { COLORS } from "~/src/themes/common";
import { Caption, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import BottomSheetContainer from "~/src/components/BottomSheetContainer";

export default class DateInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || ""
    };
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
  };
  closeValue = () => {
    this.setState({
      value: ""
    });
  };

  render() {
    const {
      hasError,
      errorText,
      containerStyle,
      textInputStyle,
      style,
      label,
      labelStyle,
      placeholder,
      onPress,
      value,
      isRequire,
      ...rest
    } = this.props;
    const color = "rgba(0,0 ,0,0.54)";
    let textInputContainerStyle = [
      commonStyle.textInput.textInputContainer,
      { borderBottomWidth: 1, borderBottomColor: color },
      style
    ];

    if (hasError) {
      textInputContainerStyle.push({ borderBottomColor: COLORS.ERROR });
    }

    const initDate = this.state.value
      ? new Date(
          this.state.value.year(),
          this.state.value.month(),
          this.state.value.date()
        )
      : new Date();

    return (
      <Surface
        themeable={false}
        columnAlignStart
        style={[
          commonStyle.textInput.textInputColumnContainer2,
          { width: "100%" },
          containerStyle
        ]}
      >
        {!!label && (
          <Text>
            <Caption style={[{ color }, labelStyle]}>{label}</Caption>
            {!!isRequire && <Text style={{ color: "red" }}>*</Text>}
          </Text>
        )}
        <BottomSheetContainer ref={ref => (this.bottomSheet = ref)}>
          <View
            style={[
              SURFACE_STYLES.rowSpacebetween,
              SURFACE_STYLES.borderBottom
            ]}
          >
            <TouchableRipple onPress={this._handleCancelDatePicker}>
              <View style={{ paddingHorizontal: 8, paddingVertical: 10 }}>
                <Text style={{ color: COLORS.TEXT_BLACK }}>
                  {I18n.t("cancel")}
                </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={this._handleChooseDatePicker}>
              <View style={{ paddingHorizontal: 8, paddingVertical: 10 }}>
                <Text style={{ color: COLORS.BLUE }}>{I18n.t("choose")}</Text>
              </View>
            </TouchableRipple>
          </View>
          <DatePickerIOS
            mode={"date"}
            date={initDate}
            onDateChange={this._onChangeDatePickerIOS}
            minimumDate={this.props.minDate}
            maximumDate={this.props.maxDate}
          />
        </BottomSheetContainer>
        <TouchableRipple
          onPress={this._handlePressChooseDate}
          rippleColor={COLORS.RIPPLE}
          style={[SURFACE_STYLES.flex]}
        >
          <Surface
            themeable={false}
            rowStart
            style={[SURFACE_STYLES.fullWidth, textInputContainerStyle]}
          >
            <View style={[SURFACE_STYLES.rowEnd, SURFACE_STYLES.flex]}>
              <Text
                style={{
                  color: this.state.value
                    ? COLORS.TEXT_BLACK
                    : COLORS.TEXT_GRAY,
                  marginRight: "auto"
                }}
              >
                {this.getDisplayDate() || placeholder}
              </Text>
              {/* <TouchableWithoutFeedback >
                    <View >
                        <Icon name='close' style={this.state.value ?{  fontSize: 15}:{}} />
                    </View>
                </TouchableWithoutFeedback> */}
            </View>
            <Icon name={"calendar-check"} size={20} color={color} />
          </Surface>
        </TouchableRipple>
        {!!hasError && (
          <Surface
            themeable={false}
            rowSpacebetween
            fullWidth
            style={{ marginTop: 3 }}
          >
            <Text themeable={false} error>
              {errorText}
            </Text>
            <Icon name="alert" size={12} color={COLORS.ERROR} />
          </Surface>
        )}
      </Surface>
    );
  }
}
