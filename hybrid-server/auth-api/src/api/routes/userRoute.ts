import express from 'express';
import {addUser, getAllUsers, getUserById} from '../controllers/userController';
import {body} from 'express-validator';

const userRoute = express.Router();

userRoute.get('/', getAllUsers);

userRoute.post(
  '/',
  body('password')
    .isString()
    .notEmpty()
    .isLength({min: 8, max: 20})
    .isString()
    .escape()
    .trim(),
  body('email').isEmail().normalizeEmail().isString(),
  body('fullname').isString().notEmpty().isString().escape().trim(),
  body('user_type').isString().notEmpty().isString().escape().trim(),
  addUser
);

userRoute.get('/:id', getUserById);

export default userRoute;
