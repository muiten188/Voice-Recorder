import { takeEvery, all, call } from "redux-saga/effects";
import { chainParse } from "~/src/utils";
import { noop } from "~/src/store/actions/common";

import api from "~/src/store/api";
import { createRequestSaga } from "~/src/store/sagas/common";
import { setListCost,setTotalCost ,setListCostSearch} from "~/src/store/actions/costManage";
import { setListCostGroup } from "../actions/costManage";
export const requestGetListCosts = createRequestSaga({
  request: api.costManage.getListCost,
  key: "costManage/getListCost",
  success: [
    data => {
      const result = chainParse(data, ["content"]);
      const time = chainParse(data, ["args"]);

      if (data) {
        return setListCost(data);
      }
      return noop("");
    }
  ]
});
export const requesSearchCost = createRequestSaga({
  request: api.costManage.searchCost,
  key: "costManage/searchCost",
  success: [
    data => {
      const result = chainParse(data, ["content"]);
      const time = chainParse(data, ["args"]);

      if (data) {
        return setListCostSearch(data);
      }
      return noop("");
    }
  ]
});
export const requestDeleteCost = createRequestSaga({
  request: api.costManage.deleteCost,
  key: "costManage/deleteCost"
});
export const requestCreateCost = createRequestSaga({
  request: api.costManage.createCost,
  key: "costManage/createCost"
});
export const requestUpdateCost = createRequestSaga({
  request: api.costManage.updateCost,
  key: "costManage/updateCost"
});
export const requestGetCostInfo = createRequestSaga({
  request: api.costManage.getCostInfo,
  key: "costManage/getCostInfo"
});

/////////// cost group
export const requestGetListCostGroup = createRequestSaga({
  request: api.costManage.getListCostGroup,
  key: "costManage/getListCostGroup",
  success: [
    data => {
      if (data&& data.updated && data.updated.result) {
        return setListCostGroup(data.updated.result);
      }
      return noop()
    }
  ]
});
export const requestCreateCostGroup = createRequestSaga({
  request:api.costManage.createCostGroup,
  key:'costManage/createCostGroup',
})
export const requestGetCostGroupDetail = createRequestSaga({
  request:api.costManage.getCostGroupDetail,
  key:'costManage/getCostGroupDetail'
})
export const requestGetTotalCost = createRequestSaga({
  request:api.costManage.getTotalCost,
  key:'costManage/getTotalCost',
  success:[
    data => {
      if (data) {
        if(typeof(data.totalAmount)!='undefined')
        // if(data.)
        // console.log(data)
        return setTotalCost(data.totalAmount)
      }
      return noop()
    }
  ]
})
export const requestDeleteCostGroup=createRequestSaga({
  request:api.costManage.deleteCostGroup,
  key:'costManage/deleteCostGroup'
})
export default function* fetchWatcher() {
  yield all([
    takeEvery("costManage/getListCost", requestGetListCosts),
    takeEvery("costManage/createCost", requestCreateCost),
    takeEvery("costManage/deleteCost", requestDeleteCost),
    takeEvery("costManage/updateCost", requestUpdateCost),
    takeEvery("costManage/searchCost", requesSearchCost),
    takeEvery("costManage/getCostInfo", requestGetCostInfo),
    takeEvery('costManage/getListCostGroup', requestGetListCostGroup),
    takeEvery("costManage/createCostGroup",requestCreateCostGroup),
    takeEvery("costManage/getCostGroupDetail",requestGetCostGroupDetail),
    takeEvery('costManage/getTotalCost',requestGetTotalCost),
    takeEvery("costManage/deleteCostGroup",requestDeleteCostGroup)
  ]);
}
