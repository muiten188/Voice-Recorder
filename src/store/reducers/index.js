import { combineReducers } from 'redux';
import { auth } from '~/src/store/reducers/auth'
import { info } from '~/src/store/reducers/info'
import localRecord from '~/src/store/reducers/localRecord'
import meeting from '~/src/store/reducers/meeting'
import setting from '~/src/store/reducers/setting'
import transcription from '~/src/store/reducers/transcription'
import user from '~/src/store/reducers/user'


const rootReducer = combineReducers({
    auth,
    info,
    localRecord,
    meeting,
    transcription,
    setting,
    user
});

export default rootReducer;