import React, { Component } from "react";
import { TouchableOpacity, Image, FlatList } from "react-native";
import styles from "./styles";
import { connect } from "react-redux";
import ToastUtils from "~/src/utils/ToastUtils";

import { MAX_LENGTH_NAME, MAX_LENGTH_NOTE_COST } from "~/src/constants";
import {
  Text,
  View,
  Toolbar,
  Container,
  PopupConfirm,
  TitleRowInput as TextInput,
  Button
} from "~/src/themes/ThemeComponent";
import { replacePatternString } from "~/src/utils";
import LoadingModal from "~/src/components/LoadingModal";
import I18n from "~/src/I18n";
import {
  createCostGroup,
  getListCostGroup,
  getCostGroupDetail,
  deleteCostGroup
} from "~/src/store/actions/costManage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
class AddCostGroup extends Component {
  static navigationOptions = {
    headerMode: "none",
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      nameGroup: "",
      description: "",
      loading: false,
      id: "",
      title: I18n.t("add_cost_group"),
      enableButtonSave: false,
      popupDeleteCostGroupContent: "",
      pGroupId: "",

    };
  }
  _load = () => {
    const id = this.props.navigation.getParam("id", "");
    const nameGroup = this.props.navigation.getParam("nameGroup", "");
    const description = this.props.navigation.getParam("description", "");
    if (id) {
      this.setState(
        {
          nameGroup,
          description,
          id,
          title: I18n.t("update_cost_group")
        },
        () => {
          const { getCostGroupDetail } = this.props;
          getCostGroupDetail(id, (err, data) => {
            if (data) {
              if (data.updated && data.updated.result) {
                this.setState({
                  description: data.updated.result.description,
                  nameGroup: data.updated.result.name
                });
              }
            }
          });
        }
      );
    }
  };

  componentDidMount() {
    this._load();
  }
  _handleOnChangeTextNameGroup = text => {
    if (this.state.id) {
      this.setState({
        nameGroup: text,
        enableButtonSave: true
      });
    } else {
      this.setState({
        nameGroup: text
      });
    }
  };
  _handleOnChangeTextDescription = text => {
    if (this.state.id) {
      this.setState({
        description: text,
        enableButtonSave: true
      });
    } else {
      this.setState({
        description: text
      });
    }
  };
  _handleOnPressDelete = () => {
    const warnMessage = replacePatternString(
      I18n.t("warn_delete_cost_group"),
      `"${this.state.nameGroup}"`
    );
    this.setState(
      {
        popupDeleteCostGroupContent: warnMessage
      },
      () => {
        this.popupDeleteCostGroup && this.popupDeleteCostGroup.open();
      }
    );
  };
  _handleSave = () => {
    this.setState({
      loading: true
    });
    const { createCostGroup } = this.props;
    const requestObj = {
      pGroupId: this.state.id,
      pGroupName: this.state.nameGroup.trim(),
      description: this.state.description.trim()
    };
    createCostGroup(requestObj, (err, data) => {
      if (data) {
        if (data.httpHeaders && data.httpHeaders.status === 200) {
          this.props.getListCostGroup();
          this.setState({
            loading: false
          });
          const callBack = this.props.navigation.getParam("callback");
          callBack && callBack(data);
          this.props.navigation.goBack();
          ToastUtils.showSuccessToast(
            replacePatternString(
              this.state.id
                ? I18n.t("update_cost_group_success")
                : I18n.t("add_cost_group_success"),
              `"${this.state.nameGroup.trim()}"`
            )
          );
        } else if (data.code == 7001) {
          this.setState({ loading: false });
          ToastUtils.showErrorToast(I18n.t("cost_group_already"));
        } else if (data.code) {
          this.setState({ loading: false });
          ToastUtils.showErrorToast(data.msg);
        } else {
          this.setState({
            loading: false
          });
        }
      }
    });
  };
  _deleteCostGroup=()=>{
    const { deleteCostGroup } = this.props;
      this.setState({
        loading: true
      });
      const requestObj = {
        pGroupId: this.state.id,
        pGroupIdOther: ""
      };
      deleteCostGroup(requestObj, (err, data) => {
        console.log(data);
        if (data) {
          if (data.httpHeaders && data.httpHeaders.status == 200) {
            this.setState({
              loading: false
            });
            this.props.getListCostGroup((err, data) => {});
            this.props.navigation.goBack()
            ToastUtils.showSuccessToast(
              replacePatternString(
                I18n.t("delete_cost_group_success"),
                `"${this.state.nameGroup.trim()}"`
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
  }
  _handleOnPressRightToolbar=()=>{
    if(this.state.id){
      this._handleOnPressDelete()
    }else{
      this.props.navigation.goBack()
    }
  }
  render() {
    const enableButton = !!(
      this.state.nameGroup &&
      this.state.nameGroup.trim() &&
      this.state.description &&
      this.state.description.trim()&&
      (this.state.id ?this.state.enableButtonSave:true)
    );
    // this.state.description &&
    // this.state.description.trim()
    return (
      <Container>
        <Toolbar
          title={this.state.title}
          rightText={this.state.id?I18n.t("delete"): I18n.t("cancel")}
          onPressRight={this._handleOnPressRightToolbar }
        />
        <PopupConfirm
            ref={ref => (this.popupDeleteCostGroup = ref)}
            content={this.state.popupDeleteCostGroupContent}
            onPressYes={this._deleteCostGroup}
            onPressNo={() => (this.selectedCostId = "")}
          />
        <View style={styles.container}>
          <LoadingModal visible={this.state.loading} />

          <KeyboardAwareScrollView>
            <View className="space36" />
            <TextInput
              autoCapitalize={"none"}
              autoCorrect={false}
              title={I18n.t("name_cost_group")}
              onChangeText={this._handleOnChangeTextNameGroup}
              value={this.state.nameGroup}
              onPressIconRight={() => this.setState({ supplierItems: "" })}
              maxLength={MAX_LENGTH_NAME}
              isRequire={true}
            />
            <View className="space8" />
            <TextInput
              style={{ marginTop: 1 }}
              multiline={true}
              styleTextInput={{ height: 48, padding: 0 }}
              numberOfLines={3}
              title={I18n.t("description")}
              onChangeText={this._handleOnChangeTextDescription}
              value={this.state.description}
              maxLength={MAX_LENGTH_NOTE_COST}
              isRequire={true}
            />
          </KeyboardAwareScrollView>
          <View className="bottom">
            <Button
              onPress={this._handleSave}
              text={this.state.id ? I18n.t("save_change") : I18n.t("done")}
              disabled={!enableButton}
              style={{ flex: 1 }}
              //   style={SURFACE_STYLES.flex}
            />
          </View>
        </View>
      </Container>
    );
  }
}
export default connect(
  null,
  { createCostGroup, getListCostGroup, getCostGroupDetail ,deleteCostGroup}
)(AddCostGroup);
