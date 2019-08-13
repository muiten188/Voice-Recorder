// import { COLORS } from "../../themesnew/common";

import { COLORS ,Point} from "~/src/themesnew/common";
export default (styles = {
  container: {
    // flex: 1,
    width: "100%",
    alignItems: "center"
  },
  btnSkip:{
    paddingVertical: 12*Point,
    width:144*Point,
    alignItems: 'center',
    // height:40,
    borderRadius:6*Point,
    backgroundColor: COLORS.BLUE_SKIP,
  },
  btnNext:{
    width:144*Point,
    // height:40,
    paddingVertical: 12*Point,
    borderRadius:6*Point,
    backgroundColor:COLORS.LIGHT_ORANGE,
    alignItems: 'center',
  },
  txtButton:{
    fontSize:14*Point,
    lineHeight:16*Point,
    color:COLORS.WHITE,
    fontWeight:'bold'
  },
  viewIndicator: {
    width: 35.8*Point,
    height: 2*Point,
    borderRadius: 1.6*Point,
    backgroundColor: COLORS.INDICATOR,
    marginLeft:6.4*Point,
    marginTop:8*Point
  },
  viewIndicatorFocus: {
    marginTop:8*Point,
    width: 35.8*Point,
    height: 2*Point,
    borderRadius: 1.6*Point,
    backgroundColor: COLORS.WHITE,
    marginLeft: 6.4*Point
  },
  titleItem:{
      marginTop: 20*Point,
      color:COLORS.TEXT_BLUE_WHITE,
      fontSize:18*Point,
      lineHeight:24*Point,
      fontWeight:'bold'
  }
});
