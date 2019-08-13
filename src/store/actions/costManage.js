
export const getListCost = (...args)=>({
    type: 'costManage/getListCost',
    args
})
export const deleteCost = (...args)=>({
    type: 'costManage/deleteCost',
    args
})
export const createCost = (...args)=>({
    type:'costManage/createCost',
    args
})
export const getCostInfo=(...args)=>({
    type:"costManage/getCostInfo",
    args
})
export const setListCost = (data,timeDate) => ({
    type: 'costManage/setListCost',
    payload: data,
    timeDate:timeDate
})
export const searchCost =(...args)=>({
    type:'costManage/searchCost',
    args
})
export const setListCostSearch=(data)=>({
    type:'costManage/setListCostSearch',
    payload:data
})
export const updateCost=(...args)=>({
    type:'costManage/updateCost',
    args
})

/////////////////////////////////////// cost group

export const getListCostGroup=(...args)=>({
    type:'costManage/getListCostGroup',
    args
})
export const createCostGroup=(...args)=>({
    type:'costManage/createCostGroup',
    args
})
export const getCostGroupDetail=(...args)=>({
    type:'costManage/getCostGroupDetail',
    args
})
export const setListCostGroup=(data)=>({
    type:'costManage/setListCostGroup',
    payload:data
})
export const getTotalCost=(...args)=>({
    type:'costManage/getTotalCost',
    args
})
export const setTotalCost = (data)=>({
    type:"costManage/setTotalCost",
    payload:data
})
export const deleteCostGroup=(...args)=>({
    type:'costManage/deleteCostGroup',
    args
})