import { post, get } from "./common";
export default {
  getListCost: (pGroupId,page=1) => {
    return get("/porder/get-po-by-group", { pGroupId, page });
  },
  createCost: (requestObj) => {
    return post("/porder/create-op-cost", 
      requestObj
    );
  },
  deleteCost:(id)=>{
    return post("/porder/delete",{id})
  },
  updateCost:(requestObj)=>{
    return post("/porder/create-op-cost",requestObj)
  },
  searchCost:(requestObj)=>{
    return get("/porder/search-po",requestObj)
  },
  getCostInfo:(pOrderId)=>{
    return get("/porder/get-po-detail",{pOrderId})
  },
  ///////////////// cost group

  getListCostGroup:()=>{
    return get("/merchant/get-purchase-group")
  },
  createCostGroup:(requestObj)=>{
    return post("/merchant/create-purchase-group",requestObj)
  },
  getCostGroupDetail:(pGroupId)=>{
    return get("/merchant/get-purchase-group-detail",{pGroupId})
  },
  getTotalCost:(pGroupId)=>{
    return get("/porder/get-info-po",{pGroupId})
  },
  deleteCostGroup:(requestObj)=>{
    return post("/merchant/remove-purchase-group",requestObj)
  }
  
};



