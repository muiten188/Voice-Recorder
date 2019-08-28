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
  deleteCostGroup
} from "~/src/store/actions/costManage";
import moment from "moment";
import ToastUtils from "~/src/utils/ToastUtils";

import {
  timeDateCostSelecttor,
  costGroupListSelector
} from "~/src/store/selectors/costManage";
import { COLORS,  } from "~/src/themes/common";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LoadingModal from "~/src/components/LoadingModal";
import lodash from "lodash";
import {
  Toolbar,
  Container,
  Text,
  View,
  MultipleTagSelector
} from "~/src/themes/ThemeComponent";
import imgAddOpacity from "~/src/image/add_opacity.png";
import {
  replacePatternString
} from "~/src/utils";

class ChooseCostGroup extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
      headerMode: "none"
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
      pGroupName:"",
      pGroupId: "",
      pGroupIdRequest: ""
    };
  }
  _load() {
    const { getListCostGroup } = this.props;
    getListCostGroup();
    
  }
componentDidMount() {
    StatusBar.setBarStyle("dark-content");
    if (Platform.OS == "android") {
      StatusBar.setBackgroundColor(COLORS.WHITE);
    }
    const pGroupId = this.props.navigation.getParam("pGroupId", "");
    const pGroupName = this.props.navigation.getParam("pGroupName","")
    this.setState(
      {
        pGroupName,
        pGroupId: pGroupId
      },
      () => this._load()
    );
  }
  _handleSave = lodash.throttle(() => {
    const { deleteCostGroup } = this.props;
    this.setState({
      loading: true
    });
    const requestObj = {
      pGroupId: this.state.pGroupId,
      pGroupIdOther: this.state.pGroupIdRequest
    };
    deleteCostGroup(requestObj, (err, data) => {
      console.log(data);
      if (data) {
        if (data.httpHeaders && data.httpHeaders.status == 200) {
          this.setState({
            loading: false
          });
          this.props.getListCostGroup((err,data)=>{

          })
          ToastUtils.showSuccessToast(
            replacePatternString(
              I18n.t("delete_cost_group_success"),
              `"${this.state.pGroupName}"`
            )
          );
          this.props.navigation.goBack()
        }
        if (data && data.code) {
          this.setState({ loading: false });
        }
      }
      this.setState({
        loading: false
      });
    });
  }, 5000);
  _handleOnChangeDate = dateTime => {
    this.setState({
      tradingDate: dateTime.endOf("day"),
      errTime: "",
      disabledSave: false
    });
  };


  _handleOnPressRightToolbar = () => {
    
      this.props.navigation.goBack();
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
    if(listContent.length!=0){
      for(let i=0; i<listContent.length; i++){
        if(listContent[i].id==this.state.pGroupId){
          listContent.splice(i,1)
        }
      }
    }

    const enableBtn = !!this.state.pGroupIdRequest;
    return (
      <Container>
        <View style={styles.block}>
          <LoadingModal visible={this.state.loading} />

          
          <Toolbar
            onPressRight={this._handleOnPressRightToolbar}
            title={I18n.t("choose_different")}
            rightText={I18n.t("cancel")}
          />
          <View className="space24" />

          <View className="ph24 white">
          <View className="space12"></View>
            <Text style={styles.txtTitleChoose}>
              {I18n.t("choose_group_cost")}
            </Text>
            <View className="space16"></View>
            <MultipleTagSelector
              data={listContent}
              values={[this.state.pGroupIdRequest]}
              onChange={this._updatepGroupId}
            />
          </View>
          {/* <Text>Minh</Text> */}
          <TouchableOpacity onPress={this._handleAddCostGroup}>
               <View className="border-top white pv8">
               <View className="row-center">
                  <View style={styles.viewAddOpacity}>
                    <Image
                      source={imgAddOpacity}
                      style={{ width: 10, height: 10 }}
                    />
                  </View>
                  <Text style={[styles.txtTitleChoose, { marginLeft: 8 }]}>
                    Thêm danh mục
                  </Text>
                 </View>
             </View>
            </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{ width: "100%", position: "absolute", bottom: 0 }}
            onPress={this._handleSave}
            disabled={ !enableBtn }
          >
            <View
              style={[
                styles.viewSave,
                {
                  backgroundColor:
                     !enableBtn
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
                       !enableBtn
                        ? COLORS.BACKDROP
                        : COLORS.WHITE
                  }
                ]}
              >
                { I18n.t("confirm")}
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
  { getListCostGroup,deleteCostGroup }
)(ChooseCostGroup);
