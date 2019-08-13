import React, { Component } from "react";
import commonStyle, {
  SURFACE_STYLES,
  TEXT_STYLES
} from "~/src/themes/common";
import { View, TextInput, Text, Animated, Easing, Image,TouchableWithoutFeedback } from "react-native";
import Icon from "~/src/components/FontIcon";
import {COLORS} from "~/src/themesnew/common"
const MIN_LABEL_FONT_SIZE = 12;
const MAX_LABEL_FONT_SIZE = 14;
const LABEL_Y = 15;
const LABEL_X = 12;
const LABEL_TRANSFROM_DURATION = 150;
const BORDER_TOP2_BASE_WIDTH = 0;

export default class ThemeTextInputSecond extends Component {
  constructor(props) {
    super(props);
    const { width } = this.props;
    this.labelWidth = 0;
    this.labelHeight = 0;
    this.state = {
     
    };
  }

  _handleFocus = () => {
    const { onFocus, width } = this.props;
   
    onFocus && onFocus();
  };

  _animatePlaceholder = () => {
    const { width } = this.props;
    const labelContainerWidth =
      this.labelWidth / (MAX_LABEL_FONT_SIZE / MIN_LABEL_FONT_SIZE) + 10;
    const newBorderTop3Width = width - 12 - 4 - labelContainerWidth;
  };

  _handleBlur = () => {
    const { width, onBlur, value } = this.props;
    onBlur && onBlur();
  };

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      setTimeout(() => {
        this._animatePlaceholder();
      }, 100);
    }
  }
  componentDidUpdate() {
    const { value } = this.props;
    if (value) {
      setTimeout(() => {
        this._animatePlaceholder();
      }, 100);
    }
  }

  render() {
    const {
      borderColor = COLORS.WHITE,
      backgroundColor = "rgba(0,0,0,0.05)",
      label,
      width,
      onFocus,
      onBlur,
      style,
      errorText,
      hasError,
      sourceIconleft,
      ...props
    } = this.props;
    return (
      <View>
        <View
          style={{
            height: 48,
            borderWidth: 1,
            borderColor: hasError ? COLORS.ERROR : backgroundColor,
            borderRadius: 6,
            justifyContent: "center",
            padding: 2,
            flexDirection:'row',
            alignItems:'center',
            // backgroundColor:"rgba(0,0,0,0.05)"
            backgroundColor: backgroundColor
          }}
        >
          <View style={{ width: 49, height: 48, flexDirection:'row', alignItems:'center'}}>
            <Image
            source={this.props.sourceIconLeft}
              style={{ width: 24, height: 24, marginLeft: 12 }}
            />
            <View style={{width:1, height:24, backgroundColor:'rgba(0,0,0,0.1)', marginLeft:'auto'}}></View>
          </View>
          <TextInput
          
            selectionColor={COLORS.PRIMARY}
            {...props}
            placeholder={label}
            placeholderTextColor="rgba(0,0,0,0.5)"
            onFocus={this._handleFocus}
            onBlur={this._handleBlur}
            style={[
              { flex: 1, paddingHorizontal: 12, color: COLORS.BLACK },
              style
            ]}
          />
        </View>
        {!!hasError && (
          <View
            style={[
              SURFACE_STYLES.rowSpacebetween,
              SURFACE_STYLES.fullWidth,
              { marginTop: 5 }
            ]}
          >
            <Text themeable={false} style={TEXT_STYLES.error}>
              {errorText}
            </Text>
          </View>
        )}
      </View>
    );
  }
}
