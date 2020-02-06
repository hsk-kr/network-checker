import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const { NC_TOKEN_KEY } = process.env;

export const generateToken = data =>
  jwt.sign(data, NC_TOKEN_KEY, { expiresIn: '12h' });
