import { COLORS } from "~/src/themes/common";
import { getFontStyle } from "~/src/utils";
import { Dimensions } from "react-native";

export default {
  block: {
    // alignItems: "center",
    window: "100%",
    flex:1,
    // height: Dimensions.get("window").height,
    backgroundColor: COLORS.FEATURE_BACKGROUND
  },
  labelSave:{
    fontSize: 12,
    fontWeight: 'bold',
    color:COLORS.WHITE
  },
  txtLabelSwitch:{
    fontSize:14,
    lineHeight:20,
    color:COLORS.TEXT_BLACK
  },
  viewSave: {
    // backgroundColor: "red",
    with: "100%",
    // backgroundColor:COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    height:46,
    marginTop: 'auto',
  }
  
};
