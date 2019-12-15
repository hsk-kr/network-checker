const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../db/models/User");
const Token = require("../../routes/middlewares/token");

// validate login information.
const validateUserInfo = (username, password) => {
  const regexUsername = /^[a-z0-9]{4,20}$/;
  const regexPassword = /^[\w!@#$%^&*()]{8,20}$/;

  return regexUsername.test(username) && regexPassword.test(password);
};

// create a user
exports.createUser = (req, res) => {
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

  const SALT_ROUNDS = 10;
  bcrypt.hash(password, SALT_ROUNDS, (err, encrypted) => {
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
          message: "User doesn't exists"
        });
      }
    }
  );
};