import { combineReducers } from 'redux';
import { auth } from '~/src/store/reducers/auth'
import { info } from '~/src/store/reducers/info'
import localRecord from '~/src/store/reducers/localRecord'
import meeting from '~/src/store/reducers/meeting'
import transcription from '~/src/store/reducers/transcription'

const rootReducer = combineReducers({
    auth,
    info,
    localRecord,
    meeting,
    transcription
});

export default rootReducer;