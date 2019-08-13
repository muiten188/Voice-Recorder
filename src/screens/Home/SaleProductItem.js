import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, TouchableRipple, Button } from "react-native-paper";
import {
  COLORS,
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  SURFACE_STYLES
} from "~/src/themes/common";
import styles from "./styles";
import FastImage from "react-native-fast-image";
const DEAL_IMAGE_WIDTH = Math.min((DEVICE_WIDTH - 32 - 10) / 2, 200);
const DEAL_IMAGE_HEIGHT = (DEAL_IMAGE_WIDTH * 185) / 123;

export default class SaleProductItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { image, title, style, name } = this.props;
    return (
      //   <View style={[{ width: DEAL_IMAGE_WIDTH }, style]}>
      <TouchableOpacity onPress={()=>this.props.onPress()}>
      <View
        style={{
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          backgroundColor: "white",
          margin: 8
        }}
      >
        <FastImage
          resizeMode="contain"
          style={{ width: DEAL_IMAGE_WIDTH, height: DEAL_IMAGE_HEIGHT, marginBottom:80 }}
          source={{ uri: image }}
        />
        <View style={styles.dealTitleContainer}>
          <Text style={{fontSize:13, color:'black'}}>{name}</Text>

          <Text style={{fontSize:13, color:'red'}}>{title}</Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  }
}
