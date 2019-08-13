import React, { Component } from "react";
import PopupConfirm from "~/src/components/PopupConfirm";

import {
  Text,
  View,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import { TextInput } from "~/src/themes/ThemeComponent";
import styles from "./styles";
import I18n from "~/src/I18n";

import { getListDebt, deleteDebt } from "~/src/store/actions/debtManage";
import { DateInput } from "~/src/themes/ThemeComponent";
import { Switch, TouchableRipple } from "react-native-paper";
import { COLORS, SURFACE_STYLES } from "~/src/themes/common";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { chainParse, toElevation } from "~/src/utils";
import moment from "moment";
import LoadingModal from "~/src/components/LoadingModal";
import { timeDateDebtSelecttor } from "~/src/store/selectors/debtManage";

// import { chainParse, isValidPhoneNumer } from "~/src/utils";

class DebtInfo extends Component {
  static navigationOptions = ({ navigation }) => {
    // const note = navigation.getParam("note", "");
    // // const update = navigation.getP
    // if (note === "") {
    //   return {
    //     headerTitle: I18n.t("add_cost")
    //   };
    // }
    return {
      headerTitle: I18n.t("deft_info"),
      headerRight: (
        <TouchableRipple
          onPress={navigation.getParam("onPressMore")}
          rippleColor={COLORS.RIPPLE}
        >
          <View
            style={[
              SURFACE_STYLES.rowCenter,
              { paddingHorizontal: 16, paddingVertical: 8 }
            ]}
          >
            <Icon name="dots-horizontal" size={24} color={"rgba(0,0,0,0.9)"} />
          </View>
        </TouchableRipple>
      )
    };
  };
  constructor(props) {
    super(props);

    // const

    this.state = {
      totalAmount: "",
      note: "",
      tradingDate: moment(),
      showContext: false,
      id: null,
      loading: false,
      type: 0,
      status: 0
    };
  }
  _handlePressMore = () => {
    console.log("Handle Press More");
    this.setState({ showContext: true });
  };
  _handlePressDelete = () => {
    this.setState({ showContext: false }, () => {
      console.log("_handlePressDelete");
      this.popupConfirmDelete && this.popupConfirmDelete.open();
    });
  };
  _hanldePressUpdateInfo = () => {
    this.setState({ showContext: false });
    this.props.navigation.navigate("AddDebt", {
      tradingDate: this.state.tradingDate,
      note: this.state.note,
      totalAmount: this.state.totalAmount,
      id: this.state.id,
      type: this.state.type,
      status: this.state.status
    });
    // const staff = this.props.navigation.getParam("staff");

    // this.props.navigation.navigate("AddStaff", {
    //   username: staff.userName,
    //   phone: staff.phone,
    //   name: staff.name,
    //   userId: staff.userId
    // });
  };
  _load() {
    const note = this.props.navigation.getParam("note", "");
    const totalAmount = this.props.navigation.getParam("amount", "");
    const tradingDate = this.props.navigation.getParam("tradingDate", "");
    const id = this.props.navigation.getParam("id", "");
    const type = this.props.navigation.getParam("type", "");
    const status = this.props.navigation.getParam("status", "");
    if (tradingDate !== "") {
      this.setState({
        note: note,
        totalAmount: totalAmount,
        tradingDate: tradingDate,
        id: id,
        type: type,
        status: status
      });
    }
  }
  componentDidMount() {
    this.props.navigation.setParams({ onPressMore: this._handlePressMore });

    this._load();
  }

  _handleChangeToDate = dateTime => {
    this.setState({ dateTime: dateTime.endOf("day"), errTime: "" });
  };
  _deleteDebgt = () => {
    this.setState({
      loading: true
    });
    const { deleteDebt } = this.props;
    deleteDebt(this.state.id, (err, data) => {
      console.log(data);
      if (chainParse(data, ["updated", "result"])) {
        // this.setState({ loading: false });
        const { getListDebt } = this.props;
        
        this.setState({ loading: false });
        this.props.navigation.goBack();
        getListDebt(-1, -1, 10, 1, (err, data) => {
          console.log("Staff List Err", err);
          console.log("Staff List Data", data);
        });
        // this.props.getStaffList(selectedMerchantId);
      } else if (data && data.code) {
        this.setState({ loading: false, errPhone: data.msg });
      } else {
        this.setState({ loading: false });
      }
    });
  };
  render() {
    return (
      <View style={styles.block}>
        <LoadingModal visible={this.state.loading} />

        <Modal
          visible={this.state.showContext}
          onRequestClose={() => this.setState({ showContext: false })}
          transparent={true}
        >
          <TouchableWithoutFeedback
            onPress={() => this.setState({ showContext: false })}
          >
            <View style={{ flex: 1 }}>
              <View
                style={[
                  {
                    position: "absolute",
                    top: 40,
                    right: 16,
                    backgroundColor: COLORS.WHITE
                  },
                  toElevation(2)
                ]}
              >
                <TouchableRipple
                  onPress={this._hanldePressUpdateInfo}
                  rippleColor={COLORS.RIPPLE}
                >
                  <View style={{ padding: 16 }}>
                    <Text>{I18n.t("update_info")}</Text>
                  </View>
                </TouchableRipple>
                <TouchableRipple
                  onPress={this._handlePressDelete}
                  rippleColor={COLORS.RIPPLE}
                >
                  <View style={{ padding: 16 }}>
                    <Text>{I18n.t("delete")}</Text>
                  </View>
                </TouchableRipple>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <TextInput
          editable={false}
          placeholderT={"note_cost"}
          onChangeText={text => this.setState({ note: text })}
          value={moment(this.state.tradingDate * 1000).format(
            I18n.t("date_format")
          )}
          blackWithDarkblueIcon
          // textAlign={"end"}
          textInputStyle={{ textAlign: "right" }}
        />

        <TextInput
          editable={false}
          placeholderT={"note_cost"}
          onChangeText={text => this.setState({ note: text })}
          value={this.state.note}
          blackWithDarkblueIcon
          // textAlign={"end"}
          textInputStyle={{ textAlign: "right" }}
        />

        <TextInput
          editable={false}
          textInputStyle={{ textAlign: "right" }}
          placeholderT={"total_amount_cost"}
          onChangeText={text => this.setState({ totalAmount: text })}
          value={this.state.totalAmount.toString()}
          blackWithDarkblueIcon
          keyboardType="number-pad"
          // textAlign={"end"}
        />

        <TextInput
          editable={false}
          textInputStyle={{ textAlign: "right" }}
          placeholderT={"total_amount_cost"}
          onChangeText={text => this.setState({ totalAmount: text })}
          value={this.state.type == 0 ? "Phải thu" : "Phải trả"}
          blackWithDarkblueIcon
          keyboardType="number-pad"
          // textAlign={"end"}
        />
        <TextInput
          editable={false}
          textInputStyle={{ textAlign: "right" }}
          //   placeholderT={"total_amount_cost"}
          onChangeText={text => this.setState({ totalAmount: text })}
          value={this.state.status == 0 ? "Chưa hoàn tất" : "Hoàn tất"}
          blackWithDarkblueIcon
          //   keyboardType="number-pad"
          // textAlign={"end"}
        />
        <PopupConfirm
          animationType="none"
          contentT={"warning_delete_debt"}
          titleT={"confirm"}
          textYesT={"delete"}
          textNoT={"cancel"}
          onPressYes={this._deleteDebgt}
          onPressNo={() => (this.deletingStaff = "")}
          ref={ref => (this.popupConfirmDelete = ref)}
        />
      </View>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      timeDate: timeDateDebtSelecttor(state)
    };
  },
  { getListDebt, deleteDebt }
)(DebtInfo);
