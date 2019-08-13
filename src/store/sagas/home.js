import { takeLatest, takeEvery, all, select, put, call } from 'redux-saga/effects'
import api from '~/src/store/api'
import { createRequestSaga } from '~/src/store/sagas/common'
import { noop } from '~/src/store/actions/common'
import { setStatistic,setListDebt ,setActivitiesRecent} from '~/src/store/actions/home'
import { Platform, Alert, Linking } from 'react-native'
import { isShowingForceUpdateSelector } from '~/src/store/selectors/info'
import { showForceUpdate, setShowForceUpdate } from '~/src/store/actions/common'
import { hideToast } from '~/src/store/actions/toast'
import I18n from "~/src/I18n"

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

const showForceUpdatePopup = () => {
    return new Promise((resolve, reject) => {
        Alert.alert(
            '',
            I18n.t('hint_force_update'),
            [
                {
                    text: I18n.t('agree'), onPress: () => {
                        resolve(true)
                    }
                },
            ],
            { cancelable: false }
        )
    })
}


const requestShowForceUpdate = function* (action) {
    console.log('requestShowForceUpdate action', action)
    const isShowingForceUpdate = yield select(isShowingForceUpdateSelector)
    console.log('isShowingForceUpdate', isShowingForceUpdate)
    yield put(setShowForceUpdate(action.payload))
    if (isShowingForceUpdate) return
    yield put(setShowForceUpdate(action.payload))
    yield put(hideToast())
    const confirmOpenStore = yield call(showForceUpdatePopup)
    if (!confirmOpenStore) return
    if (Platform.OS == 'android') {
        yield put(showForceUpdate(false))
        Linking.openURL("market://details?id=com.ati.mshop")
    }
}

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('home/getStatistic', requestGetStatistic),
        takeEvery('app/showForceUpdate', requestShowForceUpdate),
        takeEvery('home/getActivitiesRecent',requestGetActivitiesRecent)
    ])
}


