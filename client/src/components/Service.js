import React, { Component } from 'react';
import './Service.css';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import CheckInformation from './CheckInformation';
import { getToken } from '../helper';

export class Service extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chkinfoList: [],
      isSubmitted: false,
      alias: '',
      address: '',
      port: '',
    };
  }

  // Vadliate input values of the checking form.
  validateCheckingForm = (alias, address, port) => {
    const regLengthLimit = /^.{1,50}$/;

    if (!alias || !address || !port) {
      alert('Please, fill input boxes.');
      return false;
    } else if (!regLengthLimit.test(alias)) {
      alert('Length of alias has to be equal and less than 100.');
      return false;
    } else if (!regLengthLimit.test(address)) {
      alert('Length of address has to be equal and less than 100.');
      return false;
    } else if (isNaN(port)) {
      alert('Port has to be number.');
      return false;
    } else if (!(Number(port) >= 1 && Number(port) <= 65535)) {
      alert('Port has to be between 1 and 65535.');
      return false;
    }

    return true;
  };

  // Submit checking form.
  submitAddingCheckInfo = e => {
    e.preventDefault();
    const { isSubmitted, alias, address, port } = this.state;
    const token = this.props.token || getToken();
    const { API_URL } = require('../constants');

    if (!token || isSubmitted) {
      alert("It's processing. please, wait for the server response.");
      return;
    }

    if (!this.validateCheckingForm(alias, address, port)) {
      return;
    }

    this.setState({
      isSubmitted: true,
    });

    axios
      .post(
        `${API_URL}/mychkinfo`,
        {
          alias,
          address,
          port,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then(() => {
        alert('Added the check information');
      })
      .catch(e => {
        if (e.response.data.message) {
          alert(e.response.data.message);
        } else {
          alert(e);
        }
      })
      .finally(() => {
        this.getCheckInfoList();
        this.setState({ isSubmitted: false });
      });
  };

  // get my check information list from API.
  getCheckInfoList = () => {
    const token = this.props.token || getToken();
    const { API_URL } = require('../constants');

    if (token) {
      axios
        .get(`${API_URL}/mychkinfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          console.log(res.data);
          this.setState({
            chkinfoList: res.data,
          });
        });
    }
  };

  // delete selected check information.
  deleteSelectedCheckInfo = () => {
    const token = this.props.token || getToken();
    const { API_URL } = require('../constants');
    const { deleteCheckInfoId } = this.state;

    if (!deleteCheckInfoId) {
      return;
    }

    axios
      .delete(`${API_URL}/mychkinfo/${deleteCheckInfoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .finally(() => {
        this.getCheckInfoList();
      });
  };

  // select check information for deleting.
  // It's used for callback function of CheckInfomration component.
  selectDeleteCheckInfo = _id => {
    return () => {
      this.setState({
        deleteCheckInfoId: _id,
      });
    };
  };

  // It returns request successfully otherwise returns false.
  // It's used for callback function of CheckIfnormation component.
  submitEditCheckInfo = _id => {
    return (alias, address, port) => {
      if (!this.validateCheckingForm(alias, address, port)) {
        return false;
      }

      const token = this.props.token || getToken();
      const { API_URL } = require('../constants');

      axios({
        url: `${API_URL}/mychkinfo/${_id}`,
        method: 'PUT',
        data: {
          alias,
          address,
          port,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).finally(() => {
        this.getCheckInfoList();
      });

      return true;
    };
  };

  componentDidMount() {
    this.getCheckInfoList();
  }

  render() {
    const { token } = this.props;
    const { chkinfoList } = this.state;

    if (!token && !getToken()) {
      return <Redirect to="/" />;
    }

    return (
      <div className="service-container row justify-content-center">
        <div className="col-10 col-sm-10 col-md-10 col-lg-10">
          <form onSubmit={this.submitAddingCheckInfo}>
            <div className="service-title">CHECKING FORM</div>
            <hr />
            <div className="form-group row">
              <label
                htmlFor="alias"
                className="col-sm-2 col-form-label col-form-label-sm"
              >
                ALIAS
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="alias"
                  placeholder="MY SERVER"
                  value={this.state.alias}
                  onChange={e => this.setState({ alias: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="address"
                className="col-sm-2 col-form-label col-form-label-sm"
              >
                IP ADDRESS (OR DOMAIN)
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="address"
                  placeholder="192.168.168.1 | www.naver.com"
                  value={this.state.address}
                  onChange={e => this.setState({ address: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="port"
                className="col-sm-2 col-form-label col-form-label-sm"
              >
                PORT
              </label>
              <div className="col-sm-10">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  id="port"
                  placeholder="80"
                  value={this.state.port}
                  onChange={e => this.setState({ port: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-sm btn-info">
                ADD
              </button>
            </div>
          </form>
          <hr />
          <div className="service-title">CHECKING LIST</div>
          <hr />
          <div className="card">
            <ul className="list-group list-group-flush">
              {chkinfoList.map((v, i) => {
                return (
                  <CheckInformation
                    key={v._id}
                    alias={v.alias}
                    address={v.address}
                    port={v.port}
                    state={v.state}
                    lastCheckedAt={v.lastCheckedAt}
                    onDeleteClick={this.selectDeleteCheckInfo(v._id)}
                    editHandler={this.submitEditCheckInfo(v._id)}
                  />
                );
              })}
            </ul>
          </div>
        </div>
        <div
          className="modal fade"
          tabIndex="-1"
          role="dialog"
          id="delete_confirm_modal"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Check Information Delete</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>You really want to delete this check information?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={this.deleteSelectedCheckInfo}
                  data-dismiss="modal"
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Service;
