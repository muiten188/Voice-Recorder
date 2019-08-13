import { DEVICE_WIDTH, DEVICE_HEIGHT, COLORS,Point } from "~/src/themesnew/common";
export default (styles = {
  btnSkip: {
    width: 137*Point,
    alignItems: 'center',
    borderRadius: 6*Point,
    backgroundColor: COLORS.BORDER_COLOR,
  },
  btnNote: {
    width: 137*Point,
    alignItems: 'center',
    borderRadius: 6*Point,
    backgroundColor: COLORS.PRIMARY,
  },
  btnSkipGuide:{
    paddingVertical: 12*Point,
    width:83*Point,
    borderRadius:6*Point,
    backgroundColor: COLORS.BLUE_SKIP,
    alignItems: 'center',
  },

  btnNextGuide:{
    paddingVertical: 12*Point,
    width:83*Point,
    borderRadius:6*Point,
    backgroundColor: COLORS.LIGHT_ORANGE,
    alignItems: 'center',
  },
  
  container: {
    position: "absolute",
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    backgroundColor: COLORS.TEXT_GRAY
  },
  imgDone: {
    marginTop: 30.5*Point,
    width: 160*Point,
    height: 102*Point
  },
  imgArrow:{
    width:34*Point,
    height:91*Point,
    marginTop:32*Point,
    marginLeft:'auto',
    marginRight:58*Point
  },
  indicator:{
    width:36*Point,
    height:2*Point,
    borderRadius:1.6*Point,
    marginRight:6.4*Point
  },
  itemTilte:{
    fontSize:16*Point,
    fontWeight:'bold',
    color:COLORS.LIGHT_WHITE
  },
  line:{
    width:'100%',
    height:1*Point,
    backgroundColor: COLORS.BORDER_COLOR,
  },
  imgGuide: {
    width: 20*Point,
    height: 57*Point,
    marginLeft: "auto",
    marginRight: 77*Point,
    marginTop: 4*Point
  },
  txtHeader: {
    fontSize: 16*Point,
    lineHeight: 24*Point,
    color: COLORS.TEXT_BLACK
  },
  txtHappy: {
    fontSize: 14*Point,
    color: COLORS.TEXT_GRAY,
    textAlign: 'center',
  },
  txtGuide: {
    fontSize: 13*Point,
    color: COLORS.TEXT_BLACK,
    textAlign: 'center',
  },
  txtSkip:{
    fontSize:14*Point,
    fontWeight:'bold',
    color:COLORS.TEXT_GRAY,
    lineHeight:16*Point
  },
  txtNote:{
    fontSize:14*Point,
    fontWeight:'bold',
    color:COLORS.WHITE,
    lineHeight:16*Point
  },
  txtButton:{
    fontSize:13*Point,
    lineHeight:15*Point,
    color:COLORS.WHITE,
    fontWeight:'bold'
  },
  txtItemTitle:{
    fontSize:16*Point,
    lineHeight:24*Point,
    color:COLORS.LIGHT_WHITE,
    marginTop:36*Point
  },
  txtItemGuide:{
    fontSize:13*Point,
    color:COLORS.LIGHT_WHITE
  },
  txtItemGuideHighLight:{
    fontSize:13*Point,
    color:COLORS.LIGHT_ORANGE
  },
  viewHeader:{
    marginTop:21*Point,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewContent: {
    backgroundColor: COLORS.WHITE,
    marginTop: 76*Point,
    // flex: 1,
    borderRadius:6*Point,
    width:'100%',
    paddingBottom: 32*Point,
    marginBottom: 96*Point,
    alignItems: "center"
  },
  viewIndicator:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop:35*Point,
   
  },
  viewHeaderContent: {
    alignItems: "center"
  }
});
