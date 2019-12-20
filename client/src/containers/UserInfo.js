import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchUser, deleteToken, saveToken } from '../redux';
import localStorage from 'localStorage';
import { LS_TOKEN } from '../constants';

const UserInfo = (props) => {
  const {
    token,
    loading,
    userError,
    fetchUser,
    deleteToken,
    saveToken
  } = props;

  /* eslint-disable */
  useEffect(() => {
    if (!loading) {
      if (userError) {
        deleteToken();
      } else if (token) {
        fetchUser(token);
      } else {
        const lsToken = localStorage.getItem(LS_TOKEN);
        saveToken(lsToken);
      }
    }
  }, [token]);
  /* eslint-enable */

  return <></>;
}

const mapStateToProps = (state) => ({
  token: state.token.token,
  loading: state.user.loading,
  user: state.user.user,
  userError: state.user.error
});

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (token) => dispatch(fetchUser(token)),
  saveToken: (token) => dispatch(saveToken(token)),
  deleteToken: () => dispatch(deleteToken())
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);