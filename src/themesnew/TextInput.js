import React, { Component } from "react";
import commonStyle, {
  SURFACE_STYLES,
} from "~/src/themes/common";
import { View, Text,  } from "~/src/themesnew/ThemeComponent";

import {  TextInput,  Animated, Easing, Image } from "react-native";
import Icon from "~/src/components/FontIcon";
import imgTickerIcon from "~/src/image/imgTickerIcon.png";
import {COLORS} from "~/src/themesnew/common"

const MIN_LABEL_FONT_SIZE = 12;
const MAX_LABEL_FONT_SIZE = 14;

const LABEL_TRANSFROM_DURATION = 150;
const BORDER_TOP2_BASE_WIDTH = 0;

export default class ThemeTextInputSecond extends Component {
  constructor(props) {
    super(props);
    const { width } = this.props;
    this.labelWidth = 0;
    this.labelHeight = 0;
    this.state = {
      check:false,
      suggest:false,
      labelTransform: {
        scaleX: new Animated.Value(1),
        translateY: new Animated.Value(15)
      },
      borderTop2Transform: {
        width: new Animated.Value(BORDER_TOP2_BASE_WIDTH),
        opacity: new Animated.Value(1)
      },
      borderTop3Transform: {
        width: new Animated.Value(width - 12 - BORDER_TOP2_BASE_WIDTH - 4)
      }
    };
  }

  _handleFocus = () => {
    this.setState({
      check:false,
      suggest:true
    })
    const { onFocus, width } = this.props;
    const labelContainerWidth =
      this.labelWidth / (MAX_LABEL_FONT_SIZE / MIN_LABEL_FONT_SIZE) + 10;
    const newBorderTop3Width = width - 12 - 4 - labelContainerWidth;
    Animated.parallel([
      Animated.timing(this.state.labelTransform.scaleX, {
        toValue: MIN_LABEL_FONT_SIZE / MAX_LABEL_FONT_SIZE,
        timing: LABEL_TRANSFROM_DURATION,
        useNativeDriver: true
      }),
      Animated.timing(this.state.labelTransform.translateY, {
        toValue: -this.labelHeight / 2,
        timing: LABEL_TRANSFROM_DURATION,
        useNativeDriver: true
      }),
      Animated.timing(this.state.borderTop2Transform.width, {
        toValue: labelContainerWidth,
        timing: LABEL_TRANSFROM_DURATION / 2,
        easing: Easing.linear,
        useNativeDriver: false
      }),
      Animated.timing(this.state.borderTop3Transform.width, {
        toValue: newBorderTop3Width,
        timing: LABEL_TRANSFROM_DURATION / 2,
        easing: Easing.linear,
        useNativeDriver: false
      }),
      Animated.timing(this.state.borderTop2Transform.opacity, {
        toValue: 0,
        timing: LABEL_TRANSFROM_DURATION / 2,
        useNativeDriver: false
      })
    ]).start();
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
    this.setState({
      check:true,
      suggest:false
    })
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
      borderColor = COLORS.PRIMARY,
      backgroundColor = "rgba(0,0,0,0.05)",
      label,
      width,
      onFocus,
      onBlur,
      style,
      errorText,
      suggestText,
      hasError,
      value,
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
            flexDirection: "row",
            // backgroundColor:"rgba(0,0,0,0.05)"
            backgroundColor: backgroundColor
          }}
        >
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
            value={this.props.value}
          />
          <View style={{ width: 29, justifyContent: "center" }}>
            <Image
              source={imgTickerIcon}
              style={
                !hasError && value && this.state.check
                  ? { width: 13, height: 9 }
                  : { width: 0, height: 0 }
              }
            />  
          </View>
        </View>
        {!!hasError && (
          <View
            style={[
              SURFACE_STYLES.rowSpacebetween,
              SURFACE_STYLES.fullWidth,
              { marginTop: 5 }
            ]}
          >
            <Text  style={{color:COLORS.ERROR, fontSize:12, lineHeight:18,marginLeft:8}}>
              {errorText}
            </Text>
          </View>
        )}
        {
          this.state.suggest  &&(
            <View style={{marginTop:5}}>
            <Text  style={{color:COLORS.PRIMARY, fontSize:12, lineHeight:18,marginLeft:8}}>
              {suggestText}
            </Text>
            </View>
           
          )
        }
      </View>
    );
  }
}
