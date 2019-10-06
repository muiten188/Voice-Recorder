import { fork, takeLatest, takeEvery, all } from 'redux-saga/effects'
import authSaga from './auth'
import meetingSagas from './meeting'
import transcriptionSagas from './transcription'
import userSagas from './user'

// saga must be a function like generator of other functions
export default function* () {
    yield all([
        fork(authSaga),
        fork(meetingSagas),
        fork(transcriptionSagas),
        fork(userSagas)
    ])
}