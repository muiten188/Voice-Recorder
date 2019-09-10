import { combineReducers } from 'redux';
import { home } from '~/src/store/reducers/home';
import { auth } from '~/src/store/reducers/auth'
import { info } from '~/src/store/reducers/info'

const rootReducer = combineReducers({
    home,
    auth,
    info,
});

export default rootReducer;