// import { COLORS } from "../../themesnew/common";

import { COLORS ,Point} from "~/src/themes/common";
export default (styles = {
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.GREEN
  },
  indicatorActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.GREEN,
    borderWidth: 1,
    borderColor: COLORS.GREEN
  },
  actionText: {
      position: 'absolute',
      right: 0,
      zIndex: 100
  },
});
