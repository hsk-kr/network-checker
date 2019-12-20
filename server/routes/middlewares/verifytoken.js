const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  let authorization = req.header('Authorization');

  if (authorization) {
    authorization = authorization.split(' ');
  } else {
    return res.status(401).json({
      message: 'Authorization failed'
    });
  }

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
        req.user = decoded.existingUser;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: 'Authorization failed'
    });
  }
};