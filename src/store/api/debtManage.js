import { post, get } from "./common";
export default {
  getListDebt: (requestObj) => {
    return get("/debt/get-list-debt",  requestObj);
  },
  getDebtBookInfo:()=>{
    return get("/debt/get-debt-book-info")
  },
  createDebt: (requestObj) => {
    return post("/debt/create-debt", 
      requestObj
    );
  },
  getDebtDetail:(id)=>{
    return get("/debt/get-debt-detail",{id})
  },
  deleteDebt:(id)=>{
    return post("/debt/delete-debt",{id})
  },
  updateDebt:(requestObj)=>{
    return post("/debt/create-debt",requestObj)
  },
  searchDebt:(requestObj)=>{
    return get("/debt/search-debt",requestObj)
  }
};