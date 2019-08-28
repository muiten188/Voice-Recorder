import React, { Component } from "react";
import { TouchableOpacity, Image, FlatList, SectionList } from "react-native";
import styles from "./styles";
import I18n from "~/src/I18n";
import { connect } from "react-redux";
import { PopupChoose } from "~/src/themes/ThemeComponent";
import LoadingModal from "~/src/components/LoadingModal";
import ToastUtils from "~/src/utils/ToastUtils";

import imgDelete from "~/src/image/delete2.png";
import imgChevronRight from "~/src/image/chevron_right_black.png";
import imgAddWhite from "~/src/image/imgAddWhite.png";
import imgDeleteRed from "~/src/image/delete_red.png";
import CostItem from "~/src/components/CostItem";
import { COLORS } from "~/src/themes/common";
import { formatList, replacePatternString } from "~/src/utils";
import {
  costGroupListSelector,
  costManageListSelector,
  costListSearchSelector
} from "~/src/store/selectors/costManage";
import { Text, View } from "~/src/themes/ThemeComponent";
import { SearchInput } from "~/src/themes/ThemeComponent";
import {
  getListCostGroup,
  searchCost,
  deleteCostGroup
} from "~/src/store/actions/costManage";
import lodash from "lodash";

class CostManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueSearch: "",
      showDelete: false,
      enableDelete:true,
      popupDeleteGroupContent: "",
      data: [
        { content: I18n.t("delete_cost_ground_and_remove_content"), id: 1 },
        { content: I18n.t("delete_cost_group_content"), id: 2 }
      ],
      value: 1,
      loading: false,
      pGroupIdSelected: "",
      pGroupNameSelected: ""
    };
  }
  componentDidFocus = () => {};
  _handleOnChange = value => {
    this.setState({ value });
    if (value == 1) {
    }
    if (value == 2) {
    }
  };
  _handleChangeTextSearch = text => {
    if(text==""){
      this.setState({
        enableDelete:true
      })
    }else{
      this.setState({
        enableDelete:false
      })
    }
    this.setState({
      valueSearch: text
    });
    this._searchCost(text);
  };
  _handleOnPressDelete = () => {
    this.setState({
      showDelete: !this.state.showDelete
    });
  };
  _handleOnPressCleanTextSearch = () => {
    this.setState({
      valueSearch: "",
      enableDelete:true
    });
  };
  renderBtnDelete = item => {
    if (this.state.showDelete) {
      return (
        <TouchableOpacity onPress={() => this._handleOnPressDeleteGroup(item)}>
          <Image source={imgDeleteRed} style={styles.imgDeleteRed} />
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }
  };
  _onAddCostGroup=(pGroup)=>{
    this.setState({pGroupIdSelected:pGroup.id, pGroupNameSelected:pGroup.name})
  }
  _handleOnPressUpdateItem = item => {
    this.props.navigation.navigate("AddCostGroup", {
      id: item.id,
      nameGroup: item.name,
      description: item.description,
    });
  };
  _handleOnPressItem = item => {
    this.props.navigation.navigate("CostList", {
      pGroupId: item.id,
      title: item.name
    });
  };
  _handleOnPressCostItem = item => {
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
  _renderButtonDelete=()=>{
    if(this.state.enableDelete){
      return(
        <TouchableOpacity
        style={{ marginLeft: 24 }}
        onPress={this._handleOnPressDelete}
      >
        <Image source={imgDelete} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      )
    }else{
      return(
        <View style={{width:24,marginLeft:24, height:24}}></View>
      )
    }
  }
  _renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity onPress={() => this._handleOnPressItem(item)}>
          <View style={styles.viewItem}>
            {this.renderBtnDelete(item)}
            <View
              style={{ flex: 1, paddingTop: 14, paddingBottom: 12 }}
              className="white ph24"
            >
              {/* {this.renderBtnDelete()}  */}
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <View className="border-right" style={{ paddingRight: 15 }}>
                  <Text style={styles.txtNameItem}>{item.name}</Text>
                </View>
                <Text
                  onPress={() => this._handleOnPressUpdateItem(item)}
                  style={styles.txtUpdateItem}
                >
                  {I18n.t("update")}
                </Text>
                <Image
                  source={imgChevronRight}
                  style={styles.imgChevronRight}
                />
              </View>
              <View className="row-start">
                <View className="flex">
                  <Text numberOfLines={1} style={styles.txtDescription}>
                    {item.description}
                  </Text>
                </View>
                <View className="flex" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View className="space8" />
      </View>
    );
  };
  _load = () => {
    const { getListCostGroup } = this.props;
    getListCostGroup();
  };
  componentDidMount() {
    this._load();
  }
  _searchCost = lodash.debounce((note, page = 1) => {
    const requestObj = {
      note: note,
      pGroupId: "",

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
  _handleOnPressAddGroup = () => {
    this.props.navigation.navigate("AddCostGroup");
  };
  _handleOnPressAddCost = () => {
    this.props.navigation.navigate("AddCost");
  };
  _handleOnPressDeleteGroup = item => {
    this.setState(
      {
        pGroupIdSelected: item.id,
        pGroupNameSelected: item.name
      },
      () => {
        this.popupConfirmDeleteGroup && this.popupConfirmDeleteGroup.open();
      }
    );
    console.log(item);
  };
  _renderItemCost = ({ item, index }) => (
    <CostItem
      onPressDelete={() => this._handleOnPressDeleteItem(item)}
      showDelete={this.state.showDelete}
      key={item.id}
      onPress={() => this._handleOnPressCostItem(item)}
      timeDate={item.tradingDate}
      note={item.note}
      totalAmount={item.totalAmount}
    />
  );
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
  _deleteGroup = () => {
    // if(this.state.value==1)
    if (this.state.value == 2) {
      const { deleteCostGroup } = this.props;
      this.setState({
        loading: true
      });
      const requestObj = {
        pGroupId: this.state.pGroupIdSelected,
        pGroupIdOther: ""
      };
      deleteCostGroup(requestObj, (err, data) => {
        console.log(data);
        if (data) {
          if (data.httpHeaders && data.httpHeaders.status == 200) {
            this.setState({
              loading: false,
              showDelete:false
            });
            this.props.getListCostGroup((err, data) => {});
            ToastUtils.showSuccessToast(
              replacePatternString(
                I18n.t("delete_cost_group_success"),
                `"${this.state.pGroupNameSelected.trim()}"`
              )
            );
          }
          if (data && data.code) {
            this.setState({ loading: false });
          }
        }
        this.setState({
          loading: false
        });
      });
    } else {
      this.props.navigation.navigate("ChooseCostGroup", {
        pGroupId: this.state.pGroupIdSelected,
        pGroupName: this.state.pGroupNameSelected
      });
    }
  };
  _renderContent = () => {
    const { costGroupList } = this.props;
    const costGroupListContent = costGroupList ? costGroupList : [];
    const { costList } = this.props;
    const constListContent =
      costList && costList.content ? costList.content : [];
    if (this.state.valueSearch) {
      return (
        <SectionList
          onRefresh={this._refresh}
          refreshing={this.state.isLoading}
          sections={formatList(constListContent, "tradingDate")}
          onEndReached={this._loadMore}
          onEndReachedThreshold={0.2}
          renderItem={this._renderItemCost}
          keyExtractor={(item, index) => item.id + "" + index}
          renderSectionHeader={this._renderHeader}
        />
      );
    } else {
      return (
        <FlatList
          style={{ marginBottom: 40 }}
          extraData={this.state}
          keyExtractor={item => item.id}
          data={costGroupListContent}
          renderItem={this._renderItem}
        />
      );
    }
  };
  render() {
    return (
      <View className="flex" style={styles.container}>
        <LoadingModal visible={this.state.loading} />

        <View style={styles.viewSearch} className="ph24">
          <PopupChoose
            onChange={this._handleOnChange}
            data={this.state.data}
            value={this.state.value}
            ref={ref => (this.popupConfirmDeleteGroup = ref)}
            content={this.state.popupDeleteGroupContent}
            onPressYes={this._deleteGroup}
            onPressNo={() => (this.selectedGroupId = "")}
          />
          <SearchInput
            label={I18n.t("search_cost")}
            value={this.state.valueSearch}
            onChangeText={this._handleChangeTextSearch}
            visible={true}
            onPressClear={this._handleOnPressCleanTextSearch}
          />
          {this._renderButtonDelete()}
        </View>
        <View className="space12" />
        {/* <View style={{marginBottom:50}}> */}
        {this._renderContent()}
        {/* </View> */}

        <View style={styles.viewAdd}>
          <TouchableOpacity
            style={styles.btnAddGroup}
            onPress={this._handleOnPressAddGroup}
          >
            <Text style={styles.txtAddGroup}>{I18n.t("create_group")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnAddCost}
            onPress={this._handleOnPressAddCost}
          >
            <View className="flex row-start">
              <Image source={imgAddWhite} style={{ width: 10, height: 10 }} />
              <Text style={styles.txtAddCost}>{I18n.t("create_cost")}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default connect(
  state => ({
    costGroupList: costGroupListSelector(state),
    costList: costListSearchSelector(state)
  }),
  { getListCostGroup, searchCost, deleteCostGroup }
)(CostManage);
