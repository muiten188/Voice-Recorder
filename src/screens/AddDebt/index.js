import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import styles from "./styles";
import I18n from "~/src/I18n";
import {deleteDebt, createDebt, getDebtBookInfo ,getListDebt,getDebtDetail} from "~/src/store/actions/debtManage";
import moment from "moment";
import ToastUtils from "~/src/utils/ToastUtils";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { timeDateCostSelecttor } from "~/src/store/selectors/costManage";
// import { Switch, TouchableRipple } from "react-native-paper";
import { COLORS, SURFACE_STYLES } from "~/src/themesnew/common";
import LoadingModal from "~/src/components/LoadingModal";
import lodash from "lodash";
import {
  Toolbar,
  TitleRowInput,
  DateInput,
  Container,
  Switch,
  Text,
  View,
  PopupConfirm
} from "~/src/themesnew/ThemeComponent";

import { MAX_LENGTH_NOTE_COST, MAX_LENGTH_TOTAL_AMOUNT } from "~/src/constants";
import {
  formatMoney,
  revertFormatMoney,
  replacePatternString,
  chainParse
} from "~/src/utils";

class AddDebt extends Component {
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
      type: "",
      status: 0,
      popupDeleteDebtContent:""
    };
  }
  _load() {
    const note = this.props.navigation.getParam("note", "");
    const totalAmount = this.props.navigation.getParam("totalAmount", "");
    const tradingDate = this.props.navigation.getParam("tradingDate", "");
    const type = this.props.navigation.getParam("type", "");
    const status = this.props.navigation.getParam("status", "");
    const id =this.props.navigation.getParam("id","")
    // const id = this.props.navigation.getParam("id","")
    if (tradingDate !== "") {
      this.setState({
        note,
        totalAmount,
        type,
        status
        // tradingDate: moment(tradingDate * 1000).startOf("day")
      });
      this.props.getDebtDetail(id,(err,data)=>{
        // console.log(data)
        if(data){
          this.setState({
            note:data.note,
            totalAmount:data.amount,
            type:data.type,
            status:data.status,
            tradingDate: moment(data.tradingDate * 1000).startOf("day")
          });
        }
      })
    } else {
      this.setState({
        type
      });
    }
    
    console.log(moment(tradingDate * 1000).startOf("day"));
  }
  componentDidMount() {
    this._load();
  }
  _handleSave = lodash.throttle(() => {
    const { createDebt } = this.props;
    const date = new Date();
    this.setState({
      loading: true
    });
    // const totalAmount = parseInt(this.state.totalAmount);
    console.log(date.getUTCMilliseconds());
    if (this.state.id === "") {
      const requestObj = {
        tradingDate: this.state.tradingDate.unix(),
        amount: revertFormatMoney(this.state.totalAmount),
        type: this.state.type,
        status: this.state.status,
        note: this.state.note.trim()
      };

      createDebt(requestObj, (err, data) => {
        console.log("Staff List Err", err);
        console.log("Staff List Data", data);
        if (data) {
          if (data.httpHeaders) {
            if (data.httpHeaders.status === 200) {
              // const { timeDate } = this.props;

              const { getDebtBookInfo } = this.props;
              const objRequest = {
                beginDate: -1,
                endDate: -1,
                type: this.state.type,
                status: this.state.status,
                pageSize: 10,
                page: 1
              };
              this.props.getListDebt(objRequest, (err, data) => {
                console.log("Staff List Err", err);
                console.log("Staff List Data", data);
                this.setState({ isLoading: false, loading: false });
              });
              getDebtBookInfo();
              this.props.navigation.goBack()
              // this.props.navigation.navigate("DebtManage");
              ToastUtils.showSuccessToast(
                replacePatternString(
                  I18n.t("add_debt_success"),
                  `"${this.state.note.trim()}"`
                )
              );

            } else if (data && data.code) {
              this.setState({ loading: false, errPhone: data.msg });
            } else {
              this.setState({ loading: false });
            }
            this.setState({ loading: false });
          }
        }
      });
    } else {
      const requestObj = {
        tradingDate: this.state.tradingDate.unix(),
        amount: revertFormatMoney(this.state.totalAmount),
        type: this.state.type,
        status: this.state.status,
        note: this.state.note.trim(),
        id: this.state.id
      };
      this.setState({
        loading: true
      });
      createDebt(requestObj, (err, data) => {
        console.log("Staff List Err", err);
        console.log("Staff List Data", data);
        if (data) {
          if (data.httpHeaders) {
            if (data.httpHeaders.status === 200) {
              const { getDebtBookInfo } = this.props;
              getDebtBookInfo();
              this.props.navigation.navigate("DebtManage");
              ToastUtils.showSuccessToast(
                replacePatternString(
                  I18n.t("update_debt_success"),
                  `"${this.state.note.trim()}"`
                )
              );
            }
          }
        } else if (data && data.code) {
          this.setState({ loading: false, errPhone: data.msg });
        } else {
          this.setState({ loading: false });
        }
        this.setState({ loading: false });
      });
    }
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
  _handleOnPressSwitch = () => {
    this.setState({ status: !this.state.status, disabledSave: false });
  };

  _renderSwitch = () => {
    if (this.state.id) {
      return (
        <View className="row-space-between white pv8 ph24">
          <Text style={styles.txtLabelSwitch}>
            {this.state.type == 0
              ? I18n.t("debt_collected")
              : I18n.t("debt_paid")}
          </Text>
          <Switch
            enable={this.state.status}
            onPress={this._handleOnPressSwitch}
          />
        </View>
      );
    } else {
      return <View />;
    }
  };
  _handleOnPressRightToolbar=()=>{
    if(this.state.id){
      this._handleOnPressDelete()
    }else{
      this.props.navigation.goBack()
    }
  }
  _handleOnPressDelete=()=>{
    const warnMessage = replacePatternString(
      I18n.t("warn_delete_cost"),
      `"${this.state.note}"`
    );
    this.setState(
      {
        popupDeleteDebtContent: warnMessage
      },
      () => {
        this.popupDeleteDebt && this.popupDeleteDebt.open();
      }
    );
}
_deleteDebt = () => {
  this.setState({
    loading: true,
  });
  const { deleteDebt } = this.props;
  deleteDebt(this.state.id, (err, data) => {
    console.log(data);
    if (chainParse(data, ["updated", "result"])) {
      // this._load();
      const { getDebtBookInfo } = this.props;
              const objRequest = {
                beginDate: -1,
                endDate: -1,
                type: this.state.type,
                status: this.state.status,
                pageSize: 10,
                page: 1
              };
              this.props.getListDebt(objRequest, (err, data) => {
                console.log("Staff List Err", err);
                console.log("Staff List Data", data);
                this.setState({ isLoading: false, loading: false });
              });
              getDebtBookInfo();
              this.props.navigation.goBack()
              // this.props.navigation.navigate("DebtManage");
              ToastUtils.showSuccessToast(
                replacePatternString(
                  I18n.t("delete_debt_success"),
                  `"${this.state.note.trim()}"`
                )
              );
    } else if (data && data.code) {
      this.setState({ loading: false, errPhone: data.msg });
    } else {
      this.setState({ loading: false });
    }
  });
};
  
  render() {
    const enableBtn = !!(
      this.state.totalAmount &&
      this.state.note &&
      this.state.note.trim()
    );
    const id = this.props.navigation.getParam("id", "");
    return (
      <Container>
        <View style={styles.block}>
          <LoadingModal visible={this.state.loading} />
          <PopupConfirm
              ref={ref => (this.popupDeleteDebt = ref)}
              content={this.state.popupDeleteDebtContent}
              onPressYes={this._deleteDebt}
              onPressNo={() => (this.selectedCostId = "")}
            />
          <Toolbar
            title={
              this.state.id
                ? I18n.t("update_debt")
                : this.state.type == 0
                ? I18n.t("add_debt_receivable")
                : I18n.t("add_debt_payable")
            }
            onPressRight={this._handleOnPressRightToolbar}
            rightText={this.state.id ? I18n.t("delete"): I18n.t("cancel")}
          />
          <KeyboardAwareScrollView
            bounces={false}
            keyboardShouldPersistTaps={"handled"}
          >
            <TitleRowInput
            editable={!this.state.status}
              title={I18n.t("money_amount")}
              onChangeText={this._handleOnChangeTextAmount}
              style={{ marginTop: 38 }}
              value={formatMoney(this.state.totalAmount)}
              keyboardType="number-pad"
              maxLength={MAX_LENGTH_TOTAL_AMOUNT}
              editable={!this.state.status}
            />
            <TitleRowInput
              title={I18n.t("note")}
            editable={!this.state.status}

              style={{ marginTop: 10, height: 90 }}
              height={90}
              onChangeText={this._handleOnChangeTextNote}
              value={this.state.note}
              maxLength={MAX_LENGTH_NOTE_COST}
              numberOfLines={3}
              multiline={true}
              editable={!this.state.status}
              styleTextInput={{ height: 48, textAlignVertical: "top" }}
            />
            <DateInput

            disabledEdit={this.state.status}
              value={this.state.tradingDate}
              title={I18n.t("time")}
              style={{ marginTop: 10 }}
              onChange={this._handleOnChangeDate}
            />
            <View className="space24" />
            {this._renderSwitch()}
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
      timeDate: timeDateCostSelecttor(state)
    };
  },
  {deleteDebt, getDebtBookInfo, createDebt,getListDebt,getDebtDetail }
)(AddDebt);
