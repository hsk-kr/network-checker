import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import tokenReducer from './token';
import userReducer from './user';

export { saveToken, deleteToken } from './token';
export { fetchUser } from './user';
export default createStore(combineReducers({
  token: tokenReducer,
  user: userReducer
}), applyMiddleware(thunk));