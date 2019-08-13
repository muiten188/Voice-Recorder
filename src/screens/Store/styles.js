import { DEVICE_WIDTH, SURFACE_STYLES, COLORS } from "~/src/themes/common";

export default {
  iconContainer: {
    paddingRight: 10
  },
  labelButton:{
    fontSize:14,
    fontWeight: 'bold',
    color:COLORS.WHITE
  },
  btnLogOut: {
    borderRadius: 6,
    backgroundColor: COLORS.PRIMARY,
    marginTop:16,
    marginHorizontal: 32,
    marginBottom: 24,
    height:48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerHeader: {
    height: 144,
    overflow: "hidden",
    backgroundColor: COLORS.PRIMARY,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  },
  viewAvata: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden'
    // backgroundColor: COLORS.WHITE
  },
  txtName: {
    color: "rgb(156,212,255)",
    fontSize: 12,
    // marginTop: 14,
    fontWeight: 'bold'
  },
  badgeView: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: COLORS.ORANGE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1000
  },
};
