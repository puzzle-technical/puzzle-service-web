import sessionReducer from './sessionReducer';
import userReducer from './userReducer';
import systemReducer from './systemReducer';
import { combineReducers } from 'redux';

export const Reducers = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  systemState: systemReducer
});