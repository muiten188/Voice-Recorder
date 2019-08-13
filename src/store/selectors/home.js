import { chainParse } from '~/src/utils'
const emptyObj = {}
const emptyArr=[]

export const statisticSelector = (state) => {
    return chainParse(state, ['home', 'statistic']) || emptyObj
}
export const activitiesSelector= (state)=>{
    return chainParse(state, ['home', 'activitiesList','content']) || emptyObj
}
export const activitiesSelectorHome=(state)=>{
    const activitiesList =  chainParse(state, ['home', 'activitiesList','content']) || emptyArr
    let dataContent =[];
    if(activitiesList.length<6){
        return activitiesList
    }else{
        for(let i=0; i<5; i++){
            dataContent.push(activitiesList[i])
        }
    }
    return dataContent;
}

