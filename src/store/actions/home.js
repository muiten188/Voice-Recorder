export const setHome = (data) => ({
    type: 'home/setHome',
    payload: data
})

export const getStatistic = (...args) => ({
    type: 'home/getStatistic',
    args
})


export const setStatistic = (data) => ({
    type: 'home/setStatistic',
    payload: data
})
export const getActivitiesRecent=(...args)=>({
    type:'home/getActivitiesRecent',
    args
})
export const setActivitiesRecent=(data)=>({
    type:'home/setActivitiesRecent',
    payload:data
})