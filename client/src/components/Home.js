import React, { Component } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAutoprefixer, faEtsy } from "@fortawesome/free-brands-svg-icons";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false
    };
  }

  render() {
    const { isLoggedIn } = this.state;

    let html = null;

    if (isLoggedIn) {
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
          <form className="sign-in-form col-10 col-sm-10 col-md-6 col-lg-6">
            <div className="sign-in-message-title">You need to sign in to use this service.</div>
            <div className="form-group">
              <label htmlFor="inputId">Username</label>
              <input type="text" className="form-control" id="inputUsername" placeholder="your ID" maxLength="20" />
            </div>
            <div className="form-group">
              <label htmlFor="inputPwd">Password</label>
              <input type="text" className="form-control" id="inputPwd" placeholder="your Password" maxLength="20" />
            </div>
            <div className="form-group">
              <button type="button" className="btn btn-primary form-control">Sign In</button>
              <Link to="/join" className="btn btn-info form-control">Sign Up</Link>
            </div>
          </form>
        </div>
      );
    }

    return html;
  }
}