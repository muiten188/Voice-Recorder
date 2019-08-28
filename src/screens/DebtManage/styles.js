import { COLORS } from "~/src/themes/common";
import{Dimensions} from 'react-native'
export default {
  container:{
    flex: 1,
    width:"100%",
    backgroundColor: COLORS.FEATURE_BACKGROUND,
  },
  imgArrow:{
    width:6,
    height:10,
    marginLeft: 14,
  },
  txtTotalAmountPayAble:{
    fontSize:14,
    lineHeight:16,
    fontWeight:'bold',
    color:COLORS.LIGHT_ORANGE,
  },
  txtTotalAmountReceivable:{
    fontSize:14,
    lineHeight:16,
    fontWeight:'bold',
    color:COLORS.TEXT_RECEIVABLE
  },
  txtTitleItem:{
    fontSize: 14,
    lineHeight:20,
    color:COLORS.TEXT_BLACK
  },
  viewItem:{
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor:COLORS.WHITE,
    flex:1
  }
}