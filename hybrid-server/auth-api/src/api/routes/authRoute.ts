import express from 'express';
import {login} from '../controllers/authController';
import {body} from 'express-validator';

const authRoute = express.Router();

authRoute.post(
  '/login',
  body('email').isEmail().normalizeEmail().isString(),
  body('password').isLength({min: 8, max: 20}).isString().notEmpty(),
  login
);

export default authRoute;
