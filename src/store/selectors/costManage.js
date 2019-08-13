import { chainParse } from '~/src/utils'
export const costManageListSelector = (state) => chainParse(state, ['costManage', 'costList'])
export const costListSearchSelector=(state)=>chainParse(state,['costManage','costListSearch'])
export const timeDateCostSelecttor = (state) => chainParse(state, ['costManage', 'timeDate'])

export const costGroupListSelector= (state)=>chainParse(state,['costManage','costGroupList'])
export const costTotalSelector =(state)=>chainParse(state,['costManage','costTotal'])