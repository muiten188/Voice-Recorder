import { POINT } from "~/src/constants";
import { COLORS } from "~/src/themes/common";
const point = POINT;
export default {
  container: {
    height:43 ,
    backgroundColor: COLORS.WHITE,
    width: "100%",
    flex:1,
    // flexDirection: 'row',
  },
  // option:{
  //   width:
  // },
  optionTicker: {},
  textTimeDate: {
    fontSize: point * 14,
    margin: point * 8,
    color: COLORS.BLACK
  },
  line: {
    width: "100%",
    height: 1,
    marginTop: "auto",
    backgroundColor: COLORS.FEATURE_BACKGROUND
  },
  textNote: {
    fontSize: 14,
    color: COLORS.BLACK,
    // marginLeft:24,
    fontWeight: 'bold',
    flex:1
  },
  textTotalAmount: {
    fontSize: 14,
    color: COLORS.LIGHT_ORANGE,
    fontWeight: 'bold',

    marginLeft: 10,
    // marginRight: 24,
  },
  viewDelete:{
    paddingRight:24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewOption: {
    borderWidth: 0.5,
    borderColor: "black",
    width: point * 30,
    height: point * 30,
    alignItems: "center",
    justifyContent: "center"
  },
  viewOrdinal: {
    borderWidth: 0.5,
    borderColor: "black",
    width: point * 40,
    height: point * 30,
    borderLeftWidth: 0
  },
  viewDateTime: {
    // height: point * 30
  },
  viewNote: {
    // height: point * 30
  },
  viewTotal: {
    flexDirection: 'row',
    // height: point * 30
  }
};
