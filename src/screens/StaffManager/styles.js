import {COLORS} from "~/src/themesnew/common"
export default{
    viewHeader:{
        width:"100%",
        paddingLeft: 24,
        paddingRight:16,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: COLORS.WHITE,
    },
    txtHeader:{
        height:16,
        fontSize: 14,
        color:COLORS.TEXT_BLACK
    },line:{
        // width:'100%',
        flex:1,
        height:1,
        marginLeft: 24,
        backgroundColor:COLORS.FEATURE_BACKGROUND
    },
    viewSearch: {
        flexDirection: "row",
        backgroundColor: COLORS.WHITE,
        width: "100%",
        height: 48,
        alignItems: "center",
        flex:1
      },
    txtItemName:{
        fontSize:14,
        fontWeight: 'bold',
        height:16
    },
    btnAdd:{
        width:"100%",
        height:46,
       
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.PRIMARY,
      },
      imgAdd:{
        width:10,
        height:10,
        marginLeft:16,
        marginRight:11
      },
      labelButton:{
        fontSize: 14,
        fontWeight: 'bold',
        color:COLORS.WHITE,
        lineHeight:16
      },
    txtItemNumber:{
        marginTop: 4,
        lineHeight:16,
        fontSize:12,
        color:COLORS.TEXT_GRAY
    }
}