import { takeEvery, all, call } from "redux-saga/effects";
import { chainParse } from "~/src/utils";
import { noop } from "~/src/store/actions/common";

import api from "~/src/store/api";
import { createRequestSaga } from "~/src/store/sagas/common";
import { setListDebt, setListDebtSearch,setDebtBookInfo } from "~/src/store/actions/debtManage";
export const requestGetListDebts = createRequestSaga({
  request: api.debtManage.getListDebt,
  key: "debtManage/getListDebt",
  success: [
    data => {
      const result = chainParse(data, ["content"]);
      const time = chainParse(data, ["args"]);

      if (data) {
        return setListDebt(data);
      }
      return noop("");
    }
  ]
});
export const requestGetDebtBookInfo = createRequestSaga({
  request: api.debtManage.getDebtBookInfo,
  key: "debtManage/getDebtBookInfo",
  success: [
    data => {
      if (data) {
        return setDebtBookInfo(data);
      }
      return noop("");
    }
  ]
});
export const requestDeleteDebt = createRequestSaga({
  request: api.debtManage.deleteDebt,
  key: "debtManage/deleteDebt"
});
export const requestCreateDebt = createRequestSaga({
  request: api.debtManage.createDebt,
  key: "debtManage/createDebt"
});
export const requestUpdateDebt = createRequestSaga({
  request: api.debtManage.updateDebt,
  key: "debtManage/updateDebt"
});
export const requestSearchDebt = createRequestSaga({
  request: api.debtManage.searchDebt,
  key: "debtManage/searchDebt",
  success: [
    data => {
      const result = chainParse(data, ["content"]);
      const time = chainParse(data, ["args"]);

      if (data) {
        return setListDebtSearch(data);
      }
      return noop("");
    }
  ]
});
export const requestGetDebtInfo = createRequestSaga({
  request: api.debtManage.getDebtDetail,
  key: "debtManage/getDebtDetail"
});
export default function* fetchWatcher() {
  yield all([
    takeEvery("debtManage/createDebt", requestCreateDebt),
    takeEvery("debtManage/searchDebt", requestSearchDebt),
    takeEvery("debtManage/getListDebt", requestGetListDebts),
    takeEvery("debtManage/deleteDebt", requestDeleteDebt),
    takeEvery("debtManage/updateDebt", requestUpdateDebt),
    takeEvery("debtManage/getDebtBookInfo",requestGetDebtBookInfo),
    takeEvery("debtManage/getDebtDetail",requestGetDebtInfo)
  ]);
}
