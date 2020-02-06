import React, { Component } from 'react';
import './Join.css';
import axios from 'axios';
import { API_URL } from '../constants';

export default class Join extends Component {
  constructor(props) {
    super(props);

    this.inputUsername = React.createRef();
    this.inputPwd = React.createRef();
    this.inputRepwd = React.createRef();

    this.state = {
      isUsernameValidated: false,
      isPwdValidated: false,
      isRepwdValidated: false,
      isSubmmited: false,
    };
  }

  handleChangeUsername = e => {
    const Username = e.target.value;
    let regex = /^[a-z0-9]{4,20}$/;

    this.setState({
      isUsernameValidated: regex.test(Username),
    });
  };

  handleChangePwd = () => {
    const passwd = this.inputPwd.current.value;
    let regex = /^[\w!@#$%^&*()]{8,20}$/;

    this.setState({
      isPwdValidated: regex.test(passwd),
    });
    this.handleChangeRepwd();
  };

  handleChangeRepwd = () => {
    this.setState({
      isRepwdValidated:
        this.inputPwd.current.value === this.inputRepwd.current.value,
    });
  };

  submitSignUp = () => {
    const {
      isUsernameValidated,
      isPwdValidated,
      isRepwdValidated,
      isSubmmited,
    } = this.state;

    if (isSubmmited) {
      alert("It's processing...");
      return;
    } else if (!isUsernameValidated || !isPwdValidated || !isRepwdValidated) {
      alert('Please, recheck your account data.');
      return;
    }

    const apiUrl = `${API_URL}/signup`;

    axios({
      method: 'POST',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: this.inputUsername.current.value,
        password: this.inputPwd.current.value,
      },
    })
      .then(res => {
        this.setState({
          isSubmmited: false,
        });

        alert('Sign up success.');
        window.location.href = '/';
      })
      .catch(e => {
        this.setState({
          isSubmmited: false,
        });

        if (e.response.status === 400) {
          alert('Username already exists.');
        }
      });
  };

  render() {
    const {
      isUsernameValidated,
      isPwdValidated,
      isRepwdValidated,
    } = this.state;

    return (
      <div className="sign-up-container row justify-content-center">
        <form className="sign-up-form col-10 col-sm-10 col-md-6 col-lg-6">
          <div className="sign-up-message-title text-center w-100">
            CREATE ACCOUNT
          </div>
          <div className="form-group">
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              ref={this.inputUsername}
              className={`form-control ${
                isUsernameValidated ? 'is-valid' : 'is-invalid'
              }`}
              id="Username"
              maxLength="20"
              onChange={this.handleChangeUsername}
            />

            <div className="valid-feedback">
              The Username has been Validated.
            </div>
            <div className="invalid-feedback">
              Username must be composed of at least 4 letters (It can be small
              letter or number) and the maximum of length is 20.
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="pwd">Password</label>
            <input
              type="password"
              ref={this.inputPwd}
              className={`form-control ${
                isPwdValidated ? 'is-valid' : 'is-invalid'
              }`}
              id="pwd"
              maxLength="20"
              onChange={this.handleChangePwd}
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
            <label htmlFor="repwd">Re-enter Password</label>
            <input
              type="password"
              ref={this.inputRepwd}
              className={`form-control ${
                isRepwdValidated ? 'is-valid' : 'is-invalid'
              }`}
              id="repwd"
              maxLength="20"
              onChange={this.handleChangePwd}
            />

            <div className="valid-feedback">GOOD!</div>
            <div className="invalid-feedback">
              The passwords supposed to be the same.
            </div>
          </div>
          <div className="form-group">
            <button
              type="button"
              className="btn btn-success"
              onClick={this.submitSignUp}
            >
              Create Your Account
            </button>
          </div>
        </form>
      </div>
    );
  }
}
