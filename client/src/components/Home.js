import React, { Component, createRef } from 'react';
import './Home.css';
import axios from 'axios';
import { API_URL } from '../constants';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAutoprefixer, faEtsy } from "@fortawesome/free-brands-svg-icons";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isSubmmited: false
    };

    this.refUsername = createRef();
    this.refPassword = createRef();
  }

  handleLogin = (e) => {
    e.preventDefault();

    const username = this.refUsername.current.value;
    const password = this.refPassword.current.value;

    const apiUrl = `${API_URL}/signin`;

    this.setState({
      isSubmmited: true
    });

    axios({
      method: 'POST',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username,
        password
      }
    })
      .then((res) => {
        this.props.saveToken(res.data.token);
        alert(res.data.message);
      })
      .catch((e) => {
        this.setState({
          isSubmmited: false
        });

        if (e.response.data.message) {
          alert(e.response.data.message);
        } else {
          alert(e);
        }
      });
  }

  render() {
    const { token } = this.props;

    let html = null;

    if (token) {
      html = (
        <div className="home-container">
          <div className="home-intro-area text-white">
            <div className="row justify-content-center">
              <div className="col-8 text-center">
                <h1>NETWORK CHECKER</h1>
                <p>This service checks automatically your servers' state for 24/7</p>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 text-center mt-100">
                <h1><FontAwesomeIcon icon={faAutoprefixer} /></h1>
                <p className="pt-3 icon-desc">Mornitoring 24/7</p>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 text-center mt-100">
                <h1><FontAwesomeIcon icon={faEtsy} /></h1>
                <p className="pt-3 icon-desc">Easy to use</p>
              </div>
              <div className="col-12 col-sm-12 col-md-4 col-lg-4 text-center mt-100">
                <h1><FontAwesomeIcon icon={faCartPlus} /></h1>
                <p className="pt-3 icon-desc">Available to use as many as you want</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      html = (
        <div className="sign-in-container w-100 row justify-content-center">
          <form className="sign-in-form col-10 col-sm-10 col-md-6 col-lg-6" onSubmit={this.handleLogin}>
            <div className="sign-in-message-title">You need to sign in to use this service.</div>
            <div className="form-group">
              <label htmlFor="inputId">Username</label>
              <input type="text" className="form-control" ref={this.refUsername} id="inputUsername" placeholder="your ID" maxLength="20" />
            </div>
            <div className="form-group">
              <label htmlFor="inputPwd">Password</label>
              <input type="password" className="form-control" ref={this.refPassword} id="inputPwd" placeholder="your Password" maxLength="20" />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary form-control">Sign In</button>
              <Link to="/join" className="btn btn-info form-control">Sign Up</Link>
            </div>
          </form>
        </div>
      );
    }

    return html;
  }
}