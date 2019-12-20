import React, { Component, createRef } from 'react'
import './MyProfile.css';

export class MyProfile extends Component {

  constructor(props) {
    super(props);

    this.inputCurPwd = createRef();
    this.inputNewPwd = createRef();
    this.inputNewRepwd = createRef();

    this.state = {
      isNewPwdValidated: false,
      isNewRepwdValidated: false
    };
  }

  handleChangeNewPwd = () => {
    const passwd = this.inputNewPwd.current.value;
    let regex = /^[\w!@#$%^&*()]{8,20}$/;

    this.setState({
      isNewPwdValidated: regex.test(passwd)
    });

    this.handleChangeNewRepwd();
  }

  handleChangeNewRepwd = () => {
    this.setState({
      isNewRepwdValidated: this.inputNewPwd.current.value === this.inputNewRepwd.current.value
    });
  }

  render() {
    const { isNewPwdValidated, isNewRepwdValidated } = this.state;

    return (
      <div className='my-profile-container row justify-content-center'>
        <form className='sign-up-form col-10 col-sm-10 col-md-6 col-lg-6'>
          <div className="form-group">
            <h2 className='mt-3'>Change Password</h2>
          </div>
          <div className="form-group">
            <label htmlFor="currentPassword" className='mt-3'>Current Password</label>
            <input type="password" id="currentPassword" ref={this.inputCurPwd} maxLength="20" className='form-control' />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword" className='mt-3'>New Password</label>
            <input type="password" id="newPassword" ref={this.inputNewPwd} maxLength="20" className={`form-control ${isNewPwdValidated ? "is-valid" : "is-invalid"}`} onChange={this.handleChangeNewPwd} />
            <div className="valid-feedback">The password has been Validated.</div>
            <div className="invalid-feedback">Password must be composed of at least 8 letters (It can be small letter or number or special charactes) and the maximum of length is 20.</div>
          </div>
          <div className="form-group">
            <label htmlFor="newPasswordConfirm" className='mt-3'>New Password Confirm</label>
            <input type="password" id="newPasswordConfirm" ref={this.inputNewPwd} maxLength="20" className={`form-control ${isNewRepwdValidated ? "is-valid" : "is-invalid"}`} onChange={this.handleChangeNewRepwd} />
            <div className="valid-feedback">GOOD!</div>
            <div className="invalid-feedback">The passwords supposed to be the same.</div>
          </div>
          <div className="form-group">
            <button type='button' className='btn btn-primary mt-2'>CHANGE</button>
          </div>
          <hr />
          <div className='form-group mb-3'>
            <button type='button' className='btn btn-danger'>DELETE MY ACCOUNT</button>
          </div>
        </form>
      </div>
    )
  }
}

export default MyProfile
