import React, { Component } from "react";
import {
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import { SURFACE_STYLES, COLORS, TEXT_STYLES } from "~/src/themes/common";
import { View, Text } from "~/src/themes/ThemeComponent";

export default class TitleRowInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorText: COLORS.BLACK
    };
  }
  _handleOnFocus = () => {
    if (this.props.editable)
      this.setState({
        colorText: COLORS.PRIMARY
      });
  };
  
  _handleOnBlur = () => {
    if (this.props.editable)
      this.setState({
        colorText: COLORS.TEXT_BLACK
      });
      const{onBlur}= this.props
      onBlur && onBlur()
  };
  _handleOnPressText = () => {
    this.textinput.focus();
  };
  
  render() {
    const {
      title,
      height,
      style,
      styleTextInput,
      hasError,
      errorText,
      maxLength,
      ...props
    } = this.props;
    return (
      <View
        style={{
          flex: 1,
          borderColor: COLORS.FEATURE_BACKGROUND,
          borderRightWidth: this.props.borderRight ? 1 : 0
        }}
      >
        <View
          style={[
            {
              width: "100%",
              flexDirection: "row",
              backgroundColor: COLORS.WHITE
            },
            style
          ]}
        >
          <View
            style={{
              width: 118,
              backgroundColor: COLORS.WHITE,
              paddingLeft: 24,
              paddingRight: 5,
              paddingVertical: 16
            }}
          >
            <Text
              style={{
                color: COLORS.TEXT_BLACK,
                fontSize: this.props.big ? 16 : 12,
                lineHeight: this.props.big ? 19 : 14
              }}
            >
              {title}
            </Text>
          </View>
          {/* <View
            style={{
              backgroundColor: COLORS.FEATURE_BACKGROUND,
              height: height ? height : 46,
              width:1,
              
            }}
          /> */}

          <TouchableWithoutFeedback onPress={this._handleOnPressText}>
            <View
              style={{
                paddingVertical: 16,
                paddingLeft: 16,
                flex: 1,
                paddingRight: 24,
                borderLeftWidth: 1,
                borderColor: COLORS.FEATURE_BACKGROUND
              }}
            >
              <TextInput
                ref={ref => (this.textinput = ref)}
                {...props}
                
                editable={this.props.editable}
                selectionColor={COLORS.PRIMARY}
                style={[
                  {

                    color:COLORS.TEXT_BLACK,
                    fontSize: 14,
                    padding: 0,
                    height: 16,
                    lineHeight: 16
                  },
                  styleTextInput
                ]}
                textAlignVertical="top"
                maxLength={maxLength}
                onFocus={this._handleOnFocus}
                onBlur={this._handleOnBlur}
                placeholder={this.props.placeholder}
                value={this.props.value}
              />
              {!!hasError && (
                <Text style={{ fontSize: 11, color: COLORS.ERROR }}>
                  {errorText}
                </Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}
