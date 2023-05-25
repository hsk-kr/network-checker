import React, { useState, useEffect } from 'react';
import './styles.css';
import axios from 'axios';
import { API_URL } from '../../shared/constants';

const Join = () => {
  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [repwd, setRepwd] = useState('');

  const [isUsernameValidated, validateUsername] = useState(false);
  const [isPwdValidated, validatePwd] = useState(false);
  const [isRepwdValidated, validateRepwd] = useState(false);
  const [isSubmmited, submit] = useState(false);

  useEffect(() => {
    const regex = /^[a-z0-9]{4,20}$/;
    validateUsername(regex.test(username));
  }, [username]);

  useEffect(() => {
    let regex = /^[\w!@#$%^&*()]{8,20}$/;
    validatePwd(regex.test(pwd));
    validateRepwd(pwd === repwd);
  }, [pwd, repwd]);

  const signUp = async () => {
    if (isSubmmited) {
      alert(`It's processing...`);
      return;
    } else if (!isUsernameValidated || !isPwdValidated || !isRepwdValidated) {
      alert('Please, recheck your account data.');
      return;
    }

    const apiUrl = `${API_URL}/signup`;

    try {
      await axios({
        method: 'POST',
        url: apiUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          username: username,
          password: pwd,
        },
      });

      alert('Sign up success.');
      window.location.href = '/';
    } catch (err) {
      console.log(err);
      submit(false);
      if (err.response.status === 400) {
        alert('Username already exists.');
      } else {
        alert('Something went wrong');
      }
    }
  };

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
            className={`form-control ${
              !username ? '' : isUsernameValidated ? 'is-valid' : 'is-invalid'
            }`}
            id="Username"
            maxLength="20"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <div className="valid-feedback">The Username has been Validated.</div>
          <div className="invalid-feedback">
            Username must be composed of at least 4 letters (It can be small
            letter or number) and the maximum of length is 20.
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="pwd">Password</label>
          <input
            type="password"
            className={`form-control ${
              !pwd ? '' : isPwdValidated ? 'is-valid' : 'is-invalid'
            }`}
            id="pwd"
            maxLength="20"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
          />

          <div className="valid-feedback">The password has been Validated.</div>
          <div className="invalid-feedback">
            Password must be composed of at least 8 letters (It can be small
            letter or number or special charactes) and the maximum of length is
            20.
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="repwd">Re-enter Password</label>
          <input
            type="password"
            className={`form-control ${
              !repwd ? '' : isRepwdValidated ? 'is-valid' : 'is-invalid'
            }`}
            id="repwd"
            maxLength="20"
            value={repwd}
            onChange={e => setRepwd(e.target.value)}
          />

          <div className="valid-feedback">GOOD!</div>
          <div className="invalid-feedback">
            The passwords supposed to be the same.
          </div>
        </div>
        <div className="form-group">
          <button type="button" className="btn btn-success" onClick={signUp}>
            Create Your Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default Join;
