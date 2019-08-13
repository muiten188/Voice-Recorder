import { chainParse } from "~/src/utils";
const initialState = {
  debtList: {},
  debtReceivableList: {},
  debtCollectedList: {},
  debtPayableList: {},
  debtPaidList: {},
  debtBookInfo: {},
  debtReceivableListSearch: {},
  debtCollectedListSearch: {},
  debtPayableListSearch: {},
  debtPaidListSearch: {},
};
export const debtManage = (
  state = initialState,
  { type, payload, timeDate }
) => {
  switch (type) {
    case "debtManage/setListDebt": {
      const pageNumber = +chainParse(payload, ["pagingInfo", "pageNumber"]);
      const args = chainParse(payload, ["args"]);
      const type = args[0].type;
      const status = args[0].status;
      let keyName = "";
      if (type == 0) {
        if (status == 0) {
          keyName = "debtReceivableList";
        } else {
          keyName = "debtCollectedList";
        }
      } else {
        if (status == 0) {
          keyName = "debtPayableList";
        } else {
          keyName = "debtPaidList";
        }
      }
      if (pageNumber <= 1) {
        return {
          ...state,
          [keyName]: payload
        };
       
      }
      const payloadContent = chainParse(payload, ["content"]) || [];
      const stateContent = chainParse(state, [keyName, "content"]) || [];
      const statePageNumber = +chainParse(state, [
        keyName,
        "pagingInfo",
        "pageNumber"
      ]);
      if (pageNumber <= statePageNumber) return state;
      return {
        ...state,
        [keyName]: {
          ...payload,
          content: [...stateContent, ...payloadContent]
        }
      };
  
    }
    case "debtManage/setDebtBookInfo": {
      return {
        ...state,
        debtBookInfo: payload
      };
    }
    case 'debtManage/setListDebtSearch':{
      const pageNumber = +chainParse(payload, ["pagingInfo", "pageNumber"]);
      const args = chainParse(payload, ["args"]);
      const type = args[0].type;
      const status = args[0].status;
      let keyName = "";
      if (type == 0) {
        if (status == 0) {
          keyName = "debtReceivableListSearch";
        } else {
          keyName = "debtCollectedListSearch";
        }
      } else {
        if (status == 0) {
          keyName = "debtPayableListSearch";
        } else {
          keyName = "debtPaidListSearch";
        }
      }
      if (pageNumber <= 1) {
        return {
          ...state,
          [keyName]: payload
        };
       
      }
      const payloadContent = chainParse(payload, ["content"]) || [];
      const stateContent = chainParse(state, [keyName, "content"]) || [];
      const statePageNumber = +chainParse(state, [
        keyName,
        "pagingInfo",
        "pageNumber"
      ]);
      if (pageNumber <= statePageNumber) return state;
      return {
        ...state,
        [keyName]: {
          ...payload,
          content: [...stateContent, ...payloadContent]
        }
      };
    }

    default:
      return state;
  }
};
