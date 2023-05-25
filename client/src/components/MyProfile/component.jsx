import React, { useState, useEffect } from 'react';
import './styles.css';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { getToken } from '../../helpers';
import axios from 'axios';
import { API_URL } from '../../shared/constants';

const MyProfile = ({ token, deleteToken }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isNewPwdValidated, validateNewPwd] = useState(false);
  const [isConfirmPwdValidated, validateConfirmPwd] = useState(false);

  useEffect(() => {
    const regex = /^[\w!@#$%^&*()]{8,20}$/;

    validateNewPwd(regex.test(newPassword));
    validateConfirmPwd(
      regex.test(newPassword) && confirmPassword === newPassword
    );
  }, [newPassword, confirmPassword]);

  const submit = async e => {
    e.preventDefault();

    if (
      !(
        isNewPwdValidated &&
        isConfirmPwdValidated &&
        currentPassword.length > 0
      )
    ) {
      alert('Please, check your input passwords.');
      return;
    }

    try {
      await axios({
        url: `${API_URL}/myuser/password`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: {
          password: currentPassword,
          newPassword,
        },
      });

      alert('your password has been changed.');

      setCurrentPassword('');
      setConfirmPassword('');
      setNewPassword('');
    } catch (err) {
      if (err.response.status === 400) {
        alert('current password is incorrect.');
      } else {
        alert('Something went wrong.');
      }
    }
  };

  const handleDeleteMyAccount = async () => {
    try {
      await axios.delete(`${API_URL}/myuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      deleteToken();
    } catch {
      alert('Something went wrong.');
    }
  };

  if (!token && !getToken()) {
    return <Redirect to="/" />;
  }

  return (
    <div className="my-profile-container row justify-content-center">
      <div className="col-10 col-sm-10 col-md-6 col-lg-6">
        <form onSubmit={submit}>
          <div className="form-group">
            <h2 className="mt-3">Change Password</h2>
          </div>
          <div className="form-group">
            <label htmlFor="currentPassword" className="mt-3">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              maxLength="20"
              className="form-control"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword" className="mt-3">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              maxLength="20"
              value={newPassword}
              className={`form-control ${
                !newPassword
                  ? ''
                  : isNewPwdValidated
                  ? 'is-valid'
                  : 'is-invalid'
              }`}
              onChange={e => setNewPassword(e.target.value)}
            />
            <div className="valid-feedback">
              The password has been Validated.
            </div>
            <div className="invalid-feedback">
              Password must be composed of at least 8 letters (It can be small
              letter or number or special charactes) and the maximum of length
              is 20.
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="newPasswordConfirm" className="mt-3">
              New Password Confirm
            </label>
            <input
              type="password"
              id="newPasswordConfirm"
              maxLength="20"
              value={confirmPassword}
              className={`form-control ${
                !confirmPassword
                  ? ''
                  : isConfirmPwdValidated
                  ? 'is-valid'
                  : 'is-invalid'
              }`}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <div className="valid-feedback">GOOD!</div>
            <div className="invalid-feedback">
              two password must be the same.
            </div>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary mt-2">
              CHANGE
            </button>
          </div>
        </form>
        <hr />
        <div className="form-group mb-3">
          <button
            type="button"
            className="btn btn-danger"
            data-toggle="modal"
            data-target="#delete_confirm_modal"
          >
            DELETE MY ACCOUNT
          </button>
        </div>
      </div>
      <div
        className="modal fade"
        tabIndex="-1"
        role="dialog"
        id="delete_confirm_modal"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">MY ACCOUNT DELETE</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>
                You really want to delete your account? you can't restore your
                account again after.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteMyAccount}
                data-dismiss="modal"
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MyProfile.propTypes = {
  token: PropTypes.string.isRequired,
  deleteToken: PropTypes.func.isRequired,
};

export default MyProfile;
