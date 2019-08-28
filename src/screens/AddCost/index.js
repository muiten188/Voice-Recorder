import React, { Component } from "react";
import { TouchableOpacity, StatusBar, Platform, Image } from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import I18n from "~/src/I18n";
import {
  createCost,
  getListCost,
  getCostInfo,
  deleteCost,
  getListCostGroup,
  getTotalCost
} from "~/src/store/actions/costManage";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ToastUtils from "~/src/utils/ToastUtils";

import {
  timeDateCostSelecttor,
  costGroupListSelector
} from "~/src/store/selectors/costManage";
import { Switch, TouchableRipple } from "react-native-paper";
import { COLORS, SURFACE_STYLES } from "~/src/themes/common";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LoadingModal from "~/src/components/LoadingModal";
import lodash from "lodash";
import {
  Toolbar,
  TitleRowInput,
  DateInput,
  Container,
  Text,
  View,
  PopupConfirm,
  MultipleTagSelector
} from "~/src/themes/ThemeComponent";
import imgAddOpacity from "~/src/image/add_opacity.png";
import { MAX_LENGTH_NOTE_COST, MAX_LENGTH_TOTAL_AMOUNT } from "~/src/constants";
import {
  chainParse,
  formatMoney,
  revertFormatMoney,
  replacePatternString
} from "~/src/utils";

class AddCost extends Component {
  static navigationOptions = ({ navigation }) => {
    const note = navigation.getParam("note", "");
    // const update = navigation.getP
    if (note === "") {
      return {
        headerTitle: I18n.t("add_cost")
      };
    }
    return {
      headerTitle: I18n.t("update_cost"),
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
    const id = props.navigation.getParam("id", "");
    // const
    const tradingDate = props.navigation.getParam("tradingDate", "");

    this.state = {
      totalAmount: "",
      note: "",
      tradingDate: tradingDate !== "" ? moment(tradingDate * 1000) : moment(),
      loading: false,
      id: id,
      disabledSave: id ? true : false,
      startTime: moment()
        .subtract(3, "month")
        .startOf("day"),
      endTime: moment().endOf("day"),
      popupDeleteCostContent: "",
      pGroupId: "",
      pGroupIdRequest: ""
    };
  }
  _load() {
    const { getListCostGroup } = this.props;
    getListCostGroup();
    const note = this.props.navigation.getParam("note", "");
    const totalAmount = this.props.navigation.getParam("totalAmount", "");
    const tradingDate = this.props.navigation.getParam("tradingDate", "");
    const id = this.props.navigation.getParam("id", "");
    if (tradingDate !== "") {
      this.setState({
        note: note,
        totalAmount: totalAmount
      });
      this.props.getCostInfo(id, (err, data) => {
        if (data && data.pOrder && data.purchaseGroup) {
          this.setState({
            note: data.pOrder.note,
            totalAmount: data.pOrder.totalAmount,
            tradingDate: moment(data.pOrder.tradingDate * 1000).startOf("day"),
            pGroupId:data.purchaseGroup.id,
            pGroupIdRequest:data.purchaseGroup.id
          });
        }
      });
    }
    console.log(moment(tradingDate * 1000).startOf("day"));
  }
  componentDidMount() {
    StatusBar.setBarStyle("dark-content");
    if (Platform.OS == "android") {
      StatusBar.setBackgroundColor(COLORS.WHITE);
    }
    const pGroupId = this.props.navigation.getParam("pGroupId", "");
    this.setState(
      {
        pGroupIdRequest: pGroupId,
        pGroupId: pGroupId
      },
      () => this._load()
    );
  }
  _handleSave = lodash.throttle(() => {
    const { createCost } = this.props;
    const date = new Date();
    this.setState({
      loading: true
    });
    console.log(date.getUTCMilliseconds());
    const requestObj = {
      tradingDate: this.state.tradingDate.unix(),
      totalAmount: revertFormatMoney(this.state.totalAmount),
      note: this.state.note.trim(),
      id: this.state.id,
      pGroupId: this.state.pGroupIdRequest
    };

    createCost(requestObj, (err, data) => {
      console.log("Staff List Err", err);
      console.log("Staff List Data", data);
      if (data) {
        if (data.httpHeaders) {
          if (data.httpHeaders.status === 200) {
            const { timeDate } = this.props;

            const { getListCost,getTotalCost } = this.props;
            this.props.navigation.goBack();
            getTotalCost(this.state.pGroupId)
            getListCost(this.state.pGroupId, 1, (err, data) => {
              if (data) {
                this.setState({ loading: false });
                ToastUtils.showSuccessToast(
                  replacePatternString(
                    this.state.id
                      ? I18n.t("update_cost_success")
                      : I18n.t("add_cost_success"),
                    `"${this.state.note.trim()}"`
                  )
                );
              }
            });
          } else if (data && data.code) {
            this.setState({ loading: false, errPhone: data.msg });
          } else {
            this.setState({ loading: false });
          }
          this.setState({ loading: false });
        }
      }
    });
  }, 5000);
  _handleOnChangeDate = dateTime => {
    this.setState({
      tradingDate: dateTime.endOf("day"),
      errTime: "",
      disabledSave: false
    });
  };
  _handleOnChangeTextAmount = text => {
    if (text === "0") {
      return;
    }
    this.setState({
      totalAmount: revertFormatMoney(text),
      disabledSave: false
    });
  };
  _handleOnChangeTextNote = text => {
    this.setState({ note: text, disabledSave: false });
  };
  _handleOnPressRightToolbar = () => {
    if (this.state.id) {
      this._handleOnPressDelete();
    } else {
      this.props.navigation.goBack();
    }
  };
  _handleOnPressDelete = () => {
    const warnMessage = replacePatternString(
      I18n.t("warn_delete_cost"),
      `"${this.state.note}"`
    );
    this.setState(
      {
        popupDeleteCostContent: warnMessage
      },
      () => {
        this.popupDeleteCost && this.popupDeleteCost.open();
      }
    );
  };
  _deleteCost = () => {
    this.setState({
      loading: true
    });
    const { deleteCost ,getTotalCost} = this.props;
    deleteCost(this.state.id, (err, data) => {
      console.log(data);
      if (chainParse(data, ["updated", "result"])) {
        this.setState({ loading: false });
        const { getListCost } = this.props;
        ToastUtils.showSuccessToast(
          replacePatternString(
            I18n.t("delete_cost_success"),
            `"${this.state.note}"`
          )
        );
        this.props.navigation.goBack();
        getTotalCost(this.state.pGroupId)

        getListCost(this.state.pGroupId,1);
        // this.props.getStaffList(selectedMerchantId);
      } else if (data && data.code) {
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
      }
    });
  };
  _updatepGroupId = value => {
    if (value.length == 0) {
      this.setState({
        pGroupIdRequest: "",
        disabledSave: true
      });
      return;
    }
    console.log(value);
    this.setState({
      pGroupIdRequest: value[1],
      disabledSave: false
    });
  };
  _onAddCostGroup=(pGroup)=>{
    this.setState({pGroupIdRequest:pGroup.id})
  }
  _handleAddCostGroup = () => {
    this.props.navigation.navigate("AddCostGroup",{
      callback:this._onAddCostGroup
    });
  };
  render() {
    const { costGroupList } = this.props;
    const listContent = costGroupList ? costGroupList : [];

    const enableBtn = !!(
      this.state.totalAmount &&
      this.state.note &&
      this.state.note.trim() &&
      this.state.pGroupIdRequest
    );
    return (
      <Container>
        <View style={styles.block}>
          <LoadingModal visible={this.state.loading} />

          <PopupConfirm
            ref={ref => (this.popupDeleteCost = ref)}
            content={this.state.popupDeleteCostContent}
            onPressYes={this._deleteCost}
            onPressNo={() => (this.selectedCostId = "")}
          />
          <Toolbar
            onPressRight={this._handleOnPressRightToolbar}
            title={this.state.id ? I18n.t("update_cost") : I18n.t("add_cost")}
            rightText={this.state.id ? I18n.t("delete") : I18n.t("cancel")}
          />
          <KeyboardAwareScrollView
            bounces={false}
            keyboardShouldPersistTaps={"handled"}
          >
            <View
              className="row-start white "
              style={{ marginTop: 38, paddingRight: 16 }}
            >
              <TitleRowInput
                title={I18n.t("total_amount_cost")}
                onChangeText={this._handleOnChangeTextAmount}
                placeholder={I18n.t("hint_money")}
                value={formatMoney(this.state.totalAmount)}
                keyboardType="number-pad"
                maxLength={MAX_LENGTH_TOTAL_AMOUNT}
              />
              <Text>{I18n.t("vnd")}</Text>
            </View>
            <TitleRowInput
              title={I18n.t("note_cost")}
              style={{ marginTop: 10, height: 90 }}
              height={90}
              onChangeText={this._handleOnChangeTextNote}
              value={this.state.note}
              maxLength={MAX_LENGTH_NOTE_COST}
              numberOfLines={3}
              multiline={true}
              styleTextInput={{ height: 48, textAlignVertical: "top" }}
              placeholder={I18n.t("input_content")}
            />

            <View className="space10" />
            <View
              className="white ph24"
              style={{ paddingTop: 16, backgroundColor: COLORS.WHITE }}
            >
              <View className="row-start">
                <Text style={styles.txtTitleChoose}>
                  {I18n.t("choose_group_cost")}
                </Text>

                <Text style={styles.txtNotRequire}>({I18n.t("require")})</Text>
              </View>
              <View className="space16" />
              <MultipleTagSelector
                data={listContent}
                values={[this.state.pGroupIdRequest]}
                onChange={this._updatepGroupId}
              />
            </View>
            <TouchableOpacity onPress={this._handleAddCostGroup}>
              <View className="flex pv8 border-top white">
                <View className="row-center">
                  <View style={styles.viewAddOpacity}>
                    <Image
                      source={imgAddOpacity}
                      style={{ width: 10, height: 10 }}
                    />
                  </View>
                  <Text style={[styles.txtTitleChoose, { marginLeft: 8 }]}>
                    {I18n.t("add_cost_group")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View className="space8" />
            <DateInput
              maxDate={new Date()}
              value={this.state.tradingDate}
              title={I18n.t("time_cost")}
              // style={{ marginTop: 10 }}
              onChange={this._handleOnChangeDate}
            />
          </KeyboardAwareScrollView>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ width: "100%", position: "absolute", bottom: 0 }}
            onPress={this._handleSave}
            disabled={this.state.disabledSave || !enableBtn ? true : false}
          >
            <View
              style={[
                styles.viewSave,
                {
                  backgroundColor:
                    this.state.disabledSave || !enableBtn
                      ? COLORS.DISABLE_BUTTON
                      : COLORS.PRIMARY
                }
              ]}
            >
              <Text
                style={[
                  styles.labelSave,
                  {
                    color:
                      this.state.disabledSave || !enableBtn
                        ? COLORS.BACKDROP
                        : COLORS.WHITE
                  }
                ]}
              >
                {this.state.id ? I18n.t("save_change") : I18n.t("done")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

export default connect(
  (state, props) => {
    return {
      timeDate: timeDateCostSelecttor(state),
      costGroupList: costGroupListSelector(state)
    };
  },
  { createCost, getListCost, getCostInfo, deleteCost, getListCostGroup ,getTotalCost}
)(AddCost);
