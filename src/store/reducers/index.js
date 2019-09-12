import { combineReducers } from 'redux';
import { home } from '~/src/store/reducers/home';
import { auth } from '~/src/store/reducers/auth'
import { info } from '~/src/store/reducers/info'
import localRecord from '~/src/store/reducers/localRecord'

const rootReducer = combineReducers({
    home,
    auth,
    info,
    localRecord
});

export default rootReducer;