import React, { Component } from "react";
import {
  View,
  Image,
  Platform,
  Alert,
} from "react-native";
import { TouchableRipple } from "react-native-paper";
import { connect } from "react-redux";
import {
  COLORS,
} from "~/src/themes/common";
import { discountProductListSelector } from "~/src/store/selectors/product";

import I18n from "~/src/I18n";
import { merchantSelector } from "~/src/store/selectors/merchant";
import { chainParse } from "~/src/utils";
import { withNavigation } from "react-navigation";
import { userInfoSelector } from "~/src/store/selectors/auth";
import { logout } from "~/src/store/actions/common";
import { numberUnreadNotificationSelector } from "~/src/store/selectors/notification";
import styles from "./styles";
import imgNotifiIcon from "~/src/image/home/imgNotifiIcon.png";
import { Text } from '~/src/themes/ThemeComponent'

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContext: false
    };
  }

  _handlePressNotification = () => {
    console.log("_handlePressNotification");
    this.props.navigation.navigate("Notification");
  };

  _handlePressChangePassword = () => {
    this.props.navigation.navigate("ChangePassword");
  };

  _handlePressLogout = () => {
    const showAlert = () => {
      Alert.alert(I18n.t("confirm"), I18n.t("warn_logout"), [
        {
          text: I18n.t("cancel")
        },
        {
          text: I18n.t("confirm"),
          onPress: () => {
            this.props.logout();
          }
        }
      ]);
    };
    if (Platform.OS == "ios") {
      setTimeout(() => {
        showAlert();
      }, 100);
    } else {
      showAlert();
    }
  };

  _handleChooseContextMenu = item => {
    if (item.id == "CHANGE_PASSWORD") {
      this._handlePressChangePassword();
    } else if (item.id == "LOGOUT") {
      this._handlePressLogout();
    }
  };

  render = () => {
    const { merchantInfo, userInfo, numberUnreadNotification } = this.props;
    const hasMerchant = !!(
      merchantInfo && Object.keys(merchantInfo).length > 0
    );
    const merchantName = chainParse(merchantInfo, ["merchant", "fullName"]);
    const merchantAddress = hasMerchant
      ? chainParse(merchantInfo, ["merchant", "address"])
      : I18n.t("no_merchant_hint");
    const merchantLogo = chainParse(merchantInfo, ["merchant", "logo"]);
    const { discountProductList, statistic } = this.props;
    // console.log("Statistic", statistic);
    const discountProductListContent =
      discountProductList && discountProductList.content
        ? discountProductList.content
        : [];
    return (
      <View style={styles.containerHeader}>
        <View
          style={[
            { marginTop: 44, justifyContent: "center", flexDirection:'row' }
          ]}
        >
          {/* <Image source={imgLogoApp} style={{ width: 49, height: 52 }} /> */}
          {/* <View style={styles.viewAvata} /> */}
          <Image source={require('~/src/image/avatar.png')} style={styles.viewAvata} />

          <View style={{ position: "absolute", right: 16 }}>
            {!!numberUnreadNotification && <View style={styles.badgeView} pointerEvents={'none'}>
                <Text className='bold white s11'>{numberUnreadNotification}</Text>
            </View>}
            <TouchableRipple
            
            onPress={this._handlePressNotification}
            rippleColor={COLORS.RIPPLE}
            >
            <Image source={imgNotifiIcon} style={{ width: 46, height: 46 }} />
            </TouchableRipple>
        </View>
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={styles.txtName}>
            {(userInfo.name || '').toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };
}

export default withNavigation(
  connect(
    state => ({
      merchantInfo: merchantSelector(state),
      userInfo: userInfoSelector(state),
      numberUnreadNotification: numberUnreadNotificationSelector(state),
      discountProductList: discountProductListSelector(state)
    }),
    { logout }
  )(Header)
);
