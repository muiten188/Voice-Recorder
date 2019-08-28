import React, { Component } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import { Text, View } from "~/src/themes/ThemeComponent";
import styles from "./styles";
import imgArrow from "~/src/image/chevron_right_black.png";
import { COLORS } from "~/src/themes/common";
import I18n from "~/src/I18n";
import { getDebtBookInfo } from "~/src/store/actions/debtManage";
import { debtBookInfoSelector } from "~/src/store/selectors/debtManage";
import { connect } from "react-redux";

import { formatMoney } from "~/src/utils";

class DebtManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receivables: "",
      payable: ""
    };
  }
  _handleOnPressItem = item => {
    const totalAmount =
      item.type == 0
        ? item.status == 0
          ? item.totalAmount
          : ""
        : item.status == 0
        ? item.totalAmount
        : "";
    this.props.navigation.navigate("DebtList", {
      mode: item.id,
      name: item.name,
      type: item.type,
      status: item.status,
      totalAmount: totalAmount
    });
  };
  componentDidMount() {
    const { getDebtBookInfo, debtBookInfo } = this.props;

    getDebtBookInfo((err, data) => {
      console.log("Staff List Err", err);
      console.log("Staff List Data", data);
      this.setState({ isLoading: false });
    });
  }
  _renderItem = ({ item, index }) => {
    const showSpace = <View className="space16" />;
    const space = item.id == 2 ? showSpace : <View />;
    return (
      <View>
        <TouchableOpacity onPress={() => this._handleOnPressItem(item)}>
          <View
            key={item.id}
            style={[
              styles.viewItem,
              {
                borderBottomColor: COLORS.FEATURE_BACKGROUND,
                borderBottomWidth: 1
              }
            ]}
            className="ph24 pv16"
          >
            <Text style={styles.txtTitleItem}>{item.name}</Text>
            <View className="row-start">
              <Text
                style={
                  item.id == 1
                    ? styles.txtTotalAmountPayAble
                    : styles.txtTotalAmountReceivable
                }
              >
                {formatMoney(item.totalAmount)}
              </Text>
              <Image source={imgArrow} style={styles.imgArrow} />
            </View>
          </View>
        </TouchableOpacity>
        {space}
      </View>
    );
  };
  render() {
    const { debtBookInfo } = this.props;

    const receivables = debtBookInfo ? debtBookInfo.debtReceivable : "";
    const payable = debtBookInfo ? debtBookInfo.debtPayable : "";
    const data = [
      {
        id: 1,
        name: I18n.t("debt_payable"),
        totalAmount: payable,
        type: 1,
        status: 0
      },
      {
        id: 2,
        name: I18n.t("debt_paid"),
        totalAmount: "",
        type: 1,
        status: 1
      },
      {
        id: 3,
        name: I18n.t("debt_receivable"),
        totalAmount: receivables,
        type: 0,
        status: 0
      },
      {
        id: 4,
        name: I18n.t("debt_collected"),
        totalAmount: "",
        type: 0,
        status: 1
      }
    ];
    return (
      <View style={styles.container}>
        <View className="space24" />
        <FlatList
          data={data}
          renderItem={this._renderItem}
          keyExtractor={item => item.id + ""}
        />
      </View>
    );
  }
}
export default connect(
  state => ({
    debtBookInfo: debtBookInfoSelector(state)
  }),
  { getDebtBookInfo }
)(DebtManage);
