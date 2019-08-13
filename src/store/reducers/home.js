import { chainParse } from "~/src/utils";
const initialState = {
  statistic: {},
  activitiesList: []
};

export const home = (state = initialState, { type, payload }) => {
  switch (type) {
    case "home/setStatistic": {
      return {
        ...state,
        statistic: payload
      };
    }
    case "home/setActivitiesRecent": {
      const pageNumber = +chainParse(payload, ["pagingInfo", "pageNumber"]);
      if (pageNumber <= 1) {
        return {
          ...state,
          activitiesList: payload
        };
      }
      const payloadContent = chainParse(payload, [ "content"]) || [];
      const stateContent = chainParse(state, ["activitiesList", "content"]) || [];
      const statePageNumber = +chainParse(state, [
        "activitiesList",
        "pagingInfo",
        "pageNumber"
      ]);
      if (pageNumber <= statePageNumber) return state;
      return {
        ...state,
        activitiesList: {
          ...payload,
          content: [...stateContent, ...payloadContent]
        }
      };
    }

    case "app/logout": {
      return initialState;
    }

    default:
      return state;
  }
};
