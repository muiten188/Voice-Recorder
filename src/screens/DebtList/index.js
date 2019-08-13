import React, { Component } from "react";
import I18n from "~/src/I18n";
import {
  TouchableOpacity,
  SectionList,
  Image,
  StatusBar,
  Platform
} from "react-native";
import EmptyList from "~/src/components/EmptyList";

import styles from "./styles";
import DebtItem from "~/src/components/DebtItem";
import DateRangePicker from "~/src/components/DateRangePicker";
import LoadingModal from "~/src/components/LoadingModal";
import { withNavigation } from "react-navigation";

import { COLORS } from "~/src/themesnew/common";
import { SearchInput } from "~/src/themesnew/ThemeComponent";
import lodash from "lodash";

import {
  getListDebt,
  searchDebt,
  deleteDebt,
  getDebtBookInfo
} from "~/src/store/actions/debtManage";
import { connect } from "react-redux";
import {
  chainParse,
  formatList,
  replacePatternString,
  formatMoney
} from "~/src/utils";
import imgSearch from "~/src/image/search.png";
import {
  PopupConfirm,
  View,
  Text,
  Container,
  Toolbar
} from "~/src/themesnew/ThemeComponent";
import ToastUtils from "~/src/utils/ToastUtils";

import imgBack from "~/src/image/arrow_longleft.png";
import imgFilter from "~/src/image/imgFilter.png";
import imgDelete from "~/src/image/delete2.png";
import imgAdd from "~/src/image/imgAdd.png";
import {
  costManageListSelector,
  timeDateCostSelecttor
} from "~/src/store/selectors/costManage";
import { debtBookInfoSelector } from "~/src/store/selectors/debtManage";

import {
  debtManageListSelector,
  debtListSearchSelector
} from "~/src/store/selectors/debtManage";
const initialState = {
  data: [1, 2],
  errTime: "",
  isFilter: false,
  visibleButtonClear: false,
  visibleDateInput: true,
  startTimeRequest: -1,
  endTimeRequest: -1,
  isLoading: false,
  valueSearch: "",
  errTime: "",
  errFromDate: "",
  isChangeDate: false,
  errToDate: "",
  fromAmountDebt: "",
  toAmountDebt: "",
  fromAmountDebtRequest: 0,
  toAmountDebtRequest: 999999999999,
  errFromAmount: "",
  errToAmount: "",
  showDelete: false,
  popupDeleteDebtContent: "",
  selectedDebtId: "",
  selectedDebtNote: "",
  loading: false,
  title: "",
  mode: "",
  status: "",
  type: "",
  nameList: "",
  totalAmount: "",
  startTime: "",
  endTime: ""
};
class DebtList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: I18n.t("manage_cost")
    };
  };
  constructor(props) {
    super(props);

    this.state = initialState;

    this.didFocusListener = props.navigation.addListener(
      "didFocus",
      this.componentDidFocus
    );
  }
  _renderHeader = ({ section: { title } }) => {
    return (
      <View style={styles.viewHeaderList}>
        <Text style={{ fontSize: 12, lineHeight: 14, color: COLORS.TEXT_GRAY }}>
          {title}
          {/* {moment(title * 1000).format(I18n.t("date_format"))} */}
        </Text>
      </View>
    );
  };
  _handleOnPressDeleteItem = item => {
    this.setState({
      selectedDebtId: item.id,
      selectedDebtNote: item.note
    });
    const warnMessage = replacePatternString(
      I18n.t("warn_delete_cost"),
      `"${item.note}"`
    );
    this.setState(
      {
        popupDeleteDebtContent: warnMessage
      },
      () => {
        this.popupDeleteDebt && this.popupDeleteDebt.open();
      }
    );
  };
  _renderItem = ({ item, index }) => (
    <DebtItem
      showDelete={this.state.showDelete}
      onPressDelete={() => this._handleOnPressDeleteItem(item)}
      key={item.id}
      onPress={() => this._handleOnPressItem(item)}
      timeDate={item.tradingDate}
      type={item.type}
      status={item.status}
      note={item.note}
      totalAmount={item.amount}
    />
  );
  _getNameList = (status, type) => {
    if (type == 0) {
      if (status == 0) {
        this.setState({
          nameList: "debtReceivableList"
        });
      } else {
        this.setState({
          nameList: "debtCollectedList"
        });
      }
    } else {
      if (status == 0) {
        this.setState({
          nameList: "debtPayableList"
        });
      } else {
        this.setState({
          nameList: "debtPaidList"
        });
      }
    }
  };
  _load(page = 1) {
    this.setState({
      isLoading: true
    });
    if (this.state.valueSearch || this.state.endTimeRequest != -1) {
      this._searchDebt(this.state.valueSearch);
      return;
    }
    const objRequest = {
      beginDate: this.state.startTimeRequest,
      endDate: this.state.endTimeRequest,
      type: this.state.type,
      status: this.state.status,
      pageSize: 10,
      page: page
    };
    this.props.getListDebt(objRequest, (err, data) => {
      console.log("Staff List Err", err);
      console.log("Staff List Data", data);
      this.setState({ isLoading: false, loading: false });
    });
    this.props.getDebtBookInfo((err, data) => {
      console.log("Staff List Err", err);
      console.log("Staff List Data", data);
      this.setState({ isLoading: false, loading: false });
    });
  }

  componentDidFocus = () => {
    StatusBar.setBarStyle("dark-content");
    if (Platform.OS == "android") {
      StatusBar.setBackgroundColor(COLORS.WHITE);
    }
    // this.setState(initialState);
    // this.componentDidMount();
  };
  _loadTitle = () => {};
  componentDidMount() {
    this._loadTitle();

    const { timeDate } = this.props;
    // this._load();
    const mode = this.props.navigation.getParam("mode", "");
    const title = this.props.navigation.getParam("name", "");
    const status = this.props.navigation.getParam("status", "");
    const type = this.props.navigation.getParam("type", "");
    const totalAmount = this.props.navigation.getParam("totalAmount", "");
    this.setState(
      {
        mode,
        title,
        status,
        type,
        totalAmount
      },
      () => this._load()
    );
  }
  _refresh = () => {
    this._load();
  };
  _handleAddDebt = () => {
    this.props.navigation.navigate("AddDebt", {
      mode: "add",
      type: this.state.type
    });
  };

  _handleChangeFromDate = startTime => {
    console.log("FromDate", startTime);
    if (this.state.endTime) {
      this.setState(
        {
          startTime: startTime.startOf("day"),
          errTime: "",
          isChangeDate: true,
          visibleButtonClear: true,
          isFilter: true
        },
        this._updateFilter
      );
    } else {
      this.setState(
        {
          startTime: startTime.startOf("day"),
          errTime: "",
          isChangeDate: true,
          endTime: startTime.endOf("day"),
          visibleButtonClear: true,
          isFilter: true
        },
        this._updateFilter
      );
    }
  };
  _handleChangeToDate = endTime => {
    console.log("ToDate", endTime);
    if (this.state.startTime) {
      this.setState(
        {
          endTime: endTime.endOf("day"),
          errTime: "",
          isChangeDate: true,
          visibleButtonClear: true,
          isFilter: true
        },
        this._updateFilter
      );
    } else {
      this.setState(
        {
          endTime: endTime.endOf("day"),
          errTime: "",
          isChangeDate: true,
          startTime: endTime.startOf("day"),
          visibleButtonClear: true,
          isFilter: true
        },
        this._updateFilter
      );
    }
  };
  _handleOnPressItem = item => {
    if (!this.state.showDelete) {
      this.props.navigation.navigate("AddDebt", {
        tradingDate: item.tradingDate,
        note: item.note,
        totalAmount: item.amount,
        mode: "info",
        id: item.id,
        type: item.type,
        status: item.status
      });
      console.log("d");
    }
  };
  _loadMore = () => {
    if (this.state.isLoading) return;
    else {
      const pageNumber = +chainParse(this.props, [
        this.state.nameList,
        "pagingInfo",
        "pageNumber"
      ]);
      const totalPages = +chainParse(this.props, [
        this.state.nameList,
        "totalPages"
      ]);
      if (pageNumber >= totalPages) return;
      this._load(pageNumber + 1);
    }
  };
  _searchDebt = lodash.debounce((note, page = 1) => {
    const requestObj = {
      fromDate: this.state.startTimeRequest,
      toDate: this.state.endTimeRequest,
      type: this.state.type,
      status: this.state.status,
      note: note,
      //   fromAmount: this.state.fromAmountDebtRequest,
      //   toAmount: this.state.toAmountDebtRequest,
      pageSize: 10,
      page: page
    };
    this.props.searchDebt(requestObj, (err, data) => {
      // this._load()
      this.setState({
        isLoading: false
        // startTime:this.state.startTime.subtract(-1,"day"),
        // endTime:this.state.endTime.subtract(-1,"day")
      });
    });
  }, 300);
  _handleChangeTextSearch = text => {
    this.setState({
      valueSearch: text
    });
    this._searchDebt(text);
  };
  _handleOnPressFilter = () => {
    this.popupFilterSearch && this.popupFilterSearch.open();
  };

  _updateFilter = () => {
    this.setState(
      {
        startTimeRequest: this.state.startTime
          ? this.state.startTime.unix()
          : -1,
        endTimeRequest: this.state.endTime ? this.state.endTime.unix() : -1,
        fromAmountDebtRequest: this.state.fromAmountDebt
          ? this.state.fromAmountDebt
          : 0,
        toAmountDebtRequest: this.state.toAmountDebt
          ? this.state.toAmountDebt
          : 999999999999
      },
      () => this._searchDebt(this.state.valueSearch)
    );
  };
  _handleOnPressCleanTextSearch = () => {
    this.setState(
      {
        valueSearch: ""
      },
      () => this._load()
    );
  };
  _handleOnCloseDate = () => {
    this.setState(
      {
        startTime: "",
        endTime: "",
        errToDate: "",
        errFromDate: "",
        startTimeRequest: -1,
        endTimeRequest: -1,
        visibleButtonClear: false,
        isFilter: false
      },
      () => this._searchDebt(this.state.valueSearch)
    );
  };

  _renderButtonSearch = () => {
    if (this.state.visibleDateInput) {
      return (
        <TouchableOpacity
          style={{ marginLeft: "auto", paddingVertical: 16, marginRight: 16 }}
          onPress={() =>
            this.setState({
              visibleDateInput: false
            })
          }
        >
          {/* <View style={styles.btnSearch}> */}
          <Image source={imgSearch} style={{ width: 24, height: 24 }} />
          {/* </View> */}
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }
  };
  _handleOnPressBack = () => {
    this._handleOnPressCleanTextSearch();
    this.setState({
      visibleDateInput: true
    });
  };
  _renderButtonBack = () => {
    if (!this.state.visibleDateInput) {
      return (
        <TouchableOpacity onPress={this._handleOnPressBack}>
          <View style={styles.btnBack}>
            <Image source={imgBack} style={{ width: 24, height: 24 }} />
          </View>
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }
  };
  _renderImageFilter = () => {
    if (this.state.isFilter) {
      return (
        <View
          style={{
            height: 48,
            justifyContent: "center",
            marginLeft: 13,
            marginRight: 16
          }}
        >
          <Image source={imgFilter} style={{ width: 24, height: 24 }} />
        </View>
      );
    } else {
      return <View />;
    }
  };
  _deleteDebt = () => {
    this.setState({
      loading: true,
      showDelete: false
    });
    const { deleteDebt } = this.props;
    deleteDebt(this.state.selectedDebtId, (err, data) => {
      console.log(data);
      if (chainParse(data, ["updated", "result"])) {
        this._load();
        ToastUtils.showSuccessToast(
          replacePatternString(
            I18n.t("delete_debt_success"),
            `"${this.state.selectedDebtNote}"`
          )
        );
      } else if (data && data.code) {
        this.setState({ loading: false, errPhone: data.msg });
      } else {
        this.setState({ loading: false });
      }
    });
  };
  _handleOnPressDelete = () => {
    if (this.state.showDelete === true) {
      this.setState({
        showDelete: false
      });
    } else {
      this.setState({
        showDelete: true
      });
    }
  };
  _renderTotalAmount = () => {
    const { debtBookInfo } = this.props;
    const receivables =
      debtBookInfo && typeof debtBookInfo.debtReceivable != "undefined"
        ? debtBookInfo.debtReceivable
        : "";
    const payable =
      debtBookInfo && typeof debtBookInfo.debtPayable != "undefined"
        ? debtBookInfo.debtPayable
        : "";
    if (
      this.state.status == 0 &&
      this.state.endTimeRequest == -1 &&
      this.state.valueSearch == ""
    ) {
      return (
        <View
          className="ph24 pv16 white row-start"
          style={{ justifyContent: "space-between" }}
        >
          <Text style={styles.txtTotal}>{I18n.t("total")}</Text>
          <Text style={styles.txtTotalAmount}>
            {formatMoney(this.state.type == 0 ? receivables : payable)}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  };
  _renderButtonAdd = () => {
    if (this.state.type == 0 && this.state.status == 0) {
      return (
        <TouchableOpacity onPress={this._handleAddDebt}>
          <View
            style={[styles.btnAdd, { backgroundColor: COLORS.TEXT_RECEIVABLE }]}
          >
            <Image source={imgAdd} style={styles.imgAdd} />
            <Text style={styles.labelButton}>{I18n.t("add_debt")}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      if (this.state.status == 1) {
        return <View />;
      } else {
        return (
          <TouchableOpacity onPress={this._handleAddDebt}>
            <View style={styles.btnAdd}>
              <Image source={imgAdd} style={styles.imgAdd} />
              <Text style={styles.labelButton}>{I18n.t("add_debt")}</Text>
            </View>
          </TouchableOpacity>
        );
      }
    }
  };
  _renderContent = () => {
    if (this.state.valueSearch || this.state.startTimeRequest!=-1) {
      const { debtListSearch } = this.props;
      debtListContent =
        debtListSearch && debtListSearch.content ? debtListSearch.content : [];
      return (
        <SectionList
          onRefresh={this._refresh}
          refreshing={this.state.isLoading}
          sections={formatList(debtListContent, "tradingDate")}
          onEndReached={this._loadMore}
          onEndReachedThreshold={0.2}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.id + "" + index}
          renderSectionHeader={this._renderHeader}
        />
      );
    } else {
      const { debtList } = this.props;
      const debtListContent =
        debtList && debtList.content ? debtList.content : [];
      if (debtListContent.length != 0) {
        return (
          <SectionList
            onRefresh={this._refresh}
            refreshing={this.state.isLoading}
            sections={formatList(debtListContent, "tradingDate")}
            onEndReached={this._loadMore}
            onEndReachedThreshold={0.2}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => item.id + "" + index}
            renderSectionHeader={this._renderHeader}
          />
        );
      } else {
        if (this.state.type == 0 && this.state.status == 0) {
          return (
            <EmptyList
              title={I18n.t("empty_debt_receivable")}
              guide={I18n.t("guide_debt_receivable")}
            />
          );
        } else if (this.state.type == 1 && this.state.status == 0) {
          return (
            <EmptyList
              title={I18n.t("empty_debt_payable")}
              guide={I18n.t("guide_debt_payable")}
            />
          );
        }
      }
    }
    // console.log(this.state.startTime, this.state.endTime);
    //  else {
    //   if (
    //     this.state.valueSearch ||
    //     this.state.startTimeRequest != -1 ||
    //     this.state.loading
    //   )
    //     return <View />;
    //   else {
    //      else {
    //       return <View />;
    //     }
    //   }
    // }
  };
  render() {
    const enablePayBtn = this.state.startTime && this.state.endTime;

    return (
      <Container>
        <Toolbar title={this.state.title} />
        <View style={styles.container}>
          <View style={{ flexDirection: "row", width: "100%" }}>
            <LoadingModal visible={this.state.loading} />

            <PopupConfirm
              ref={ref => (this.popupDeleteDebt = ref)}
              content={this.state.popupDeleteDebtContent}
              onPressYes={this._deleteDebt}
              onPressNo={() => (this.selectedCostId = "")}
            />
            <View style={styles.viewSearch}>
              <View style={{ flex: this.state.visibleDateInput ? 1 : 0 }}>
                <DateRangePicker
                  startDate={this.state.startTime}
                  endDate={this.state.endTime}
                  onChangeStartDate={this._handleChangeFromDate}
                  onChangeEndDate={this._handleChangeToDate}
                  visible={this.state.visibleDateInput}
                  onPressClose={this._handleOnCloseDate}
                  visibleButtonClear={this.state.visibleButtonClear}
                />
              </View>
              {this._renderButtonBack()}
              <SearchInput
                label={I18n.t("search_debt")}
                value={this.state.valueSearch}
                onChangeText={this._handleChangeTextSearch}
                visible={!this.state.visibleDateInput}
                onPressClear={this._handleOnPressCleanTextSearch}
              />

              {this._renderButtonSearch()}
              <TouchableOpacity
                style={{ marginLeft: "auto", marginRight: 24 }}
                onPress={this._handleOnPressDelete}
              >
                {/* <View style={styles.btnDelete}> */}
                <Image source={imgDelete} style={{ width: 24, height: 24 }} />
                {/* </View> */}
              </TouchableOpacity>
            </View>
          </View>
          {/*  */}
          {this._renderContent()}

          <View style={[{ position: "absolute", bottom: 0, width: "100%" }]}>
            <View style={{ width: "100%", alignItems: "center" }}>
              {this._renderButtonAdd()}
            </View>
            {this._renderTotalAmount()}
          </View>
        </View>
      </Container>
    );
  }
}
export default withNavigation(
  connect(
    (state, props) => {
      const status = props.navigation.getParam("status", "");
      const type = props.navigation.getParam("type", "");
      return {
        debtList: debtManageListSelector(state, type, status),
        debtBookInfo: debtBookInfoSelector(state),
        debtListSearch: debtListSearchSelector(state, type, status),
        costList: costManageListSelector(state),
        timeDate: timeDateCostSelecttor(state)
      };
    },
    { searchDebt, deleteDebt, getListDebt, getDebtBookInfo }
  )(DebtList)
);
