import { API_URL, LS_NCTOKEN } from '../constants';
import axios from 'axios';

const authProvider = {
  login: ({ username, password }) => {
    return axios({
      url: `${API_URL}/signin`,
      method: 'POST',
      data: {
        username,
        password
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        const { token } = res.data;
        localStorage.setItem(LS_NCTOKEN, token);
      })
      .catch(error => {
        console.error(error);
      });
  },
  logout: () => {
    localStorage.removeItem(LS_NCTOKEN);
    return Promise.resolve();
  },
  checkError: error => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem(LS_NCTOKEN);
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem(LS_NCTOKEN)
      ? Promise.resolve()
      : Promise.reject();
  },
  getPermissions: () => {
    return Promise.resolve();
  }
};

export default authProvider;