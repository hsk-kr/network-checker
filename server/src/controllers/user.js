import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import User from '../db/models/user.model';
import { generateToken } from '../middlewares/token';
import {
  notFoundError,
  validationError,
  incorrectError,
  alreadyExistError,
} from '../middlewares/errors';

dotenv.config();

const { ObjectId } = Types;
const NC_PASSWORD_SALT_ROUNDS = parseInt(process.env.NC_PASSWORD_SALT_ROUNDS);

// validate login information.
const validateUserInfo = (username, password) => {
  const regexUsername = /^[a-z0-9]{4,20}$/;

  return regexUsername.test(username) && validatePassword(password);
};

const validatePassword = password => {
  const regexPassword = /^[\w!@#$%^&*()]{8,20}$/;

  return regexPassword.test(password);
};

//APIs for user

export const changePassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;

    if (
      !password ||
      !newPassword ||
      !validatePassword(password) ||
      !validatePassword(newPassword)
    ) {
      throw validationError();
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      throw notFoundError('User');
    }

    // compare passwords
    const same = await bcrypt.compare(password, user.password);

    if (!same) {
      throw incorrectError('password');
    }

    // hash password
    const encryptedPassword = await bcrypt.hash(
      newPassword,
      NC_PASSWORD_SALT_ROUNDS
    );

    // update password
    const result = await User.updateOne(
      { _id: ObjectId(user._id) },
      { $set: { password: encryptedPassword } }
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteMyAccount = async (req, res, next) => {
  try {
    const result = await User.deleteOne({ _id: ObjectId(req.user._id) });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// create a user
export const joinUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // validate parameters
    if (!username || !password || !validateUserInfo(username, password)) {
      throw validationError();
    }

    // checking whether user already exists
    const count = await User.countDocuments({ username });

    if (count > 0) {
      throw alreadyExistError(`User ${username}`);
    }

    // hash password
    const encryptedPassword = await bcrypt.hash(
      password,
      NC_PASSWORD_SALT_ROUNDS
    );

    const user = new User({ username, password: encryptedPassword });
    const token = generateToken({ username });
    const newUser = await user.save();

    return res.status(201).json({ newUser, token });
  } catch (err) {
    next(err);
  }
};

// Login
export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // validate parameters
    if (!username || !password || !validateUserInfo(username, password)) {
      throw validationError();
    }

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      throw notFoundError(`User ${username}`);
    }

    const same = await bcrypt.compare(password, existingUser.password);

    if (!same) {
      throw incorrectError('password');
    }

    existingUser.password = null; // hide password in data of the response
    const token = generateToken({ existingUser });

    res.status(200).json({ newUser: existingUser, token });
  } catch (err) {
    next(err);
  }
};

export const getMyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// APIs for admin

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      throw notFoundError('user');
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const count = await User.countDocuments();

    // obtain filter options.
    let {
      start = 0,
      end = count,
      sort = '_id',
      order = 'ASC',
      filter,
    } = req.query;

    // context filter
    let contextFilter = {};

    try {
      const { q } = JSON.parse(filter); // text for search

      order = order === 'ASC' ? 1 : -1; // change text to number
      start = Number(start);
      end = Number(end);

      if (q) {
        contextFilter = {
          $or: [
            {
              username: new RegExp(q, 'gi'),
            },
            {
              password: new RegExp(q, 'gi'),
            },
          ],
        };
      }
    } catch (err) {
      throw validationError(req.body);
    }

    const users = await User.find(contextFilter)
      .sort({ [sort]: order })
      .skip(start)
      .limit(end - start);

    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.set('X-Total-Count', count);

    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw validationError(req.body);
    }

    const newUser = new User(req.body);
    const createdUser = await newUser.save();

    res.status(201).json(createdUser);
  } catch (err) {
    next(err);
  }
};

export const putUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, password, isAdmin, createdAt } = req.body;

    if (!username || !password || !isAdmin || !createdAt) {
      throw validationError(req.body);
    }

    const result = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      useFindAndModify: true,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await User.findByIdAndDelete(id);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
