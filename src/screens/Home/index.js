import React, { Component } from "react";
import {
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  AppState,
  Image,
  Platform,
  FlatList
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { setHome, getActivitiesRecent } from "~/src/store/actions/home";
import { updateOrderOfflineTab } from "~/src/store/actions/order";
import { connect } from "react-redux";
import { COLORS, SURFACE_STYLES } from "~/src/themesnew/common";
import {
  PopupConfirm,
  PopupConfirmImage
} from "~/src/themesnew/ThemeComponent";
// import { PopupChoose } from "~/src/themesnew/ThemeComponent";

import { Container, View, Text } from "~/src/themesnew/ThemeComponent";
import { FORM_MODE, ORDER_TAB } from "~/src/constants";
import I18n from "~/src/I18n";
import {
  getListMerchant,
  syncMenuFromNetwork
} from "~/src/store/actions/merchant";
import { merchantSelector } from "~/src/store/selectors/merchant";
import { formatMoney, chainParse, sha256, getWidth } from "~/src/utils";
import { getProductListDiscount } from "~/src/store/actions/product";
import { discountProductListSelector } from "~/src/store/selectors/product";
import { getStatistic } from "~/src/store/actions/home";
import {
  statisticSelector,
  activitiesSelectorHome
} from "~/src/store/selectors/home";
import { getOrderDetail } from "~/src/store/actions/order";
import { getCostInfo } from "~/src/store/actions/costManage";
import { getDebtDetail } from "~/src/store/actions/debtManage";
import Header from "~/src/screens/Home/Header";
import { getNumberUnreadNotification } from "~/src/store/actions/notification";
import { isEmployeeSelector } from "~/src/store/selectors/permission";
import { getPermission } from "~/src/store/actions/permission";
import { userInfoSelector } from "~/src/store/selectors/auth";
import {
  checkAndSyncMasterData,
  startCheckSyncOrder,
  stopCheckSyncOrder,
  syncOrderData
} from "~/src/store/actions/backgroundSync";
import { logout } from "~/src/store/actions/common";
import { getUserInfo, updateTokenInfo } from "~/src/store/actions/auth";
import styles from "./styles";
import HomeGuide from "~/src/components/HomeGuide";
import ActivityItem from "~/src/components/ActivityItem";
import imgAddCost from "~/src/image/home/imgAddCost.png";
import imgAddOrder from "~/src/image/home/imgAddOrder.png";
import imgArrowRight from "~/src/image/home/imgArrowRight.png";
import imgChevronRight from "~/src/image/chevron_right_gray.png";
import ToastUtils from "~/src/utils/ToastUtils";
import LoadingModal from "~/src/components/LoadingModal";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      appState: AppState.currentState,
      visibleGuide: false,
      popupEmptyItemContent: "",
      loading: false
    };
    this.didFocusListener = props.navigation.addListener(
      "didFocus",
      this.componentDidFocus
    );
  }

  _load = (refreshing = false) => {
    const {
      getListMerchant,
      getProductListDiscount,
      getStatistic,
      getUserInfo,
      userInfo,
      getPermission,
      logout,
      getNumberUnreadNotification
    } = this.props;
    if (refreshing) {
      this.setState({ refreshing: true });
    }
    getListMerchant((err, data) => {
      console.log("List Merchant Err", err);
      console.log("List Merchant Data", data);
      this.setState({ refreshing: false }, () => {
        let merchantId = chainParse(this.props, [
          "merchantInfo",
          "merchant",
          "id"
        ]);
        getUserInfo((err, data) => {
          console.log("getUserInfo err", err);
          console.log("getUserInfo data", data);
        });

        if (merchantId) {
          getProductListDiscount(merchantId, (err, data) => {
            console.log("ProductListDiscount Err", err);
            console.log("ProductListDiscount Data", data);
          });
          getStatistic(merchantId, (err, data) => {
            console.log("getStatistic Err", err);
            console.log("getStatistic Data", data);
          });
          getPermission(merchantId, userInfo.userId, (err, data) => {
            console.log("getPermission err", err);
            console.log("getPermission data", data);
          });
          getNumberUnreadNotification(merchantId, (err, data) => {
            console.log("getNumberUnreadNotification err", err);
            console.log("getNumberUnreadNotification data", data);
          });
        }
      });
    });
  };

  componentDidFocus = async () => {
    StatusBar.setBarStyle("light-content");
    if (Platform.OS == "android") {
      StatusBar.setBackgroundColor(COLORS.CERULEAN);
    }
    console.log("Home Did Focus");
    this._load();
    this._loadActivitiesRecent();
  };

  _checkGuide = () => {
    AsyncStorage.getItem("guide", (err, result) => {
      if (result && result == "false") {
        this.setState({
          visibleGuide: true
        });
      } else {
        this.setState({
          visibleGuide: false
        });
      }
    });
  };

  _loadActivitiesRecent = (page = 1) => {
    const { getActivitiesRecent } = this.props;
    getActivitiesRecent(page, (err, data) => {
      console.log("Staff List Err", err);
      console.log("Staff List Data", data);
    });
  };

  componentDidMount = async () => {
    this._checkGuide();
    this._loadActivitiesRecent();
    const {
      startCheckSyncOrder,
      checkAndSyncMasterData,
      syncOrderData,
      userInfo,
      updateTokenInfo
    } = this.props;
    console.log("User Info", userInfo);
    if (userInfo.firebaseToken) {
      updateTokenInfo(userInfo.firebaseToken, (err, data) => {
        console.log("updateTokenInfo err", err);
        console.log("updateTokenInfo data", data);
      });
    }
    startCheckSyncOrder();
    syncOrderData();
    checkAndSyncMasterData();
    AppState.addEventListener("change", this._handleAppStateChange);
  };
  _handleAppStateChange = nextAppState => {
    const {
      startCheckSyncOrder,
      stopCheckSyncOrder,
      checkAndSyncMasterData,
      syncOrderData
    } = this.props;
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to active!");
      startCheckSyncOrder();
      syncOrderData();
      checkAndSyncMasterData();
    } else if (
      this.state.appState == "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      console.log("App has come to inactive!");
      stopCheckSyncOrder();
    }
    this.setState({ appState: nextAppState });
    ToastUtils.hideForceUpdate();
  };

  componentWillUnmount = async () => {
    const { stopCheckSyncOrder } = this.props;
    stopCheckSyncOrder();
    AppState.removeEventListener("change", this._handleAppStateChange);
  };

  _onRefresh = () => {
    this._load(true);
  };

  _handlePressAddCost = () => {
    this.props.navigation.navigate("AddCost");
  };

  _handlePressCreateOrder = () => {
    this.props.navigation.navigate("CreateOrder");
  };

  _handleOnPressDoneGuide = () => {
    AsyncStorage.setItem("guide", "true");

    this.setState({ visibleGuide: false });
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
                this.setState({loading:false})

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
                this.setState({loading:false})
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
                this.setState({loading:false})

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

  _renderEmptyRecentActivities = () => {
    return (
      <View className="column-center white">
        <View className="space16" />
        <Image
          source={require("~/src/image/no_activity.png")}
          style={{ width: getWidth(250), height: getWidth(153) }}
        />
        <View className="space12" />
        <Text className="bold gray">{I18n.t("no_activity")}</Text>
        <View className="space40" />
      </View>
    );
  };

  render() {
    const { isEmployee, activitiesList } = this.props;

    return (
      <Container blue>
        <View className="flex background">
          <LoadingModal visible={this.state.loading} />

          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={this._onRefresh}
                refreshing={this.state.refreshing}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            <PopupConfirmImage
              ref={ref => (this.popupEmptyItem = ref)}
              content={this.state.popupEmptyItemContent}
              onPressYes={this._deleteCost}
              onPressNo={() => (this.selectedCostId = "")}
            />

            <Header />
            <View style={styles.viewOption}>
              {!isEmployee ? (
                <View className="row-space-between mh8">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this._handlePressCreateOrder}
                  >
                    <View style={styles.viewButton}>
                      <Image source={imgAddOrder} style={styles.iconButton} />
                      <Text style={styles.txtlableButton}>
                        {I18n.t("create_bill")}
                      </Text>
                      <Image
                        source={imgArrowRight}
                        style={styles.imgArrowRight}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this._handlePressAddCost}
                  >
                    <View style={styles.viewButton}>
                      <Image source={imgAddCost} style={styles.iconButton} />
                      <Text style={styles.txtlableButton}>
                        {I18n.t("add_cost")}
                      </Text>
                      <Image
                        source={imgArrowRight}
                        style={styles.imgArrowRight}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="row-space-between mh8">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this._handlePressCreateOrder}
                    style={{ flex: 1 }}
                  >
                    <View style={styles.viewButtonFull}>
                      <Image source={imgAddOrder} style={styles.iconButton} />
                      <Text style={styles.txtlableButton}>
                        {I18n.t("create_bill")}
                      </Text>
                      <Image
                        source={imgArrowRight}
                        style={styles.imgArrowRight}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* <TouchableOpacity style={{ marginTop: 24, width: "100%" }}> */}
            <View
              className="ph24 row-start pv16 border-bottom"
              style={{
                justifyContent: "space-between",
                backgroundColor: COLORS.WHITE,
                borderRadius: 6,
                marginTop: 24
              }}
            >
              <Text style={styles.titleActivities}>
                {I18n.t("activities_recent").toUpperCase()}
              </Text>
              {activitiesList && activitiesList.length > 0 && (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Activities")}
                >
                  <View className="row-start" style={{ alignItem: "center" }}>
                    <Text style={styles.txtSeeAll}>{I18n.t("view_all")}</Text>
                    <Image
                      source={imgChevronRight}
                      style={{ width: 6, height: 10, marginLeft: 6 }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
            {/* </TouchableOpacity> */}
            {activitiesList && activitiesList.length > 0 ? (
              <FlatList
                // numColumns={5}
                keyExtractor={item => item.id}
                data={activitiesList}
                renderItem={({ item }) => (
                  <ActivityItem
                    key={item.id}
                    item={item}
                    onPress={item => this._handleOnPressItemActivity(item)}
                  />
                )}
              />
            ) : (
              this._renderEmptyRecentActivities()
            )}

            <View style={SURFACE_STYLES.space50} />
          </ScrollView>
        </View>
        <HomeGuide
          visible={this.state.visibleGuide}
          onPressDone={this._handleOnPressDoneGuide}
        />
      </Container>
    );
  }
}

export default connect(
  state => ({
    merchantInfo: merchantSelector(state),
    discountProductList: discountProductListSelector(state),
    statistic: statisticSelector(state),
    isEmployee: isEmployeeSelector(state),
    userInfo: userInfoSelector(state),
    // activitiesList: activitiesSelector(state)
    activitiesList: activitiesSelectorHome(state)
  }),
  {
    setHome,
    getActivitiesRecent,
    getListMerchant,
    getProductListDiscount,
    getStatistic,
    getNumberUnreadNotification,
    updateOrderOfflineTab,
    getPermission,
    checkAndSyncMasterData,
    startCheckSyncOrder,
    stopCheckSyncOrder,
    syncOrderData,
    syncMenuFromNetwork,
    logout,
    getUserInfo,
    updateTokenInfo,
    getOrderDetail,
    getDebtDetail,
    getCostInfo
  }
)(Home);
