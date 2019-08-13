import { chainParse } from "~/src/utils";
const initialState = {
  costList: {},
  costListSearch:{},
  costGroupList:[],
  costTotal:""
};
export const costManage = (
  state = initialState,
  { type, payload, timeDate }
) => {
  switch (type) {
    
    case "costManage/setListCost": {
      const pageNumber = +chainParse(payload, ["pagingInfo", "pageNumber"]);
      if (pageNumber <= 1) {
        return {
          ...state,
          costList: payload,
        };
      }
      const payloadContent = chainParse(payload, ["content"]) || [];
      const stateContent = chainParse(state, ["costList", "content"]) || [];
      const statePageNumber = +chainParse(state, [
        "costList",
        "pagingInfo",
        "pageNumber"
      ]);
      if (pageNumber <= statePageNumber) return state;

      return {
        ...state,
        costList: {
          ...payload,
          content: [...stateContent, ...payloadContent]
        }
      };
    }
    case 'costManage/setListCostSearch':{
      const pageNumber = +chainParse(payload, ["pagingInfo", "pageNumber"]);
      if (pageNumber <= 1) {
        return {
          ...state,
          costListSearch: payload,
        };
      }
      const payloadContent = chainParse(payload, ["content"]) || [];
      const stateContent = chainParse(state, ["costList", "content"]) || [];
      const statePageNumber = +chainParse(state, [
        "costList",
        "pagingInfo",
        "pageNumber"
      ]);
      if (pageNumber <= statePageNumber) return state;

      return {
        ...state,
        costListSearch: {
          ...payload,
          content: [...stateContent, ...payloadContent]
        }
      };
    }
    //// cost group

    case 'costManage/setListCostGroup':{
      return{
        ...state,
        costGroupList:payload
      }
    }
    case 'costManage/setTotalCost':{
      return{
        ...state,
        costTotal:payload
      }
    }

    default:
      return state;
  }
};
