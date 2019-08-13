
export const getListDebt = (...args)=>({
    type: 'debtManage/getListDebt',
    args
})
export const getDebtBookInfo=(...args)=>({
    type:'debtManage/getDebtBookInfo',
    args
})
export const getDebtDetail=(...args)=>({
    type:"debtManage/getDebtDetail",
    args
})
export const setDebtBookInfo=(data)=>({
    type:"debtManage/setDebtBookInfo",
    payload:data
})
export const deleteDebt = (...args)=>({
    type: 'debtManage/deleteDebt',
    args
})
export const createDebt = (...args)=>({
    type:'debtManage/createDebt',
    args
})
export const searchDebt= (...args)=>({
    type:'debtManage/searchDebt',
    args
})
export const setListDebt = (data,timeDate) => ({
    type: 'debtManage/setListDebt',
    payload: data,
    timeDate:timeDate
})
export const updateDebt=(...args)=>({
    type:'debtManage/updateDebt',
    args
})
export const setListDebtSearch=(data)=>({
    type:'debtManage/setListDebtSearch',
    payload:data
})