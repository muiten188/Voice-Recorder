import { COLORS } from "~/src/themesnew/common";
export default {
  btnAddGroup: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_ORANGE2,
    alignItems: "center",
    paddingVertical: 12
  },
  btnAddCost: {
    flex: 1,
    backgroundColor: COLORS.ORANGE,
    alignItems: "center",
    paddingVertical: 12
  },
  container: {
    backgroundColor: COLORS.BACKGROUND,
    width: "100%",
    flex: 1
  },
  txtAddGroup: {
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 14,
    color: COLORS.ORANGE
  },
  txtAddCost: {
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 14,
    marginLeft: 12,
    color: COLORS.WHITE
  },
  txtNameItem: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.TEXT_BLACK
  },
  txtUpdateItem: {
    color: COLORS.PRIMARY,
    fontSize: 13,
    lineHeight: 15,
    marginLeft: 15
  },
  txtDescription: {
    color: COLORS.TEXT_GRAY,
    fontSize: 12,
    lineHeight: 14,
    marginTop: 4,
  },
  imgDeleteRed: {
    width: 24,
    height: 24,
    marginLeft: 24
  },
  imgChevronRight: {
    height: 10,
    width: 6,
    marginLeft: "auto"
  },
  viewItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE
  },
  viewSearch: {
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    width: "100%",
    height: 48,
    alignItems: "center"
  },
  viewAdd: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    flexDirection: "row"
  },
  viewHeaderList: {
    backgroundColor: COLORS.BACKGROUND,
    height: 38,
    width: "100%",
    paddingLeft: 24,
    justifyContent: "center"
  }
};
