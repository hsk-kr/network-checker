const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../db/models/User");
const Token = require("../../routes/middlewares/token");
require("dotenv").config();

// validate login information.
const validateUserInfo = (username, password) => {
  const regexUsername = /^[a-z0-9]{4,20}$/;
  const regexPassword = /^[\w!@#$%^&*()]{8,20}$/;

  return regexUsername.test(username) && regexPassword.test(password);
};

// create a user
exports.joinUser = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Check parameters"
    });
  } else if (!validateUserInfo(username, password)) {
    return res.status(400).json({
      message: "Failed to validate parameters"
    });
  }

  bcrypt.hash(password, process.env.NC_PASSWORD_SALT_ROUNDS, (err, encrypted) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Check your password"
      });
    }

    return User.countDocuments({
      username: username
    }, (err, count) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "There is a problem in the server. please do try again later."
        });
      }

      if (count > 0) {
        return res.status(401).json({
          message: "This user exists"
        });
      }

      const user = new User({
        username,
        password: encrypted
      });

      return user
        .save()
        .then((newUser) => {
          newUser.password = null;
          const token = Token({ username });

          return res.status(201).json({
            message: "User signup successfully",
            newUser,
            token
          });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).json({
            message: "There is a problem in the server. please do try again later."
          });
        });
    })
  });
};

// Login
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Check parameters"
    });
  } else if (!validateUserInfo(username, password)) {
    return res.status(400).json({
      message: "Failed to validate parameters"
    });
  }

  User.findOne(
    { username },
    (err, existingUser) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "There is a problem in the server. please do try again later."
        });
      }

      if (existingUser) {
        bcrypt.compare(password, existingUser.password, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              message: 'There is a problem in the server. please do try again later.'
            });
          }

          if (result) {
            const token = Token({ username });
            existingUser.password = null;

            res.status(201).json({
              message: "User successfully signed in",
              newUser: existingUser,
              token
            });
          } else {
            return res.status(401).json({
              message: "Not authorized"
            });
          }
        });
      } else {
        res.status(401).json({
          message: "User doesn't exist"
        });
      }
    }
  );
};

exports.getUser = (req, res) => {
  if (!req.params.username) {
    return res.status(400).json({
      message: "Check the url"
    });
  }

  User.findOne({
    username: req.params.username
  }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(401).json({
        message: "Not authorized"
      });
    } else if (!user) {
      return res.status(404).json({
        message: "doesn't exist"
      });
    }

    return res.status(200).json({
      message: "Success",
      user
    });
  })
};

exports.createUser = (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: "Check the url and parameters"
    });
  }

  const newUser = new User(req.body);
  newUser
    .save()
    .then((user) => {
      res.status(201).json({
        message: "OK",
        user
      })
    })
    .catch((e) => {
      console.error(e);
      res.status(500).json({
        message: 'There is a problem in the server. please do try again later.'
      });
    });
}

exports.putUser = (req, res) => {
  if (!req.params.id || !req.body.username || !req.body.password
    || !req.body.isAdmin || !req.body.createdAt) {
    return res.status(400).json({
      message: "Check the url and parameters"
    });
  }

  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      useFindAndModify: true
    },
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: 'There is a problem in the server. please do try again later.'
        });
      } else if (!result) {
        return res.status(401).json({
          message: "This user doesn't exist"
        });
      }

      return res.status(200).json({
        message: "updated",
        result
      });
    }
  );
};

exports.deleteUser = (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      message: "Check the url"
    });
  }

  User.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: 'There is a problem in the server. please do try again later.'
      });
    } else if (!result) {
      return res.status(401).json({
        message: "This user doesn't exist"
      });
    }

    return res.status(200).json({
      message: "deleted",
      result
    });
  })
};