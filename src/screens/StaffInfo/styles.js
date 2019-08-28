import { COLORS, SURFACE_STYLES } from "~/src/themes/common";
import { getFontStyle } from "~/src/utils";

export default {
  btnCall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center"
  },
  btnMess: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 24
  },
  name: {
    fontSize: 16,
    lineHeight: 28,
    color: COLORS.TEXT_BLACK
  },
  txtUserName: {
    fontSize: 15,
    lineHeight: 18,
    marginTop: 5,
    color: COLORS.TEXT_BLACK,
    fontWeight: "bold"
  },
  phone: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.TEXT_GRAY
  },
  block: {
    width: "100%"
  },
  header: {
    paddingVertical: 10
  },
  headerText: {
    fontSize: 12,
    lineHeight: 14,
    color: COLORS.TEXT_BLACK
  },
  permissionText: {
    color: COLORS.TEXT_BLACK,
    flex: 1,
    marginRight: 16,
    marginLeft: 24,
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16
  },
  viewSave: {
    // backgroundColor: "red",
    width: "100%",
    // backgroundColor:COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    marginTop: "auto"
  },
  permissionRow: {
    ...SURFACE_STYLES.rowStart,
    paddingVertical: 10
  },
  txtOption: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    lineHeight: 14
  },
  btnReset: {
    borderLeftWidth: 1,
    borderColor: COLORS.FEATURE_BACKGROUND,
    backgroundColor: COLORS.WHITE,
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  btnCopy: {
    borderLeftWidth: 1,
    borderColor: COLORS.FEATURE_BACKGROUND,
    backgroundColor: COLORS.WHITE,
    paddingVertical: 16,
    paddingRight: 16,
    paddingLeft: 12
  }
};
