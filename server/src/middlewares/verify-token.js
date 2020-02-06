import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { authorizationError } from './errors';

dotenv.config();

export default async (req, res, next) => {
  try {
    let authorization = req.header('Authorization');
    if (authorization) {
      authorization = authorization.split(' ');
    } else {
      throw authorizationError();
    }

    let token = null;
    if (authorization.length > 1) {
      token = authorization[1];
    }

    if (!token) {
      throw authorizationError();
    }

    try {
      const decoded = await jwt.verify(token, process.env.NC_TOKEN_KEY);

      if (!decoded.existingUser || !decoded.existingUser._id) {
        throw new Error();
      }

      req.user = decoded.existingUser;
      next();
    } catch {
      throw authorizationError();
    }
  } catch (err) {
    next(err);
  }
};
