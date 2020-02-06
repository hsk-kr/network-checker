import localStorage from 'localStorage';
import { LS_TOKEN } from '../shared/constants';

// types
const TOKEN_SAVE = 'TOKEN_SAVE';
const TOKEN_DELETE = 'TOKEN_DELETE';

// actions
export const saveToken = token => {
  localStorage.setItem(LS_TOKEN, token);

  return {
    type: TOKEN_SAVE,
    payload: token,
  };
};

export const deleteToken = () => {
  localStorage.removeItem(LS_TOKEN);

  return {
    type: TOKEN_DELETE,
  };
};

// reducer
const initialState = {
  token: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOKEN_SAVE:
      return {
        token: action.payload,
      };
    case TOKEN_DELETE:
      return {
        token: '',
      };
    default:
      return state;
  }
};

export default reducer;
