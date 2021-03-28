import sessionReducer from './sessionReducer';
import userReducer from './userReducer';
import { combineReducers } from 'redux';

export const Reducers = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer
});