import React, { Component } from "react";
import { View, Text, Image, TextInput,TouchableWithoutFeedback } from "react-native";
import { COLORS } from "~/src/themesnew/common";
import imgSearch from "~/src/image/search.png";
import imgClear from "~/src/image/imgClear.png"
export default class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  _handleOnPressClear=()=>{

  }

  render() {
    const {
      onChangeText,
      label,
      visible,
      width,
      onFocus,
      onBlur,
      style,
      errorText,
      hasError,
      value,
      ...props
    } = this.props;
    if(visible){
      const showButtonClear = (
        <TouchableWithoutFeedback
            activeOpacity={0.8}
            onPress={() => this.props.onPressClear()}
        >
            <Image source={imgClear} style={{ width: 20, height: 20 }} />
        </TouchableWithoutFeedback>
    );
    const hideButtonClear = <View />;

    const ButtonClear = this.props.value ? showButtonClear : hideButtonClear;
      return (
        <TouchableWithoutFeedback 
        onPress={()=>this.textinput.focus()}
        >
        <View
          style={[{
            // width: 278,
            flex:1,
            paddingRight:8,
            borderRadius: 8,
            backgroundColor: COLORS.FEATURE_BACKGROUND,
            height: 32,
            flexDirection: "row",
            alignItems: "center"
          },style]}
        >
          <Image
          {...props}
            source={imgSearch}
            style={{ width: 24, height: 24, marginLeft: 8 }}
          />
          <TextInput 
                ref={ref => (this.textinput = ref)}
           style={{marginLeft:8, paddingVertical:4, flex:1}} placeholder={label} onChangeText={onChangeText} value={value}></TextInput>
           {ButtonClear}
        </View>
        </TouchableWithoutFeedback>
      );
    }else{
      return (
        <View></View>
      )
    }
    
  }
}
