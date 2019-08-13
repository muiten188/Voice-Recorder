import { COLORS, SURFACE_STYLES } from "~/src/themes/common";
import { getFontStyle } from "~/src/utils";

export default {
  name: {
    fontSize: 16,
    lineHeight: 28,
    color: COLORS.TEXT_BLACK
  },
  phone: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.TEXT_GRAY
  },
  block: {
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
  header: {
    paddingVertical: 10
  },
  headerText: {
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.TEXT_BLACK,
    fontWeight: "bold"
    // ...getFontStyle('medium')
  },
  permissionText: {
    color: COLORS.TEXT_BLACK,
    flex: 1,
    marginRight: 16,
    marginLeft: 24,
    fontWeight:'bold',
    fontSize:14,
    lineHeight:16
},
  permissionRow: {
    ...SURFACE_STYLES.rowStart,
    paddingVertical: 10
  },
  textNote: {
    color: COLORS.TEXT_GRAY,
    fontStyle: "italic"
  }
};
