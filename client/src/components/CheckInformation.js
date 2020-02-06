import React, { useState } from 'react';
import { formatDate } from '../helper';

function CheckInformation(props) {
  const {
    alias,
    address,
    port,
    state,
    lastCheckedAt,
    onDeleteClick,
    editHandler,
  } = props;

  const [isEditing, setEdit] = useState(false);
  const [editAlias, setEditAlias] = useState(alias);
  const [editAddress, setEditAddress] = useState(address);
  const [editPort, setEditPort] = useState(port);

  const onEditClick = e => {
    e.preventDefault();
    setEdit(true);
  };

  const onCloseEditing = e => {
    e.preventDefault();
    setEdit(false);
  };

  const onSubmitEdit = e => {
    e.preventDefault();

    if (editHandler(editAlias, editAddress, editPort)) {
      setEdit(false);
    }
  };

  let html = null;
  if (isEditing) {
    html = (
      <li className="list-group-item">
        <span>If you change this info, its state turns into unchecked.</span>
        <div>
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
              value={editAlias}
              onChange={e => setEditAlias(e.target.value)}
            />
          </div>
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
              value={editAddress}
              onChange={e => setEditAddress(e.target.value)}
            />
          </div>
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
              value={editPort}
              onChange={e => setEditPort(e.target.value)}
            />
          </div>
        </div>
        <a href="." onClick={onSubmitEdit} className="card-link">
          EDIT
        </a>
        <a href="." onClick={onCloseEditing} className="card-link">
          CANCEL
        </a>
      </li>
    );
  } else {
    html = (
      <li className="list-group-item">
        <h5 className="card-title">
          {alias} : {address}:{port}{' '}
          {state ? (
            <span className="badge badge-success">ON</span>
          ) : (
            <span className="badge badge-danger">OFF</span>
          )}
        </h5>
        {lastCheckedAt ? (
          <h6 className="card-subtitle mb-2 text-muted">
            Last checked date: <span>{formatDate(lastCheckedAt)}</span>
          </h6>
        ) : (
          <h6 className="card-subtitle mb-2 text-muted">
            It hasn't been checked by checker yet.
          </h6>
        )}

        <a href="." onClick={onEditClick} className="card-link">
          EDIT
        </a>
        <a
          href="."
          onClick={onDeleteClick}
          className="card-link"
          data-toggle="modal"
          data-target="#delete_confirm_modal"
        >
          DELETE
        </a>
      </li>
    );
  }

  return html;
}

export default CheckInformation;
