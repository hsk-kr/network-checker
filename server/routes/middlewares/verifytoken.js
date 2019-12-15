const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authorization = req.header('Authorization').split(' ');

  let token = null;
  if (authorization.length > 1) {
    token = authorization[1];
  }

  if (token) {
    jwt.verify(token, process.env.NC_TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Authorization failed'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: 'Authorization failed'
    });
  }
};