import React, { useState, useCallback, useEffect } from 'react';
import './styles.css';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import CheckInformation from '../CheckInformation';
import { getToken } from '../../helpers';
import { API_URL } from '../../shared/constants';

const Service = ({ token = getToken() }) => {
  const [chkInfoList, setChkInfoList] = useState([]);
  const [isSubmitted, submit] = useState(false);
  const [alias, setAlias] = useState('');
  const [address, setAddress] = useState('');
  const [port, setPort] = useState('');
  const [deleteCheckInfoId, setDeleteCheckInfoId] = useState(null);

  useEffect(() => {
    getCheckInfoList();
    const tmRefresh = setInterval(() => {
      getCheckInfoList();
    }, 10000);

    return () => {
      clearInterval(tmRefresh);
    };
  }, [token]);

  // Vadliate input values of the checking form.
  const validateCheckingForm = useCallback(() => {
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
  }, [alias, address, port]);

  // get my check information list from API.
  const getCheckInfoList = useCallback(async () => {
    if (token) {
      try {
        const res = await axios.get(`${API_URL}/mychkinfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChkInfoList(res.data);
      } catch {
        console.log('Something went wrong.');
      }
    }
  }, [token]);

  const submitAddingCheckInfo = async (e) => {
    e.preventDefault();

    if (!validateCheckingForm(alias, address, port)) {
      return;
    } else if (!token || isSubmitted) {
      alert("It's processing...");
      return;
    }

    submit(true);

    try {
      await axios.post(
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
      );
      alert('Added the check information');
    } catch (err) {
      if (err) {
        alert('recheck values.');
      }
    }

    getCheckInfoList();
    submit(false);
  };

  // delete selected check information.
  const deleteSelectedCheckInfo = useCallback(async () => {
    if (!deleteCheckInfoId) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/mychkinfo/${deleteCheckInfoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getCheckInfoList();
    } catch {
      console.log('Something went wrong');
    }
  }, [deleteCheckInfoId, token, getCheckInfoList]);

  // select check information for deleting.
  // It's used for callback function of CheckInfomration component.
  const selectDeleteCheckInfo = useCallback((_id) => {
    return () => {
      setDeleteCheckInfoId(_id);
    };
  }, []);

  // It returns request successfully otherwise returns false.
  // It's used for callback function of CheckIfnormation component.
  const submitEditCheckInfo = useCallback(
    (_id) => {
      return async (alias, address, port) => {
        if (!validateCheckingForm(alias, address, port)) {
          return false;
        }

        try {
          await axios({
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
          });

          getCheckInfoList();
        } catch {
          console.log('Something went wrong');
        }
      };
    },
    [getCheckInfoList, validateCheckingForm, token]
  );

  if (!token && !getToken()) {
    return <Redirect to="/" />;
  }

  return (
    <div className="service-container row justify-content-center">
      <div className="col-10 col-sm-10 col-md-10 col-lg-10">
        <form onSubmit={submitAddingCheckInfo}>
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
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                value={port}
                onChange={(e) => setPort(e.target.value)}
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
            {chkInfoList.map((v, i) => {
              return (
                <CheckInformation
                  key={v._id}
                  alias={v.alias}
                  address={v.address}
                  port={v.port}
                  state={v.state}
                  lastCheckedAt={v.lastCheckedAt}
                  onDeleteClick={selectDeleteCheckInfo(v._id)}
                  onEdit={submitEditCheckInfo(v._id)}
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
                onClick={deleteSelectedCheckInfo}
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
};

export default Service;
