import { createStore, applyMiddleware } from 'redux'
import rootReducer from '~/src/store/reducers'
import logger from 'redux-logger'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '~/src/store/sagas'
import { createTransform } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'

const uploadingTransform = createTransform(
    // transform state on its way to being serialized and persisted.

    (inboundState, key) => {
        return inboundState
    },
    // transform state being rehydrated
    (outboundState, key) => {
        if (key != 'meeting') return outboundState
        console.log('outboundState state key meeting', outboundState)
        return { ...outboundState, uploading: false }
    },
)

const persistConfig = {
    key: 'root',
    version: 4,
    storage: AsyncStorage,
    blacklist: ['info'],
    transforms: [uploadingTransform],
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