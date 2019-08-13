import React from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import Text, { Title, TextBold } from "./Text";
import {View} from "~/src/themesnew/ThemeComponent"
import Button from "./Button";
import { COLORS } from "~/src/themesnew/common";
import I18n from "~/src/I18n";
import imgEmptyItem from "~/src/image/emptyItem.png";
const point = Dimensions.get("window").width;

export default class PopupConfirmImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: !!props.visible ? true : false
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

  render() {
    const {
      title = I18n.t("alert"),
      negativeText = I18n.t("cancel"),
      content
    } = this.props;
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
                  <View style={{ width: "100%", alignItems: "center" }}>
                    <Image
                      source={imgEmptyItem}
                      style={{ width: 250, height: 143 }}
                    />
                    <View className="space8" ></View>
                    <Text style={styles.popupText}>{this.props.content}</Text>
                  </View>
                  <View className="space24"></View>
                  <View style={styles.buttonBlock}>
                    <Button
                      text={I18n.t("close")}
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
  imgEmptyItem: {
    width: point * 250,
    height: point * 143
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
    fontSize: 14,
    lineHeight: 16,
    color: COLORS.TEXT_BLACK,
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
    width:134,
    height:48
  }
});
