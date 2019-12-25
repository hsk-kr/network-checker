const { ObjectId } = require("mongoose").Types;
const bcrypt = require("bcrypt");
const User = require("../../db/models/User");
const Token = require("../middlewares/token");
require("dotenv").config();

const NC_PASSWORD_SALT_ROUNDS = parseInt(process.env.NC_PASSWORD_SALT_ROUNDS);

// validate login information.
const validateUserInfo = (username, password) => {
  const regexUsername = /^[a-z0-9]{4,20}$/;

  return regexUsername.test(username) && validatePassword(password);
};

const validatePassword = (password) => {
  const regexPassword = /^[\w!@#$%^&*()]{8,20}$/;

  return regexPassword.test(password);
};

/*
  APIs for user
*/

exports.changePassword = (req, res) => {
  const { password, newPassword } = req.body;

  // check parameters
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized"
    });
  } else if (
    !password || !newPassword ||
    !validatePassword(password) || !validatePassword(newPassword)
  ) {
    return res.status(400).json({
      message: "Please, check your password or new password."
    });
  }

  // find user by token.
  User.findById(req.user._id, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        message: "Not authorized"
      });
    }

    // compare password and user's real password
    bcrypt.compare(password, user.password, (err, same) => {
      if (err || !same) {
        return res.status(400).json({
          message: 'incorrect password'
        });
      }

      // hash new password
      bcrypt.hash(newPassword, NC_PASSWORD_SALT_ROUNDS, (err, encrypted) => {
        if (err) {
          return res.status(500).json({
            message: 'Server Error'
          });
        }

        // update the user
        User.updateOne(
          {
            _id: ObjectId(user._id)
          },
          {
            $set: {
              password: encrypted
            }
          },
          (err) => {
            if (err) {
              return res.status(500).json({
                message: 'Server Error'
              });
            }

            return res.status(200).json({
              message: 'Success'
            });
          }
        );
      });
    });
  });
}

exports.deleteMyAccount = (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }

  User.deleteOne({
    _id: ObjectId(req.user._id)
  }, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Server Error'
      });
    }

    return res.status(200).json({
      message: 'Success'
    });
  });
}

// create a user
exports.joinUser = (req, res) => {
  const { username, password } = req.body;

  // validate parameters
  if ((!username || !password) || !validateUserInfo(username, password)) {
    return res.status(400).json({
      message: "Please, check your account data"
    });
  }

  // hash password
  bcrypt.hash(password, NC_PASSWORD_SALT_ROUNDS, (err, encrypted) => {
    // if there is error
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Check your password"
      });
    }

    // check if there is the user or not.
    return User.countDocuments({
      username: username
    }, (err, count) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "There is a problem in the server. please do try again later."
        });
      }

      // if there is a user. 
      if (count > 0) {
        return res.status(401).json({
          message: "Username already exists"
        });
      }

      // create a user by User model.
      const user = new User({
        username,
        password: encrypted
      });

      user
        .save()
        .then((newUser) => {
          newUser.password = null;
          const token = Token({ username });

          return res.status(201).json({
            message: "Success, try to login with your account",
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

  // validate parameters
  if ((!username || !password) || !validateUserInfo(username, password)) {
    return res.status(400).json({
      message: "Please, check your login data"
    });
  }

  // find user by username.
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
        // compare password of parameter and user's real password.
        bcrypt.compare(password, existingUser.password, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              message: 'There is a problem in the server. please do try again later.'
            });
          }

          // if they're same.
          if (result) {
            existingUser.password = null; // It prevents encrypted password to user.
            const token = Token({ existingUser }); // create Token

            res.status(201).json({
              message: "User successfully signed in",
              newUser: existingUser,
              token
            });
          } else {
            return res.status(401).json({
              message: "Password incorrect"
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

exports.getMyUser = (req, res) => {
  // If user is logged in.
  if (req.user && req.user._id) {
    User.findById(req.user._id, (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          message: "Not authorized"
        });
      }

      return res.status(200).json({
        message: "Success",
        user
      });
    });
  } else {
    return res.status(401).json({
      message: "Not authorized"
    });
  }
};

/*
  APIs for admin
*/

exports.getUser = (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      message: "Check the url"
    });
  }

  User.findById(
    req.params.id,
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Server Error or invaild id"
        });
      } else if (!user) {
        return res.status(404).json({
          message: "doesn't exist"
        });
      }

      return res.status(200).json(user);
    });
};

exports.getUsers = (req, res) => {
  User.countDocuments((err, count) => {

    let { start, end, sort, order, filter } = req.query;
    let findOptions = {};
    if (!start) {
      start = 0;
    }
    if (!end) {
      end = count;
    }
    if (!sort) {
      sort = "_id";
    }
    if (!order) {
      order = "ASC";
    }
    if (filter) {
      try {
        const filterOptions = JSON.parse(filter);
        if (filterOptions.q) {
          findOptions = {
            ...findOptions,
            $or: [
              {
                username: new RegExp(filterOptions.q, "gi")
              },
              {
                password: new RegExp(filterOptions.q, "gi")
              }
            ]
          };
        }
      } catch (e) {
        findOptions = {};
      }
    }
    order = order === 'ASC' ? 1 : -1;

    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.set('X-Total-Count', count);

    User
      .find(findOptions)
      .sort({ [sort]: order })
      .skip(Number(start))
      .limit(Number(end) - Number(start))
      .exec((err, users) => {
        if (err) {
          console.error(err);
          return res.status(401).json({
            message: "Not authorized"
          });
        }

        return res.status(200).json(users);
      });
  });
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
      res.status(201).json(user)
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

      return res.status(200).json(result);
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

    return res.status(200).json(result);
  })
};