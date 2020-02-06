import React, { useState, useRef, useCallback } from 'react';
import './styles.css';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAutoprefixer, faEtsy } from '@fortawesome/free-brands-svg-icons';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../shared/constants';

const Home = ({ saveToken, token }) => {
  const [isSubmmited, submit] = useState(false);
  const refUsername = useRef();
  const refPassword = useRef();

  const handleLogin = useCallback(
    async e => {
      e.preventDefault();

      const username = refUsername.current.value;
      const password = refPassword.current.value;

      const apiUrl = `${API_URL}/signin`;

      if (isSubmmited) {
        alert(`It's processing...`);
        return;
      }

      submit(true);

      try {
        const res = await axios({
          method: 'POST',
          url: apiUrl,
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            username,
            password,
          },
        });

        if (res.status === 200) {
          saveToken(res.data.token);
        }
      } catch (err) {
        submit(false);
        alert(`username or password is incorrect.`);
      }
    },
    [isSubmmited, saveToken, refUsername, refPassword]
  );

  let html = null;

  if (token) {
    html = (
      <div className="home-container">
        <div className="home-intro-area text-white">
          <div className="row justify-content-center">
            <div className="col-8 text-center animated rubberBand">
              <h1>NETWORK CHECKER</h1>
              <p>We check your networks state for 24/7</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-4 col-lg-4 text-center mt-100 animated fadeIn">
              <h1>
                <FontAwesomeIcon icon={faAutoprefixer} />
              </h1>
              <p className="pt-3 icon-desc">Mornitoring 24/7</p>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-4 text-center mt-100 animated fadeIn delay-1s">
              <h1>
                <FontAwesomeIcon icon={faEtsy} />
              </h1>
              <p className="pt-3 icon-desc">Easy to use</p>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-4 text-center mt-100 animated fadeIn delay-2s">
              <h1>
                <FontAwesomeIcon icon={faCartPlus} />
              </h1>
              <p className="pt-3 icon-desc">
                Available to use as many as you want
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    html = (
      <div className="sign-in-container w-100 row justify-content-center">
        <form
          className="sign-in-form col-10 col-sm-10 col-md-6 col-lg-6"
          onSubmit={handleLogin}
        >
          <div className="sign-in-message-title">SIGN IN</div>
          <div className="form-group">
            <label htmlFor="inputId">Username</label>
            <input
              type="text"
              className="form-control"
              id="inputUsername"
              placeholder="your ID"
              maxLength="20"
              ref={refUsername}
            />
          </div>
          <div className="form-group">
            <label htmlFor="inputPwd">Password</label>
            <input
              type="password"
              className="form-control"
              id="inputPwd"
              placeholder="your Password"
              maxLength="20"
              ref={refPassword}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary form-control">
              Sign In
            </button>
            <Link to="/join" className="btn btn-info form-control">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return html;
};

Home.propTypes = {
  token: PropTypes.string.isRequired,
  saveToken: PropTypes.func.isRequired,
};

export default Home;
