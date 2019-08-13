import { COLORS } from "~/src/themesnew/common";
import { getFontStyle } from "~/src/utils";
import { Dimensions } from "react-native";

export default {
  block: {
    // alignItems: "center",
    width: "100%",
    flex:1,
    // height: Dimensions.get("window").height,
    backgroundColor: COLORS.FEATURE_BACKGROUND
  },
 
  labelSave:{
    fontSize: 12,
    fontWeight: 'bold',
    color:COLORS.WHITE
  },
  txtTitleChoose:{
    fontSize:12,
    lineHeight:14,
    color:COLORS.TEXT_BLACK
  },
  txtNotRequire:{
    color:COLORS.PLACEHOLDER_COLOR,
    fontSize:12,
    lineHeight:14,
    marginLeft: 8,
  },
  viewSave: {
    // backgroundColor: "red",
    with: "100%",
    // backgroundColor:COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    height:46,
    marginTop: 'auto',
  },
  viewAddOpacity:{
    backgroundColor:COLORS.BACKGROUND3,
    width:20,
    height:20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }
};
