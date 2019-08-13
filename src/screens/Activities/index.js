import React, { Component } from "react";
import {
  FlatList,
  TouchableOpacity,
  Image,
  SectionList,
  StatusBar,
  Platform
} from "react-native";
import {
  Container,
  Toolbar,
  SearchInput,
  View,
  Text
} from "~/src/themesnew/ThemeComponent";
import DateRangePicker from "~/src/components/DateRangePicker";
import { COLORS } from "~/src/themesnew/common";
import {
  PopupConfirm,
  PopupConfirmImage
} from "~/src/themesnew/ThemeComponent";
import { getOrderDetail } from "~/src/store/actions/order";
import { getCostInfo } from "~/src/store/actions/costManage";
import { getDebtDetail } from "~/src/store/actions/debtManage";
import I18n from "~/src/I18n";
import { connect } from "react-redux";
import { formatList } from "~/src/utils";
import { getActivitiesRecent } from "~/src/store/actions/home";
import ActivityItem from "~/src/components/ActivityItem";
import styles from "./styles";
import { activitiesSelector } from "~/src/store/selectors/home";
import imgBack from "~/src/image/arrow_longleft.png";
import imgFilter from "~/src/image/imgFilter.png";
import imgDelete from "~/src/image/delete2.png";
import imgAdd from "~/src/image/imgAdd.png";
import imgSearch from "~/src/image/search.png";

class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleDateInput: true,
      popupEmptyItemContent: ""
    };
  }
  _loadActivitiesRecent = (page = 1) => {
    const { getActivitiesRecent } = this.props;
    getActivitiesRecent(page, (err, data) => {
      console.log("Staff List Err", err);
      console.log("Staff List Data", data);
    });
  };
  componentDidMount() {
    StatusBar.setBarStyle("dark-content");
    if (Platform.OS == "android") {
      StatusBar.setBackgroundColor(COLORS.WHITE);
    }
    this._loadActivitiesRecent();
  }
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
        <TouchableOpacity
          onPress={() =>
            this.setState({
              visibleDateInput: true
            })
          }
        >
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
  _renderHeader = ({ section: { title } }) => {
    return (
      <View style={styles.viewHeaderList}>
        <Text style={{ fontWeight: "bold" }}>
          {title}
          {/* {moment(title * 1000).format(I18n.t("date_format"))} */}
        </Text>
      </View>
    );
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
  _handleOnPressItemActivity = item => {
    switch (item.title) {
      case "ORDER": {
        this.setState({ loading: true });
        const { getOrderDetail } = this.props;
        getOrderDetail(item.refId, (err, data) => {
          // console.log(data)
          if (data) {
            if (data.order.status && data.order.status == -1) {
              this.setState(
                {
                  loading: false,
                  popupEmptyItemContent: I18n.t("order_has_been_delete")
                },
                () => {
                  this.popupEmptyItem && this.popupEmptyItem.open();
                }
              );
            } else {
              this.setState({ loading: false });

              this.props.navigation.navigate("OrderDetail", {
                orderId: item.refId
              });
            }
          }
        });

        break;
      }
      case "P_ORDER": {
        this.setState({ loading: true });
        const { getCostInfo } = this.props;
        getCostInfo(item.refId, (err, data) => {
          // console.log(data)
          if (data) {
            if (data.pOrder && data.pOrder.status == -1) {
              this.setState(
                {
                  loading: false,
                  popupEmptyItemContent: I18n.t("cost_has_been_delete")
                },
                () => {
                  this.popupEmptyItem && this.popupEmptyItem.open();
                }
              );
            } else {
              this.setState({ loading: false });
              this.props.navigation.navigate("AddCost", {
                tradingDate: item.tradingDate,
                totalAmount: item.amount,
                status: "info",
                id: item.refId
              });
            }
          }
        });
        break;
      }
      case "DEBT": {
        this.setState({ loading: true });
        const { getDebtDetail } = this.props;
        getDebtDetail(item.refId, (err, data) => {
          // console.log(data)
          if (data) {
            if (data.status && data.status == -1) {
              this.setState(
                {
                  loading: false,
                  popupEmptyItemContent: I18n.t("debt_has_been_delete")
                },
                () => {
                  this.popupEmptyItem && this.popupEmptyItem.open();
                }
              );
            } else {
              this.setState({ loading: false });

              this.props.navigation.navigate("AddDebt", {
                tradingDate: item.tradingDate,
                note: item.action,
                totalAmount: item.amount,
                status: "info",
                id: item.refId
              });
            }
          }
        });
        break;
      }
    }
    //   this.setState({loading:false},()=>{
    //       this
    //   })
  };
  render() {
    const { activitiesList } = this.props;
    const dataContent = activitiesList || [];
    return (
      <Container>
        <Toolbar title={I18n.t("all_activity")} />
        <PopupConfirmImage
          ref={ref => (this.popupEmptyItem = ref)}
          content={this.state.popupEmptyItemContent}
          onPressYes={this._deleteCost}
          onPressNo={() => (this.selectedCostId = "")}
        />
        <SectionList
          onRefresh={this._refresh}
          refreshing={this.state.isLoading}
          sections={formatList(activitiesList, "tradingDate")}
          onEndReached={this._loadMore}
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => (
            <ActivityItem
              key={item.id}
              item={item}
              onPress={item => this._handleOnPressItemActivity(item)}
            />
          )}
          keyExtractor={(item, index) => item.id + "" + index}
          renderSectionHeader={this._renderHeader}
        />
      </Container>
    );
  }
}
export default connect(
  state => ({
    activitiesList: activitiesSelector(state)
  }),
  {
    getActivitiesRecent,
    getOrderDetail,
    getDebtDetail,
    getCostInfo
  }
)(Activities);
