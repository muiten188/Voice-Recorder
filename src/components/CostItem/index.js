import React, { Component } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import styles from "./styles";
import { COLORS } from "~/src/themes/common";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import I18n from "~/src/I18n";
import { formatMoney } from "~/src/utils";
import imgDelete from "~/src/image/delete_red.png";
import{Text} from "~/src/themesnew/ThemeComponent"

export default class CostItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTicker: false
    };
  }
  _handleOnpressTicker=()=> {
    
    const { onPress } = this.props;
    onPress && onPress();
  }
  _handleOnPressDeleteItem=()=>{
    const {onPressDelete} = this.props
    onPressDelete && onPressDelete()
  }
  _renderDelete = () => {
    if (this.props.showDelete) {
      return (
        <TouchableOpacity onPress={this._handleOnPressDeleteItem} style={styles.viewDelete}>
          <Image source={imgDelete} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => this.props.onPress()}
      >
        <View style={styles.container}>
          {/* <View></View> */}
          {/* <View style={{flexDirection:'row', width:'100%'}}> */}

          <View
            style={{
              flexDirection: "row",
              alignItems:"center",
              justifyContent: "center",
              height: 43,
              paddingHorizontal:24,
              flex:1,
              width:'100%'
            }}
          >
            {this._renderDelete()}

            <Text numberOfLines={1} style={styles.textNote}>{this.props.note}</Text>
            <Text style={styles.textTotalAmount}>
              {formatMoney(this.props.totalAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.line} />
      </TouchableOpacity>
    );
  }
}
