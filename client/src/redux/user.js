import axios from 'axios';
import { API_URL } from '../constants';

// types
const USER_FETCH_REQUEST = 'USER_FETCH_REQUEST';
const USER_FETCH_SUCCESS = 'USER_FETCH_SUCCESS';
const USER_FETCH_FAILURE = 'USER_FETCH_FAILURE';

// actions
const fetchUserRequest = () => ({
  type: USER_FETCH_REQUEST,
});

const fetchUserSuccess = user => ({
  type: USER_FETCH_SUCCESS,
  payload: user,
});

const fetchUserFailure = error => ({
  type: USER_FETCH_FAILURE,
  payload: error,
});

export const fetchUser = token => {
  return dispatch => {
    dispatch(fetchUserRequest());

    axios
      .get(`${API_URL}/myuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        dispatch(fetchUserSuccess(res.data));
      })
      .catch(e => {
        dispatch(fetchUserFailure(e.response.data));
      });
  };
};

// reducer
const initialState = {
  loading: false,
  user: {},
  error: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_FETCH_REQUEST:
      return {
        loading: true,
      };
    case USER_FETCH_SUCCESS:
      return {
        loading: false,
        user: action.payload,
      };
    case USER_FETCH_FAILURE:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
