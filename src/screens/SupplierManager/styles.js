import { COLORS, SURFACE_STYLES } from "~/src/themes/common";

export default {
  viewSearch: {
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    width: "100%",
    height: 48,
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 16,
  },
  btnAdd:{
    width:'100%',
    height:46,
    backgroundColor:COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelAdd:{
    fontSize:14,
    fontWeight:'bold',
    color:COLORS.WHITE
  },
  imgRightGray:{
    width:6,
    height:10,
    marginLeft: 8
  },
  listItemTitle:{
    marginTop: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color:COLORS.TEXT_BLACK
  },
  btnDelete:{
    height:48,
    width:52,
    justifyContent: 'center',
    backgroundColor:'red',
    alignItems: 'center',
  },
  viewDelete:{
    height:60,
    width:60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemCaption:{
    color:COLORS.TEXT_GRAY,
    fontSize:12,
    marginTop:4
  },
};
