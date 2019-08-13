import React, { Component } from "react";
import { Text, Image, TouchableOpacity, FlatList,Modal,ScrollView } from "react-native";
import { View, Container } from "~/src/themesnew/ThemeComponent";
import styles from "./styles";
import I18n from "~/src/I18n";
import imgDone from "~/src/image/done.png";
import imgGuideArrow from "~/src/image/guide_arrow.png";
import Carousel from "react-native-snap-carousel";
import imgMerchant from "~/src/image/imgListMerchant.png";
import imgMerchant2 from "~/src/image/imgListMerchant2.png";
import imgArrow from "~/src/image/imgArrow.png"
import { COLORS } from "~/src/themesnew/common";
import {generateHighlightText} from "~/src/utils"
import { DEVICE_WIDTH, DEVICE_HEIGHT,Point } from "~/src/themesnew/common";

export default class HomeGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      status: 1,
      //   visible: props.visible || false,
      data: [
        {
          title: I18n.t("create_product"),
          guide: I18n.t("guide_product"),
          source: imgMerchant
        },
        {
          title: I18n.t("create_floor_table"),
          guide: I18n.t("guide_table"),
          source: imgMerchant2
        }
      ]
    };
  }
  _renderItem = ({ item, index }) => {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={styles.txtItemTitle}>{item.title.toUpperCase()}</Text>
        <View  style={{marginTop:24*Point,  paddingHorizontal: 54*Point,}}>
        {generateHighlightText(item.guide, styles.txtItemGuide, styles.txtItemGuideHighLight)}
        </View>
        <Image source={item.source} style={{ width: 288*Point, height: 137*Point, marginTop:33*Point}} />
        <Image source={imgArrow} style={styles.imgArrow}></Image>
      </View>
    );
  };
  _updateCurrentIndex = currentIndex => {
    this.setState({
      currentIndex: currentIndex
    });
  };
  _renderButtonSkip = () => {
    if (this.state.currentIndex === 1) {
      return <View />;
    } else {
      return (
        <TouchableOpacity onPress={this._handleOnPressDone}>
          <View style={styles.btnSkipGuide} >
            <Text style={styles.txtButton}>{I18n.t("ignore")}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };
  _renderButtonNext = () => {
    if (this.state.currentIndex == 1) {
      return (
        <TouchableOpacity onPress={this._handleOnPressDone}>
          <View style={styles.btnNextGuide} >
            <Text style={styles.txtButton}>{I18n.t("done")}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this._updateCurrentIndex(this.state.currentIndex + 1)}
        >
          <View style={styles.btnNextGuide} >
            <Text style={styles.txtButton}>{I18n.t("continue")}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };
  // _renderIndicator;
  _renderNote = () => {
    return (
      
      <View style={[styles.container, { backgroundColor: COLORS.PRIMARY }]}>
        <View style={styles.viewHeader} className="ph44">
          {this._renderButtonSkip()}
          {this._renderButtonNext()}
        </View>
        <View style={styles.viewIndicator}>
          <View
            style={[
              styles.indicator,
              {
                backgroundColor:
                  this.state.currentIndex == 0 ? COLORS.WHITE : COLORS.INDICATOR
              }
            ]}
          />
          <View
            style={[
              styles.indicator,
              {
                backgroundColor:
                  this.state.currentIndex == 1 ? COLORS.WHITE : COLORS.INDICATOR
              }
            ]}
          />
        </View>
        <Carousel
          data={this.state.data}
          firstItem={this.state.currentIndex}
          renderItem={this._renderItem}
          itemWidth={DEVICE_WIDTH}
          onSnapToItem={this._updateCurrentIndex}
          sliderWidth={DEVICE_WIDTH}
          sliderHeight={DEVICE_HEIGHT}
          itemHeight={DEVICE_HEIGHT}
        />
      </View>
    );
  };
  _handleOnPressDone = () => {
    const { onPressDone } = this.props;
    onPressDone && onPressDone();
  };

  _renderGuide = () => {
    return (
      <Modal
                animationType={"none"}
                transparent={true}>

      <View style={[styles.container]}>
      <ScrollView style={{width:'100%'}}>
      <View  style={{width:'100%',paddingHorizontal:24*Point}} >
        <View style={styles.viewContent}>
          <View  style={[styles.viewHeaderContent,{paddingVertical:16*Point}]}>
            <Text style={styles.txtHeader}>{I18n.t("welcome_to_mshop")} </Text>
          </View>
          <View style={styles.line} />
          <Image source={imgDone} style={styles.imgDone} />
          <View  style={{ marginTop: 16*Point, paddingHorizontal:34*Point }}>
            <Text style={styles.txtHappy}>{I18n.t("register_success")} </Text>
          </View>
          <View  style={{ marginTop: 32*Point, paddingHorizontal:54*Point }}>
            <Text style={styles.txtGuide}>{I18n.t("guide_home")} </Text>
          </View>
          <Image source={imgGuideArrow} style={styles.imgGuide} />
          <View
            
            style={{ flexDirection: "row", marginTop: 19*Point, paddingHorizontal:24*Point }}
          >
            <TouchableOpacity
              style={{ marginRight: 8*Point }}
              onPress={this._handleOnPressDone}
            >
              <View  style={[styles.btnSkip,{paddingVertical:16*Point}]}>
                <Text style={styles.txtSkip}>{I18n.t("ignore")} </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ status: 2 })}>
              <View  style={[styles.btnNote,{paddingVertical:16*Point}]}>
                <Text style={styles.txtNote}>{I18n.t("view_note")} </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </ScrollView>

      </View>
      </Modal>

    );
  };
  render() {
    const { visible } = this.props;

    if (visible && this.state.status == 1) {
      return this._renderGuide();
    } else if (visible && this.state.status == 2) {
      return this._renderNote();
    } else {
      return <View />;
    }
  }
}
