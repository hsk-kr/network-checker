import React, { Component } from 'react';
import './Join.css';

export default class Join extends Component {

  constructor(props) {
    super(props);

    this.inputUsername = React.createRef();
    this.inputPwd = React.createRef();
    this.inputRepwd = React.createRef();

    this.state = {
      isUsernameValidated: false,
      isPwdValidated: false,
      isRepwdValidated: false
    };
  }

  handleChangeUsername = (e) => {
    const Username = e.target.value;
    let regex = /^[a-z0-9]{4,20}$/;

    this.setState({
      isUsernameValidated: regex.test(Username)
    });
  }

  handleChangePwd = (e) => {
    const passwd = e.target.value;
    let regex = /^[\w!@#$%^&*()]{8,20}$/;

    this.setState({
      isPwdValidated: regex.test(passwd)
    });
  }

  handleChangeRepwd = () => {
    this.setState({
      isRepwdValidated: this.inputPwd.current.value === this.inputRepwd.current.value
    });
  }

  render() {
    const { isUsernameValidated, isPwdValidated, isRepwdValidated } = this.state;

    return (
      <div className='sign-up-container row justify-content-center'>
        <form className='sign-up-form col-10 col-sm-10 col-md-6 col-lg-6'>
          <div className="sign-up-message-title text-center w-100">CREATE ACCOUNT</div>
          <div className="form-group">
            <label htmlFor="Username">Username</label>
            <input type="text" ref={this.inputUsername} className={`form-control ${isUsernameValidated ? "is-valid" : "is-invalid"}`} id="Username" maxLength="20" onChange={this.handleChangeUsername} />

            <div className="valid-feedback">The Username has been Validated.</div>
            <div className="invalid-feedback">Username must be composed of at least 4 letters (It can be small letter or number) and the maximum of length is 20.</div>
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Password</label>
            <input type="password" ref={this.inputPwd} className={`form-control ${isPwdValidated ? "is-valid" : "is-invalid"}`} id="pwd" maxLength="20" onChange={this.handleChangePwd} />

            <div className="valid-feedback">The password has been Validated.</div>
            <div className="invalid-feedback">Password must be composed of at least 8 letters (It can be small letter or number or special charactes) and the maximum of length is 20.</div>
          </div>
          <div className="form-group">
            <label htmlFor="repwd">Re-enter Password</label>
            <input type="password" ref={this.inputRepwd} className={`form-control ${isRepwdValidated ? "is-valid" : "is-invalid"}`} id="repwd" maxLength="20" onChange={this.handleChangeRepwd} />

            <div className="valid-feedback">GOOD!</div>
            <div className="invalid-feedback">The passwords supposed to be the same.</div>
          </div>
          <div className="form-group">
            <button type="button" className="btn btn-success">Create Your Account</button>
          </div>
        </form>
      </div>
    )
  }
}