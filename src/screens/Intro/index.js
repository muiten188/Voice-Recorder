import React, { Component } from "react";
import {
  Text,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import Carousel from "react-native-snap-carousel";
import styles from "./styles";
import intro1 from "~/src/image/intro/intro1.png";
import intro2 from "~/src/image/intro/intro2.png";
import intro3 from "~/src/image/intro/intro3.png";
import { DEVICE_WIDTH, DEVICE_HEIGHT,Point } from "~/src/themesnew/common";
import { COLORS } from "~/src/themesnew/common";
import { Container, View } from "~/src/themesnew/ThemeComponent";
import I18n from "~/src/I18n";

export default class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      dataIntros: [
        { name: "Lên đơn hàng nhanh", source: intro1, id: "1" },
        { name: "Theo dõi hoạt động", source: intro2, id: "2" },
        { name: "Báo cáo tổng hợp", source: intro3, id: "3" }
      ]
    };
  }
  _renderItem({ item, index }) {
    return (
      <View
        style={{
          //   flex: 1,
          backgroundColor: COLORS.PRIMARY,
          alignItems: "center"
        }}
      >
        <Text style={styles.titleItem}>{item.name.toUpperCase()}</Text>
        <Image source={item.source} style={{ width: 292*Point, height: 427*Point, marginTop:20*Point }} />
      </View>
    );
  }
  _updateCurrentIndex = currentIndex => {
    this.setState({
      currentIndex: currentIndex
    });
  };
  _renderItemIndicator = (item, index) => {
    if (item.index !== this.state.currentIndex) {
      return <View style={styles.viewIndicator} />;
    } else {
      return <View style={styles.viewIndicatorFocus} />;
    }
  };
  _saveIntro= async (status) => {
    try {
      await AsyncStorage.setItem("intro", status);
      console.log("SET ITEM SUCCESSFUL" + status);
    } catch (error) {
      console.log("SET ITEM FAIL");
    }
  };
  _handleDone = async () => {
    this._saveIntro("true")

    this.props.navigation.navigate("Login");
  };
  _renderButtonSkip = () => {
    if (this.state.currentIndex === 2) {
      return (
        <View
          
          style={[
            styles.btnSkip,
            { backgroundColor: COLORS.PRIMARY, marginRight: 12*Point , paddingVertical:12*Point}
          ]}
        />
      );
    } else {
      return (
        <TouchableOpacity style={{ marginRight: 12*Point }} onPress={this._handleDone}>
          <View  style={styles.btnSkip}>
            <Text style={styles.txtButton}>{I18n.t("ignore")}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };
  _handleOnPressNext=()=>{
    this.setState({
      currentIndex:this.state.currentIndex+1
    })
  }
  _renderButtonNext = () => {
    if (this.state.currentIndex === 2) {
      return (
        <TouchableOpacity onPress={this._handleDone}>
          <View  style={[styles.btnNext]}>
            <Text style={styles.txtButton}>{I18n.t("login")}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={this._handleOnPressNext}>
          <View  style={styles.btnNext}>
            <Text style={styles.txtButton}>{I18n.t("continue")}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };
  render() {
    return (
      <Container blue>
      <ScrollView style={{width:"100%"}}>
        <View style={styles.container}>
          <Carousel
            data={this.state.dataIntros}
            firstItem={this.state.currentIndex}
            itemWidth={DEVICE_WIDTH}
            onSnapToItem={this._updateCurrentIndex}
            sliderWidth={DEVICE_WIDTH}
            sliderHeight={DEVICE_HEIGHT}
            itemHeight={DEVICE_HEIGHT}
            renderItem={this._renderItem}
          />
          <FlatList
            style={{ marginTop: 12*Point }}
            horizontal={true}
            data={this.state.dataIntros}
            renderItem={this._renderItemIndicator}
            keyExtractor={item => item.id}
            extraData={this.state}
          />
          <View style={{ marginTop: 35*Point, flexDirection: "row" }}>
            {this._renderButtonSkip()}
            {this._renderButtonNext()}
          </View>
          {/* <Text> index </Text> */}
        </View>
        </ScrollView>
      </Container>
    );
  }
}
