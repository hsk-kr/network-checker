import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../helpers';

const CheckInformation = ({
  alias,
  address,
  port,
  state,
  lastCheckedAt,
  onDeleteClick,
  onEdit,
}) => {
  const [isEditing, setEdit] = useState(false);
  const [editAlias, setEditAlias] = useState(alias);
  const [editAddress, setEditAddress] = useState(address);
  const [editPort, setEditPort] = useState(port);

  const handleEdit = useCallback((e) => {
    e.preventDefault();
    setEdit(true);
  }, []);

  const handleCloseEdit = useCallback((e) => {
    e.preventDefault();
    setEdit(false);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (onEdit(editAlias, editAddress, editPort)) {
        setEdit(false);
      }
    },
    [editAlias, editAddress, editPort, onEdit]
  );

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
              onChange={(e) => setEditAlias(e.target.value)}
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
              onChange={(e) => setEditAddress(e.target.value)}
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
              onChange={(e) => setEditPort(e.target.value)}
            />
          </div>
        </div>
        <a href="." onClick={handleSubmit} className="card-link">
          EDIT
        </a>
        <a href="." onClick={handleCloseEdit} className="card-link">
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
      </li>
    );
  }

  return html;
};

CheckInformation.propTypes = {
  alias: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  port: PropTypes.number.isRequired,
  state: PropTypes.bool.isRequired,
  lastCheckedAt: PropTypes.string,
  onDeleteClick: PropTypes.func,
  onEdit: PropTypes.func,
};

export default CheckInformation;
