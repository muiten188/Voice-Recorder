import { takeLatest, takeEvery, all, select, put, call } from 'redux-saga/effects'
import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { setStatistic ,setActivitiesRecent} from '~/src/store/actions/home'

export const requestGetStatistic = createRequestSaga({
    request: api.home.getStatistic,
    key: 'home/getStatistic',
    success: [
        (data) => {
            if (data && data.hasOwnProperty('totalTransactionAmount')) {
                return setStatistic(data)
            }
            return noop('')
        }
    ]
})
export const requestGetActivitiesRecent = createRequestSaga({
    request:api.home.getActivitiesRecent,
    key:'home/getActivitiesRecent',
    success:[
        (data)=>{
            if (data ) {
                if(data.updated && data.updated.result)
                return  setActivitiesRecent(data.updated.result);
              }
              return noop("");
        }
    ]
})

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('home/getStatistic', requestGetStatistic),
        takeEvery('home/getActivitiesRecent',requestGetActivitiesRecent)
    ])
}


