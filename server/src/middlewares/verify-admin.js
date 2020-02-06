import User from '../db/models/user.model';
import * as dotenv from 'dotenv';
import { notFoundError, authorizationError } from './errors';

dotenv.config();

export default async (req, res, next) => {
  try {
    if (!req.user) {
      throw authorizationError();
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw notFoundError('user');
    } else if (!user.isAdmin) {
      throw authorizationError();
    }

    next();
  } catch (err) {
    next(err);
  }
};
