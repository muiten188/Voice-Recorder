import { COLORS } from "~/src/themes/common";
import{Dimensions} from 'react-native'

export default {
  container: {
    flex: 1,
    backgroundColor: COLORS.FEATURE_BACKGROUND,
    width:'100%',
    height:Dimensions.get('window').height
  },
  btnAdd:{
    width:143,
    height:40,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'center',
    backgroundColor: COLORS.LIGHT_ORANGE,
  },
  imgAdd:{
    width:10,
    height:10,
    marginLeft:16,
    marginRight:11
  },
  labelButton:{
    fontSize: 12,
    fontWeight: 'bold',
    color:COLORS.WHITE
  },
  btnSearch: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  btnBack: {
    width: 54,
    height: 48,
    alignItems: "center",
    justifyContent: "center"
  },
  btnDelete:{
    height:48,
    width:52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtTotal:{
    fontSize:14,
    lineHeight:16,
    fontWeight:'bold',
    color:COLORS.TEXT_GRAY
  },
  txtTotalAmount:{
    fontSize:20,
    lineHeight:24,
    fontWeight:'bold',
    color:COLORS.TEXT_BLACK
  },
  
  viewDate: {
    flexDirection: "row",
    width: "100%",
    // marginBottom: 30,
    height: 80
  },
  viewSearch: {
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    width: "100%",
    height: 48,
    alignItems: "center",
    flex:1
  },
  dateInput: {
    width: "45%",
    marginTop: 10,
    marginLeft: "3%",
    paddingRight: "auto"
  },
  viewHeaderList: {
    backgroundColor: COLORS.BACKGROUND,
    height: 38,
    width: "100%",
    paddingLeft: 24,
    justifyContent: "center"
  }
};
