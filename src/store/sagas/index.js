import { fork, takeLatest, takeEvery, all } from 'redux-saga/effects'
import homeSaga from './home'
import authSaga from './auth'
import meetingSagas from './meeting'

// saga must be a function like generator of other functions
export default function* () {
    yield all([
        fork(homeSaga),
        fork(authSaga),
        fork(meetingSagas)
    ])
}