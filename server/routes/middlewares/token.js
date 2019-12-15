const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NC_TOKEN_KEY } = process.env;

const token = (data) => jwt.sign(
  data,
  NC_TOKEN_KEY,
  { expiresIn: '2h' }
);

module.exports = token;