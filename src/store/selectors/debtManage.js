import { chainParse } from "~/src/utils";
import moment from "moment";
const list = [];
// export const debtManageListSelector =state => chainParse(state, ["debtManage", "debtList"]);
export const debtBookInfoSelector = state =>
  chainParse(state, ["debtManage","debtBookInfo"]);

export const debtManageListSelector = (state, type, status) => {
  if (type == 0) {
    if (status == 0) {
      return chainParse(state, ["debtManage", "debtReceivableList"]);
    } else {
      return chainParse(state, ["debtManage", "debtCollectedList"]);
    }
  } else {
    if (status == 0) {
      return chainParse(state, ["debtManage", "debtPayableList"]);
    } else {
      return chainParse(state, ["debtManage", "debtPaidList"]);
    }
  }
};

export const debtListSearchSelector =  (state, type, status) => {
  if (type == 0) {
    if (status == 0) {
      return chainParse(state, ["debtManage", "debtReceivableListSearch"]);
    } else {
      return chainParse(state, ["debtManage", "debtCollectedListSearch"]);
    }
  } else {
    if (status == 0) {
      return chainParse(state, ["debtManage", "debtPayableListSearch"]);
    } else {
      return chainParse(state, ["debtManage", "debtPaidListSearch"]);
    }
  }
};

export const timeDateDebtSelecttor = state =>
  chainParse(state, ["debtManage", "timeDate"]);
