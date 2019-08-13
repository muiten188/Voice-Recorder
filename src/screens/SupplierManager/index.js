import React, { PureComponent } from "react";
import {
    FlatList,
    InteractionManager,
    ActivityIndicator,
    Platform,
    Image,
    TouchableOpacity,
    StatusBar
} from "react-native";
import { connect } from "react-redux";
import imgDelete2 from "~/src/image/delete_red.png";

// import Text from "~/src/themes/Text";
import {
    Toolbar,
    SearchInput,
    View,
    Text,
    PopupConfirm,
    Container
} from "~/src/themesnew/ThemeComponent";
import EmptyList from "~/src/components/EmptyList";
import { SURFACE_STYLES, TEXT_STYLES } from "~/src/themes/common";
import { COLORS } from "~/src/themesnew/common";
import { formatPhoneNumber, chainParse, replacePatternString } from "~/src/utils";
import { Button, TouchableRipple } from "react-native-paper";
import I18n from "~/src/I18n";
import { supplierListSelector } from "~/src/store/selectors/supplier";
import { FORM_MODE } from "~/src/constants";
import { getListSupplier, searchSupplier, deleteSupplier } from "~/src/store/actions/supplier";
import styles from "./styles";
import imgDelete from "~/src/image/delete2.png";
import imgDeleteActive from "~/src/image/delete_active.png";
import imgRightGray from "~/src/image/chevron_right_gray.png";
import ToastUtils from '~/src/utils/ToastUtils'

class SupplierManager extends PureComponent {
    // static navigationOptions = {
    //   headerTitle: I18n.t("supplier")
    // };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refreshing: false,
            valueSearch: "",
            showDelete: false,
            selectedSupplierId: "",
            popupDeleteSupplierContent: ""
        };
    }

    _handPress = item => {
        console.log("Pressing Supplier", item);
        if (this.state.showDelete) return
        this.props.navigation.navigate("SupplierInfo", {
            mode: FORM_MODE.EDIT,
            supplier: item
        })
    }

    _handlePressDeleteItem = (item) => {
        this.setState({
            selectedSupplierId: item.id
        });
        const warnMessage = replacePatternString(
            I18n.t("warn_delete_supplier"),
            `"${item.name}"`
        );
        this.setState(
            {
                popupDeleteSupplierContent: warnMessage
            },
            () => {
                this.popupDeleteSupplier && this.popupDeleteSupplier.open();
            }
        )
    }

    _getPhoneAddressText = (item) => {
        const supplierAddress = chainParse(item, ["address"]);
        const supplierPhone1 = chainParse(item, ["phone1"]) ? formatPhoneNumber(chainParse(item, ["phone1"])) : ''
        return [supplierPhone1, supplierAddress].filter(item => !!item).join(' - ')
    }

    _renderSupplierItem = ({ item, index }) => {
        const supplierName = chainParse(item, ["name"]);
        const supplierAddress = chainParse(item, ["address"]);
        const supplierPhone1 = chainParse(item, ["phone1"]);
        return (
            <TouchableRipple onPress={() => this._handPress(item)}>
                <View
                    className='row-start white border-bottom2 ph24 pv12'
                >
                    {!!this.state.showDelete &&
                        <TouchableOpacity onPress={() => this._handlePressDeleteItem(item)}>
                            <Image source={imgDelete2} style={{ width: 24, height: 24, marginRight: 24 }} />
                        </TouchableOpacity>
                    }
                    <View className="flex">
                        <Text className='textBlack bold'>{supplierName}</Text>
                        <Text className='s12 lh16 gray' numberOfLines={1}>
                            {this._getPhoneAddressText(item)}
                        </Text>
                    </View>
                    <Image source={imgRightGray} style={styles.imgRightGray} />
                </View>
            </TouchableRipple>
        );
    }

    _handleRefresh = () => {
        this._load(1, true);
    }

    _load = (page = 1, refreshing = false) => {
        const { getListSupplier } = this.props;
        if (refreshing) {
            this.setState({ refreshing: true });
        } else {
            this.setState({ loading: true });
        }
        if (this.state.valueSearch) {
            this.props.searchSupplier(
                this.state.valueSearch,
                10,
                this.state.valueSearch,
                (err, data) => {
                    this.setState({
                        refreshing: false,
                        loading: false
                    });
                }
            );
        }
        getListSupplier(page, (err, data) => {
            console.log("getListSupplier Err", err)
            console.log("getListSupplier Data", data)
            this.setState({ refreshing: false, loading: false })
        })
    }

    _loadMore = () => {
        console.log("Reach End");
        if (this.state.loading || this.state.refreshing) return;
        const pageNumber = +chainParse(this.props, [
            "supplierList",
            "pagingInfo",
            "pageNumber"
        ]);
        const totalPages = +chainParse(this.props, ["supplierList", "totalPages"]);
        console.log("PageNumber, TotalPage", pageNumber, totalPages);
        if (pageNumber >= totalPages) return
        this._load(pageNumber + 1)
    }

    componentDidMount = async () => {
        StatusBar.setBarStyle('dark-content')
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(COLORS.WHITE)
        }
        const { supplierList } = this.props;
        const supplierListContent =
            supplierList && supplierList.content ? supplierList.content : []
        const showRefresh = supplierListContent.length == 0;
        this._load(1, showRefresh)
    }

    _handleChangeTextSearch = text => {
        this.setState({
            valueSearch: text
        })
        this._searchSupplier(text);
    }

    _searchSupplier = (text, page = 1) => {
        this.setState({ refreshing: true });
        this.props.searchSupplier(text, 10, page, (err, data) => {
            this.setState({ refreshing: false })
        })
    }

    _handleAddSupplier = () => {
        InteractionManager.runAfterInteractions(() => {
            console.log("Add supplier");
            this.props.navigation.navigate("SupplierInfo", {
                mode: FORM_MODE.ADD
            })
        })
    }

    _renderFooter = () => {
        if (this.state.loading) {
            return (
                <View style={SURFACE_STYLES.rowCenter}>
                    <ActivityIndicator
                        size={Platform.OS == "android" ? 60 : "large"}
                        color={COLORS.BLUE}
                    />
                </View>
            );
        }
        return <View style={SURFACE_STYLES.bottomButtonSpace} />;
    }


    _handleOnPressCleanTextSearch = () => {
        this.setState({
            valueSearch: ""
        });
        this._load();
    }

    _renderContent = supplierListContent => {
        if (supplierListContent.length != 0) {
            return (
                <FlatList
                    data={supplierListContent}
                    extraData={this.state}
                    renderItem={this._renderSupplierItem}
                    keyExtractor={item => chainParse(item, ["id"])}
                    ListFooterComponent={this._renderFooter}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this._loadMore}
                    onEndReachedThreshold={0.2}
                    onRefresh={this._handleRefresh}
                    refreshing={this.state.refreshing}
                />
            );
        } else {
            if(this.state.valueSearch )
            return<View></View>
            // return <View className="flex white" />;
            return (
                <EmptyList
                    title={I18n.t("empty_supplier")}
                    guide={I18n.t("guide_supplier")}
                />
                // <View></View>
            );
        }
    };
    _deleteSupplier = () => {
        const { deleteSupplier, getListSupplier } = this.props;
        this.setState({ loading: true });
        deleteSupplier(this.state.selectedSupplierId, (err, data) => {
            console.log("deleteSupplier Err", err);
            console.log("deleteSupplier Data", data);
            if (chainParse(data, ["httpHeaders", "status"]) == 200) {
                this.setState({ loading: false });
                this.setState({ showDelete: false })
                getListSupplier();
                ToastUtils.showSuccessToast(I18n.t('delete_supplier_success'))
            } else if (data && data.code) {
                ToastUtils.showErrorToast(I18n.t('delete_supplier_success'))
            }
        });
    }

    _handleOnPressDelete = () => {
        this.setState({ showDelete: !this.state.showDelete })
    }

    render() {
        const { supplierList } = this.props;
        console.log("supplierList", supplierList);
        const supplierListContent =
            supplierList && supplierList.content ? supplierList.content : [];

        return (
            <Container>
                <Toolbar title={I18n.t("supplier")}></Toolbar>
                <PopupConfirm
                    ref={ref => (this.popupDeleteSupplier = ref)}
                    content={this.state.popupDeleteSupplierContent}
                    onPressYes={this._deleteSupplier}
                    onPressNo={() => (this.selectedSupplierID = "")}
                />
                <View
                    style={[
                        SURFACE_STYLES.flex,
                        {
                            backgroundColor:
                                supplierListContent.length === 0
                                    ? COLORS.WHITE
                                    : COLORS.FEATURE_BACKGROUND
                        }
                    ]}
                >
                    {/* <View style={[SURFACE_STYLES.containerHorizontalMargin]}> */}
                    {/* <View style={{backgroundColor:COLORS.FEATURE_BACKGROUND, width:'100%'}}> */}
                    <View style={styles.viewSearch} className=" pv8">
                        <SearchInput
                            visible={true}
                            onChangeText={this._handleChangeTextSearch}
                            label={I18n.t('search_supplier')}
                        />
                        <TouchableOpacity
                            style={{ marginLeft: "auto" }}
                            onPress={this._handleOnPressDelete}
                        >
                            {/* <View style={styles.btnDelete}>  */}
                            <Image
                                source={this.state.showDelete ? imgDeleteActive : imgDelete}
                                style={{ width: 24, height: 24, marginLeft: 25 }}
                            />
                            {/* </View> */}
                        </TouchableOpacity>
                        {/* <TextInput
                // label={I18n.t('address')}
                placeholder={I18n.t("search_supplier")}
                onChangeText={this._handleChangeTextSearch}
                value={this.state.valueSearch}
                style={SURFACE_STYLES.borderBottom}
                iconRight={"close"}
                onPressIconRight={this._handleOnPressCleanTextSearch}
                showIconRight={this.state.valueSearch}
                activeColor={COLORS.GRAY}
                textInputStyle={{ paddingHorizontal: 15 }}
                maxLength={512}
              /> */}
                        {/* </View> */}
                    </View>
                    <View
                        className="space8"
                        style={{ backgroundColor: COLORS.FEATURE_BACKGROUND }}
                    />
                    {this._renderContent(supplierListContent)}

                    {/* <FlatList
              data={supplierListContent}
              extraData={this.state}
              renderItem={this._renderSupplierItem}
              keyExtractor={item => chainParse(item, ["id"])}
              ListFooterComponent={this._renderFooter}
              showsVerticalScrollIndicator={false}
              onEndReached={this._loadMore}
              onEndReachedThreshold={0.2}
              onRefresh={this._handleRefresh}
              refreshing={this.state.refreshing}
            /> */}
                </View>
                <TouchableOpacity
                    onPress={this._handleAddSupplier}
                    style={{ position: "absolute", bottom: 0, width: "100%" }}
                >
                    <View style={styles.btnAdd}>
                        <Text style={styles.labelAdd}>{I18n.t("add_supplier")}</Text>
                    </View>
                    {/* <Button style={{backgroundColor:COLORS.PRIMARY, width:"100%", height:46}} mode="contained" onPress=>
            {I18n.t("add_supplier")}
          </Button> */}
                </TouchableOpacity>
                {/* </View> */}
            </Container>
            // </SafeAreaView>
        );
    }
}

export default connect(
    state => ({
        supplierList: supplierListSelector(state)
    }),
    { getListSupplier, searchSupplier, deleteSupplier }
)(SupplierManager);
