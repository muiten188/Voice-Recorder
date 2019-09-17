import { createStore, applyMiddleware } from 'redux'
import rootReducer from '~/src/store/reducers'
import logger from 'redux-logger'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '~/src/store/sagas'
import { createTransform } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'

const seachParamTransform = createTransform(
    // transform state on its way to being serialized and persisted.

    (inboundState, key) => {
        if (key != 'order') return inboundState
        const { waitingOrderSearchParam, waitingOrderSearchResult, paidOrderSearchParam, paidOrderSearchResult, ...restOrder } = inboundState
        return restOrder
    },
    // transform state being rehydrated
    (outboundState, key) => {
        return outboundState
    },
)

const migrations = {
    0: (state) => {
        // migration clear out device state
        console.log('clear out device state', state)
        return {
            ...state,
            setting: undefined
        }
    },
}
// migrate: createMigrate(migrations, { debug: true })

const persistConfig = {
    key: 'root',
    version: 4,
    storage: AsyncStorage,
    blacklist: ['info'],
    transforms: [seachParamTransform],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const sagaMiddleware = createSagaMiddleware()
let middleware = [sagaMiddleware];
if (__DEV__) {
    middleware = [...middleware, logger];
} else {
    middleware = [...middleware];
}

// export const config = (initialState = {}) => {
//     const store = createStore(
//         persistedReducer,
//         initialState,
//         applyMiddleware(...middleware)
//     )
//     sagaMiddleware.run(rootSaga)
//     const persistor = persistStore(store)
//     return { store, persistor }
// }

const store = createStore(
    persistedReducer,
    {},
    applyMiddleware(...middleware)
)
sagaMiddleware.run(rootSaga)
const persistor = persistStore(store)
export { store, persistor }