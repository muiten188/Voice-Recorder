import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import { View, Text, Caption } from "~/src/themesnew/ThemeComponent";
import { generateHighlightTextItem, formatMoney } from "~/src/utils";
import { getOrderDetail } from "~/src/store/actions/order";
import { getCostInfo } from "~/src/store/actions/costManage";
import { getDebtDetail } from "~/src/store/actions/debtManage";
import { COLORS } from "~/src/themesnew/common";
import I18n from "~/src/I18n";
import moment from "moment";
import styles from "./styles";
import { connect } from "react-redux";


class ActivityItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  _handleOnPressOderItem=(item)=>{
    const {getOrderDetail}= this.props
    getOrderDetail(item.refId,(err,data)=>{
      // console.log(data)
      if(data){
        if(data.order &&data.order.status==-1 ){
          const {onPress}= this.props
          onPress && onPress(item.title)
        }else{
          this.props.navigation.navigate("OrderDetail", {
            
            orderId: item.refId
          });
        }
      }
    })
  }
  _renderOder = item => {
    const textTime = moment(item.tradingDate * 1000).format(
      I18n.t("full_time_format")
    );
    return (
      <TouchableOpacity onPress={()=>this._handleOnPressItem(item)}>
        <View className="white ph24 pt16 pb12 border-bottom2">
          <View className="row-start">
            <View className="flex">
              <View className="row-start">
                <View className="row-start flex">
                  {generateHighlightTextItem(
                    item.action,
                    styles.txtTitle,
                    styles.txtTitleHighLight
                  )}
                </View>
                <Text
                  className="bold"
                  style={{
                    color:
                      item.status === 0
                        ? COLORS.TEXT_GRAY
                        : COLORS.GREENISHTEAL,
                    letterSpacing: -0.24,
                    marginLeft: 5
                  }}
                >
                  {item.status === 0 ? "" : "+"} {formatMoney(item.amount)}
                </Text>
              </View>
              <Caption style={{ lineHeight: 16, marginTop: 4 }}>
                {textTime}
              </Caption>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  _handleOnPressCostItem = (item) => {
    const {getCostInfo}= this.props
    getCostInfo(item.refId,(err,data)=>{
      // console.log(data)
      if(data){
        if(data.pOrder &&data.pOrder.status==-1 ){
          const {onPress}= this.props
          onPress && onPress(item.title)
        }else{
          this.props.navigation.navigate("AddCost", {
            tradingDate: item.tradingDate,
            totalAmount: item.amount,
            status: "info",
            id: item.refId
          });
        }
      }
    })

   
  };
  _handleOnPressItem=(item)=>{
    const{onPress}=this.props
    onPress && onPress(item)
  }
  _renderCostItem = item => {
    const textTime = moment(item.tradingDate * 1000).format(
      I18n.t("full_time_format")
    );

    return (
      //  generateHighlightTextItem(item.action,styles.txtTitle,styles.txtTitleHighLight)
      <TouchableOpacity onPress={()=>this._handleOnPressItem(item)}>
        <View className="white ph24 pt16 pb12 border-bottom2">
          <View className="row-start">
            <View className="flex">
              <View className="row-start">
                <View className="row-start flex">
                  {generateHighlightTextItem(
                    item.action,
                    styles.txtTitle,
                    styles.txtTitleHighLight
                  )}
                </View>
                <Text
                  className="bold"
                  style={{
                    color: COLORS.ORANGE,
                    letterSpacing: -0.24,
                    marginLeft: 5
                  }}
                >
                  {item.amount == 0 ? "" : "-" + formatMoney(item.amount)}
                </Text>
              </View>
              <Caption style={{ lineHeight: 16, marginTop: 4 }}>
                {textTime}
              </Caption>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  _handleOnPressDebtItem = (item) => {
    const {getDebtDetail}= this.props
    getDebtDetail(item.refId,(err,data)=>{
      // console.log(data)
      if(data){
        if(data.status &&data.status==-1 ){
          const {onPress}= this.props
          onPress && onPress(item.title)
        }else{
          this.props.navigation.navigate("AddDebt", {
            tradingDate: item.tradingDate,
            note: item.action,
            totalAmount: item.amount,
            status: "info",
            id: item.refId
          });
        }
      }
    })

   
  };
  _renderDebtItem = item => {
    const textTime = moment(item.tradingDate * 1000).format(
      I18n.t("full_time_format")
    );
    return (
      <TouchableOpacity onPress={()=>this._handleOnPressItem(item)}>
        <View className="white ph24 pt16 pb12 border-bottom2">
          <View className="row-start">
            <View className="flex">
              <View className="row-start">
                <View className="row-start flex">
                  {generateHighlightTextItem(
                    item.action,
                    styles.txtTitle,
                    styles.txtTitleHighLight
                  )}
                </View>
                <Text
                  className="bold"
                  style={{
                    color: COLORS.LIGHT_ORANGE,
                    letterSpacing: -0.24,
                    marginLeft: 5
                  }}
                >
                  {item.amount == 0 ? "" : formatMoney(item.amount)}
                </Text>
              </View>
              <Caption style={{ lineHeight: 16, marginTop: 4 }}>
                {textTime}
              </Caption>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const { item } = this.props;
    switch (item.title) {
      case "ORDER": {
        return this._renderOder(item);
      }
      case "P_ORDER": {
        return this._renderCostItem(item);
      }
      case "DEBT": {
        return this._renderDebtItem(item);
      }
      default:
        return <View />;
    }
  }
}
export default withNavigation(
  connect(
    null,
    { getOrderDetail, getCostInfo, getDebtDetail }
  )(ActivityItem)
);
