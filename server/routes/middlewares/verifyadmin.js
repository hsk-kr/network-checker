// const jwt = require("jsonwebtoken");
const User = require("../../db/models/User");
require("dotenv").config();

module.exports = (req, res, next) => {

  if (req.decoded && req.decoded.username) {
    const { username } = req.decoded;
    User.findOne({ username }, (err, user) => {
      try {
        if (err || !user) {
          throw new Error("db problem or doesn't exist");
        }

        if (user.isAdmin) {
          next();
        } else {
          throw new Error("not admin");
        }

      } catch {
        return res.status(401).json({
          message: 'Authorization failed'
        });
      }
    });
  } else {
    return res.status(401).json({
      message: 'Authorization failed'
    });
  }

};