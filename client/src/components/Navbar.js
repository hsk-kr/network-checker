import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false
    };
  }

  render() {
    const { isLoggedIn } = this.state;

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/">NETWORK CHECKER</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/service">Service</Link>
            </li>
          </ul>
          {isLoggedIn ?
            <div className="form-inline my-2 my-lg-0">
              <button className="btn btn-success my-2 my-sm-0" type="submit">Logout</button>
            </div> : null}
        </div>
      </nav>
    )
  }
}

export default Navbar;
