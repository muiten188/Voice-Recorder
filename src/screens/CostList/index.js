import React, { Component } from "react";
import I18n from "~/src/I18n";
import { Button, TouchableRipple } from "react-native-paper";
import ToastUtils from "~/src/utils/ToastUtils";
import lodash from "lodash";

import {
  TouchableOpacity,
  SectionList,
  Image,
  StatusBar,
  Platform
} from "react-native";
import EmptyList from "~/src/components/EmptyList";

import styles from "./styles";
import CostItem from "~/src/components/CostItem";
import DateRangePicker from "~/src/components/DateRangePicker";
import LoadingModal from "~/src/components/LoadingModal";
import { withNavigation } from "react-navigation";

import { COLORS } from "~/src/themes/common";
import { SearchInput, Toolbar } from "~/src/themes/ThemeComponent";
import {
  getListCost,
  searchCost,
  deleteCost,
  getTotalCost
} from "~/src/store/actions/costManage";
import { connect } from "react-redux";
import moment from "moment";
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
  Container
} from "~/src/themes/ThemeComponent";
import imgBack from "~/src/image/arrow_longleft.png";
import imgFilter from "~/src/image/imgFilter.png";
import imgDelete from "~/src/image/delete2.png";
import imgAdd from "~/src/image/imgAdd.png";
import imgDeleteActive from "~/src/image/delete_active.png";
import {
  costManageListSelector,
  timeDateCostSelecttor,
  costTotalSelector,
  costListSearchSelector
} from "~/src/store/selectors/costManage";
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
  fromAmountCost: "",
  toAmountCost: "",
  fromAmountCostRequest: 0,
  toAmountCostRequest: 999999999999,
  errFromAmount: "",
  errToAmount: "",
  showDelete: false,
  popupDeleteCostContent: "",
  selectedCostId: "",
  selectedCostNote: "",
  loading: false,
  pGroupId: "",
  title: "",
  startTime: "",
  endTime: ""
};
class CostList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
      headerMode: "none"
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
  _renderItem = ({ item, index }) => (
    <CostItem
      onPressDelete={() => this._handleOnPressDeleteItem(item)}
      showDelete={this.state.showDelete}
      key={item.id}
      onPress={() => this._handleOnPressItem(item)}
      timeDate={item.tradingDate}
      note={item.note}
      totalAmount={item.totalAmount}
    />
  );
  _load(page = 1) {
    this.setState({
      isLoading: true
    });
    this.props.getTotalCost(this.state.pGroupId);
    if (this.state.valueSearch || this.state.endTimeRequest != -1) {
      this._searchCost(this.state.valueSearch, page);
      return;
    }
    this.props.getListCost(this.state.pGroupId, page, (err, data) => {
      console.log("Staff List Err", err);
      console.log("Staff List Data", data);
      this.setState({ isLoading: false });
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

  componentDidMount() {
    const { costList } = this.props;
    console.log(costList);
    const { timeDate } = this.props;
    const pGroupId = this.props.navigation.getParam("pGroupId", "");
    const title = this.props.navigation.getParam("title", "");
    this.setState(
      {
        pGroupId,
        title
      },
      () => this._load()
    );
  }
  _refresh = () => {
    this._load();
  };
  _handleAddCost = () => {
    this.props.navigation.navigate("AddCost", {
      pGroupId: this.state.pGroupId,
      status: "add"
    });
  };
  _handleGetListCost = () => {
    if (this.state.startTime > this.state.endTime) {
      this.setState({ errTime: I18n.t("err_discount_end_time_must_large") });
      return;
    }
    if (this.state.startTime >= moment().endOf("day")) {
      this.setState({ errTime: I18n.t("err_discount_end_time_must_large") });
      return;
    }
    this.props.getListCost(this.state.pGroupId, 1, (err, data) => {
      console.log("Staff List Err", err);
      console.log("Staff List Data", data);
      this.setState({ loading: false });
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
      this.props.navigation.navigate("AddCost", {
        tradingDate: item.tradingDate,
        note: item.note,
        totalAmount: item.totalAmount,
        status: "info",
        id: item.id,
        pGroupId: this.state.pGroupId
      });
      console.log("d");
    }
  };
  _handleOnPressDeleteItem = item => {
    this.setState({
      selectedCostId: item.id
    });
    const warnMessage = replacePatternString(
      I18n.t("warn_delete_cost"),
      `"${item.note}"`
    );
    this.setState(
      {
        selectedCostNote: item.note,
        popupDeleteCostContent: warnMessage
      },
      () => {
        this.popupDeleteCost && this.popupDeleteCost.open();
      }
    );
  };
  _loadMore = () => {
    if (this.state.isLoading) return;
    else {
      const pageNumber = +chainParse(this.props, [
        "costList",
        "pagingInfo",
        "pageNumber"
      ]);
      const totalPages = +chainParse(this.props, ["costList", "totalPages"]);
      if (pageNumber >= totalPages) return;
      this._load(pageNumber + 1);
    }
  };
  _searchCost = lodash.debounce((note, page = 1) => {
    const requestObj = {
      fromDate: this.state.startTimeRequest,
      toDate: this.state.endTimeRequest,
      note: note,
      pGroupId: this.state.pGroupId,
      pageSize: 10,
      page: page
    };
    this.props.searchCost(requestObj, (err, data) => {
      this.setState({
        isLoading: false,
        loading: false
      });
    });
  }, 300);
  _handleChangeTextSearch = text => {
    this.setState({
      valueSearch: text
    });
    this._searchCost(text);
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
        fromAmountCostRequest: this.state.fromAmountCost
          ? this.state.fromAmountCost
          : 0,
        toAmountCostRequest: this.state.toAmountCost
          ? this.state.toAmountCost
          : 999999999999
      },
      () => this._searchCost(this.state.valueSearch)
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
        // loading:true
      },
      () => this._searchCost(this.state.valueSearch)
    );
  };
  _handleBack = () => {
    // this._load();
    this._handleOnPressCleanTextSearch();
    this.setState({
      visibleDateInput: true
    });
  };
  _renderTotalAmount = () => {
    const { costTotal } = this.props;
    const total = costTotal ? costTotal : 0;
    if (this.state.endTimeRequest == -1 && this.state.valueSearch == "") {
      return (
        <View
          className="ph24 pv16 white row-start"
          style={{ justifyContent: "space-between" }}
        >
          <Text style={styles.txtTotal}>{I18n.t("total")}</Text>
          <Text style={styles.txtTotalAmount}>{formatMoney(total)}</Text>
        </View>
      );
    } else {
      return <View />;
    }
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
  _renderButtonBack = () => {
    if (!this.state.visibleDateInput) {
      return (
        <TouchableOpacity onPress={this._handleBack}>
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
  _deleteCost = () => {
    this.setState({
      loading: true,
      showDelete: false
    });
    const { deleteCost,getTotalCost } = this.props;
    deleteCost(this.state.selectedCostId, (err, data) => {
      console.log(data);
      if (chainParse(data, ["updated", "result"])) {
        const { getListCost } = this.props;
        getListCost(this.state.pGroupId, 1, (err, data) => {
          ToastUtils.showSuccessToast(
            replacePatternString(
              I18n.t("delete_cost_success"),
              `"${this.state.selectedCostNote}"`
            )
          );
          getTotalCost(this.state.pGroupId)
          this.setState({ loading: false });
        });
        // this.props.getStaffList(selectedMerchantId);
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
  _renderContent = () => {
    if (this.state.valueSearch || this.state.startTimeRequest!=-1) {
      const { costListSearch } = this.props;
      const constListContent =
        costListSearch && costListSearch.content ? costListSearch.content : [];
      return (
        <SectionList
          onRefresh={this._refresh}
          refreshing={this.state.isLoading}
          sections={formatList(constListContent, "tradingDate")}
          onEndReached={this._loadMore}
          onEndReachedThreshold={0.2}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.id + "" + index}
          renderSectionHeader={this._renderHeader}
        />
      );
    } else {
      const { costList } = this.props;

      const constListContent =
        costList && costList.content ? costList.content : [];
        if (constListContent.length != 0) {
          return (
            <SectionList
              onRefresh={this._refresh}
              refreshing={this.state.isLoading}
              sections={formatList(constListContent, "tradingDate")}
              onEndReached={this._loadMore}
              onEndReachedThreshold={0.2}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => item.id + "" + index}
              renderSectionHeader={this._renderHeader}
            />
          );
        } else {
          return (
            <EmptyList
              title={I18n.t("empty_cost")}
              guide={I18n.t("guide_cost")}
            />
          );
        }
    }

  };
  _renderButtonDelete = () => {
    if (this.state.visibleDateInput) {
      return (
        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={this._handleOnPressDelete}
        >
          {/* <View style={styles.btnDelete}> */}
          <Image
            source={this.state.showDelete ? imgDeleteActive : imgDelete}
            style={{ width: 24, height: 24 }}
          />
          {/* </View> */}
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }
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
              ref={ref => (this.popupDeleteCost = ref)}
              content={this.state.popupDeleteCostContent}
              onPressYes={this._deleteCost}
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
                label={I18n.t("search_cost")}
                onChangeText={this._handleChangeTextSearch}
                value={this.state.valueSearch}
                visible={!this.state.visibleDateInput}
                onPressClear={this._handleOnPressCleanTextSearch}
              />
              {/* {this._renderImageFilter()} */}
              {this._renderButtonSearch()}
              {this._renderButtonDelete()}
            </View>
          </View>
          {this._renderContent()}
          <View style={[{ position: "absolute", bottom: 0, width: "100%" }]}>
            <View style={{ width: "100%", alignItems: "center" }}>
              <TouchableOpacity onPress={this._handleAddCost}>
                <View style={styles.btnAdd}>
                  <Image source={imgAdd} style={styles.imgAdd} />
                  <Text style={styles.labelButton}>{I18n.t("add_cost")}</Text>
                </View>
              </TouchableOpacity>
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
    state => ({
      costList: costManageListSelector(state),
      timeDate: timeDateCostSelecttor(state),
      costTotal: costTotalSelector(state),
      costListSearch: costListSearchSelector(state)
    }),
    { getListCost, searchCost, deleteCost, getTotalCost }
  )(CostList)
);
