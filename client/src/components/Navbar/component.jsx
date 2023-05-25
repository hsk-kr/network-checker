import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Navbar = ({ token, deleteToken }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="/">
        NETWORK CHECKER
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink className="nav-link" exact activeClassName="active" to="/">
              Home
            </NavLink>
          </li>
          {token ? (
            <>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to="/service"
                >
                  Service
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to="/myprofile"
                >
                  My Profile
                </NavLink>
              </li>
            </>
          ) : null}
        </ul>
        {token ? (
          <div className="form-inline my-2 my-lg-0">
            <button
              className="btn btn-success my-2 my-sm-0"
              type="button"
              onClick={() => deleteToken()}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  token: PropTypes.string.isRequired,
  deleteToken: PropTypes.func.isRequired,
};

export default Navbar;
