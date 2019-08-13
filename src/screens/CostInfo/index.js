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

import {
  createCost,
  getListCost,
  deleteCost
} from "~/src/store/actions/costManage";
import { DateInput, Container,Toolbar } from "~/src/themes/ThemeComponent";
import { Switch, TouchableRipple } from "react-native-paper";
import { COLORS, SURFACE_STYLES } from "~/src/themes/common";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { chainParse, toElevation } from "~/src/utils";
import moment from "moment";
import LoadingModal from "~/src/components/LoadingModal";
import { timeDateCostSelecttor } from "~/src/store/selectors/costManage";

// import { chainParse, isValidPhoneNumer } from "~/src/utils";

class CostInfo extends Component {
  static navigationOptions = ({ navigation }) => {
    // const note = navigation.getParam("note", "");
    // // const update = navigation.getP
    // if (note === "") {
    //   return {
    //     headerTitle: I18n.t("add_cost")
    //   };
    // }
    return {
      headerTitle: I18n.t("info_cost"),
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
      loading: false
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
    this.props.navigation.navigate("AddCost", {
      tradingDate: this.state.tradingDate,
      note: this.state.note,
      totalAmount: this.state.totalAmount,
      id:this.state.id
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
    const totalAmount = this.props.navigation.getParam("totalAmount", "");
    const tradingDate = this.props.navigation.getParam("tradingDate", "");
    const id = this.props.navigation.getParam("id", "");
    if (tradingDate !== "") {
      this.setState({
        note: note,
        totalAmount: totalAmount,
        tradingDate: tradingDate,
        id: id
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
  _deleteCost = () => {
    this.setState({
      loading: true
    });
    const { deleteCost } = this.props;
    deleteCost(this.state.id, (err, data) => {
      console.log(data);
      if (chainParse(data, ["updated", "result"])) {
        this.setState({ loading: false });
        const { getListCost } = this.props;
        
        this.props.navigation.goBack();

        getListCost(-1, -1);
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
      <Container>
      <Toolbar title={I18n.t("cost_manage")}></Toolbar>
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
        <PopupConfirm
          animationType="none"
          contentT={"warning_delete_cost"}
          titleT={"confirm"}
          textYesT={"delete"}
          textNoT={"cancel"}
          onPressYes={this._deleteCost}
          onPressNo={() => (this.deletingStaff = "")}
          ref={ref => (this.popupConfirmDelete = ref)}
        />
      </View>
      </Container>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      timeDate: timeDateCostSelecttor(state)
    };
  },
  { getListCost, deleteCost }
)(CostInfo);
