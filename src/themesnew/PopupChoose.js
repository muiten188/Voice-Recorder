import React from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";
import Text, { Title, TextBold } from "./Text";
import { View } from "~/src/themesnew/ThemeComponent";
import Button from "./Button";
import { COLORS } from "~/src/themesnew/common";
import I18n from "~/src/I18n";
import imgTicker from "~/src/image/round_checkbox.png";
import { from } from "rxjs";

export default class PopupChoose extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: !!props.visible ? true : false,
      valueCurrent: this.props.value
    };
  }

  open() {
    this.setState({
      visible: true
    });
  }

  close() {
    this.setState({
      visible: false
    });
  }

  _onPressOverlay = () => {
    const { onPressOverlay } = this.props;
    this.setState(
      {
        visible: false
      },
      () => {
        onPressOverlay && onPressOverlay();
      }
    );
  };

  _getHighlightContent = () => {
    const { content } = this.props;
    const splitArr = content.split('"');
    return (
      <Text style={styles.popupText}>
        {splitArr.map((item, index) =>
          index % 2 == 0 ? (
            item
          ) : (
            <TextBold style={styles.textHightLight} key={item}>
              "{item}"
            </TextBold>
          )
        )}
      </Text>
    );
  };

  _handlePressYes = () => {
    this.close();
    this.props.onPressYes && this.props.onPressYes();
  };

  _handlePressNo = () => {
    this.close();
    this.props.onPressNo && this.props.onPressNo();
  };
  _handleOnPressItem = item => {
    const { onChange } = this.props;
    this.setState({
      valueCurrent: item.id
    });
    onChange && onChange(item.id);
  };
  _renderItem = ({ item }) => {
    const { value } = this.props;
    const notTicker = (
      <View
        style={{
          borderRadius: 8,
          width: 16,
          height: 16,
          borderWidth: 1,
          borderColor: COLORS.BORDER_COLOR
        }}
      />
    );
    const Ticker = (
      <Image source={imgTicker} style={{ width: 16, height: 16 }} />
    );
    const renderTicker =
      item.id == this.state.valueCurrent ? Ticker : notTicker;
    return (
      <TouchableOpacity onPress={() => this._handleOnPressItem(item)}>
        <View
          className="row-start pv12"
          style={{
            borderBottomColor: COLORS.BORDER_COLOR,
            borderBottomWidth: item.id <= this.props.data.length - 1 ? 1 : 0
          }}
        >
          {renderTicker}
          <View style={{ marginLeft: 16 }}>
            <Text style={{ fontSize: 14 }}>{item.content}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { title = I18n.t("options"), content } = this.props;
    return (
      <Modal
        animationType={"none"}
        visible={this.state.visible}
        transparent={true}
        onRequestClose={() => this.close()}
      >
        <TouchableWithoutFeedback onPress={this._onPressOverlay}>
          <View style={styles.backdrop}>
            <View style={styles.popupOuter}>
              <View style={styles.popupContainer}>
                <View style={styles.header}>
                  <Image
                    source={require("~/src/image/warning.png")}
                    style={styles.warningIcon}
                  />
                  <Title>{title}</Title>
                </View>
                <View style={styles.popupContent}>
                  {/* <View style={styles.popupTextContainer}>
                                        <Text style={styles.popupText}>{this._getHighlightContent()}</Text>
                                    </View> */}
                  {/* <View className="flex"> */}
                  <View className="space10"></View>
                  <FlatList
                    extraData={this.state}
                    data={this.props.data}
                    keyExtractor={item => item.id}
                    renderItem={this._renderItem}
                  />
                  <View className="space20"></View>
                  {/* </View> */}

                  <View style={styles.buttonBlock}>
                    <Button
                      negative
                      text={I18n.t("cancel")}
                      onPress={this._handlePressNo}
                      style={styles.buttonLeft}
                    />
                    <Button
                      text={I18n.t("choose")}
                      onPress={this._handlePressYes}
                      style={styles.buttonRight}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BACKDROP
  },
  popupOuter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  popupContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 6,
    marginHorizontal: 24,
    flex: 1
  },
  header: {
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR
  },
  warningIcon: {
    width: 21,
    height: 18,
    marginRight: 8
  },
  popupContent: {
    paddingHorizontal: 24
  },
  popupTextContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  popupText: {
    marginTop: 47,
    marginBottom: 44,
    color: COLORS.TEXT_BACK,
    textAlign: "center"
  },
  textHightLight: {
    color: COLORS.CERULEAN
  },
  buttonBlock: {
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonLeft: {
    borderRadius: 6,
    flex: 1,
    marginRight: 8
  },
  buttonRight: {
    borderRadius: 6,
    flex: 1
  }
});
