import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchUser, deleteToken, saveToken } from '../../redux';
import { getToken } from '../../helpers';

// This component manages token.
const UserInfo = props => {
  const {
    token,
    loading,
    userError,
    fetchUser,
    deleteToken,
    saveToken,
  } = props;

  /* eslint-disable */
  // It
  // When refresh the page, it calls fetchUser again.
  // if the page lose the token, It fetches token from localstorage.
  useEffect(() => {
    if (!loading) {
      if (token) {
        fetchUser(token);
      } else if (!token && getToken()) {
        saveToken(getToken());
      }
    }
  }, [token]);

  // When token is expired or token is unauthoirized, It deletes token.
  useEffect(() => {
    if (userError && token) {
      deleteToken();
    }
  }, [userError]);
  /* eslint-enable */

  return <></>;
};

const mapStateToProps = state => ({
  token: state.token.token,
  loading: state.user.loading,
  userError: state.user.error,
});

const mapDispatchToProps = dispatch => ({
  fetchUser: token => dispatch(fetchUser(token)),
  saveToken: token => dispatch(saveToken(token)),
  deleteToken: () => dispatch(deleteToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
