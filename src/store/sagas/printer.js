import { takeEvery, all, put, call, select } from 'redux-saga/effects'


export const requestPrintFromOrderScreen = function* (action) {
    console.log('Action requestPrintFromOrderScreen', action)
}

// root saga reducer
export default function* fetchWatcher() {
    yield all([
        takeEvery('printer/printFromOrderScreen', requestPrintFromOrderScreen),
    ])
}


