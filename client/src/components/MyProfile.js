import React, { Component, createRef } from 'react'
import './MyProfile.css';
import { Redirect } from 'react-router-dom';
import { getToken } from '../helper';
import axios from 'axios';

export class MyProfile extends Component {

  constructor(props) {
    super(props);

    this.inputCurPwd = createRef();
    this.inputNewPwd = createRef();
    this.inputNewRepwd = createRef();

    this.state = {
      isNewPwdValidated: false,
      isNewRepwdValidated: false,
      password: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  handleChangeNewPwd = (e) => {
    let regex = /^[\w!@#$%^&*()]{8,20}$/;

    this.setState({
      isNewPwdValidated: regex.test(e.target.value),
      isNewRepwdValidated: this.state.confirmPassword === e.target.value,
      newPassword: e.target.value
    });
  }

  handleChangeNewRepwd = (e) => {
    this.setState({
      confirmPassword: e.target.value,
      isNewRepwdValidated: this.state.newPassword === e.target.value && this.state.isNewPwdValidated
    });
  }

  submitChangePassword = (e) => {
    e.preventDefault();

    const {
      isNewPwdValidated,
      isNewRepwdValidated,
      password,
      newPassword
    } = this.state;

    if (!(isNewPwdValidated && isNewRepwdValidated && password.length > 0)) {
      alert('Please, check your input passwords.');
      return;
    }

    const { API_URL } = require('../constants');
    const { token } = this.props;

    axios({
      url: `${API_URL}/myuser/password`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: {
        password,
        newPassword
      }
    })
      .then((res) => {
        alert('You password has been changed.');

        this.setState({
          password: '',
          newPassword: '',
          confirmPassword: ''
        });
      })
      .catch(e => {
        if (e.response.data.message) {
          alert(e.response.data.message);
        } else {
          alert(e);
        }
      });
  };

  onClickDeleteMyAccount = () => {
    const { API_URL } = require('../constants');
    const { token, deleteToken } = this.props;

    axios.delete(`${API_URL}/myuser`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        deleteToken();
      })
      .catch(e => {
        alert('There is error. try again later.');
      });
  }

  render() {
    const {
      isNewPwdValidated,
      isNewRepwdValidated,
      password,
      newPassword,
      confirmPassword
    } = this.state;
    const { token } = this.props;

    if (!token && !getToken()) {
      return <Redirect to='/' />
    }


    return (
      <div className='my-profile-container row justify-content-center'>
        <div className='col-10 col-sm-10 col-md-6 col-lg-6'>
          <form onSubmit={this.submitChangePassword}>
            <div className="form-group">
              <h2 className='mt-3'>Change Password</h2>
            </div>
            <div className="form-group">
              <label htmlFor="currentPassword" className='mt-3'>Current Password</label>
              <input type="password" id="currentPassword" maxLength="20" className='form-control' value={password} onChange={e => this.setState({ password: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword" className='mt-3'>New Password</label>
              <input type="password" id="newPassword" maxLength="20" value={newPassword} className={`form-control ${isNewPwdValidated ? "is-valid" : "is-invalid"}`} onChange={this.handleChangeNewPwd} />
              <div className="valid-feedback">The password has been Validated.</div>
              <div className="invalid-feedback">Password must be composed of at least 8 letters (It can be small letter or number or special charactes) and the maximum of length is 20.</div>
            </div>
            <div className="form-group">
              <label htmlFor="newPasswordConfirm" className='mt-3'>New Password Confirm</label>
              <input type="password" id="newPasswordConfirm" maxLength="20" value={confirmPassword} className={`form-control ${isNewRepwdValidated ? "is-valid" : "is-invalid"}`} onChange={this.handleChangeNewRepwd} />
              <div className="valid-feedback">GOOD!</div>
              <div className="invalid-feedback">The passwords supposed to be the same.</div>
            </div>
            <div className="form-group">
              <button type='submit' className='btn btn-primary mt-2'>CHANGE</button>
            </div>
          </form>
          <hr />
          <div className='form-group mb-3'>
            <button type='button' className='btn btn-danger' data-toggle="modal" data-target="#delete_confirm_modal">DELETE MY ACCOUNT</button>
          </div>
        </div>
        <div className="modal fade" tabIndex="-1" role="dialog" id="delete_confirm_modal">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">MY ACCOUNT DELETE</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>You really want to delete your account? you can't restore your account again after.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={this.onClickDeleteMyAccount} data-dismiss="modal">Delete</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MyProfile
