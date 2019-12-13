import React, { Component } from 'react'
import './Service.css'

export class Service extends Component {
  render() {
    return (
      <div className='service-container row justify-content-center'>
        <div className='col-10 col-sm-10 col-md-10 col-lg-10'>
          <div className='service-title'>CHECKING FORM</div>
          <hr />
          <div className="form-group row">
            <label htmlFor="alias" className="col-sm-2 col-form-label col-form-label-sm">ALIAS</label>
            <div className="col-sm-10">
              <input type="text" className="form-control form-control-sm" id="alias" placeholder="MY SERVER" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="domain" className="col-sm-2 col-form-label col-form-label-sm">IP ADDRESS (OR DOMAIN)</label>
            <div className="col-sm-10">
              <input type="text" className="form-control form-control-sm" id="domain" placeholder="192.168.168.1 | www.naver.com" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="port" className="col-sm-2 col-form-label col-form-label-sm">PORT</label>
            <div className="col-sm-10">
              <input type="text" className="form-control form-control-sm" id="port" placeholder="80" />
            </div>
          </div>
          <div className="form-group">
            <button type="button" className="btn btn-sm btn-info">ADD</button>
          </div>
          <hr />
          <div className='service-title'>CHECKING LIST</div>
          <hr />
          <div className="card">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <h5 className="card-title">MY SERVER : 192.168.0.1:80 <span className="badge badge-success">ON</span></h5>
                <h6 className="card-subtitle mb-2 text-muted">Last checked date: <span>2019-12-13 21:25</span></h6>
                <a href="/" className="card-link">EDIT</a>
                <a href="/" className="card-link">DELETE</a>
              </li>
              <li className="list-group-item">
                <h5 className="card-title">MY SERVER 2 : 192.168.0.1:81 <span className="badge badge-danger">OFF</span></h5>
                <h6 className="card-subtitle mb-2 text-muted">Last checked date: <span>2019-12-13 21:25</span></h6>
                <a href="/" className="card-link">EDIT</a>
                <a href="/" className="card-link">DELETE</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Service