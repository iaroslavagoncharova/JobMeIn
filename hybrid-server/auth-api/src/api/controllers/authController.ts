import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {NextFunction, Request, Response} from 'express';
import {getUserByUsername} from '../models/userModel';
import {LoginResponse} from '@sharedTypes/MessageTypes';
import {User} from '@sharedTypes/DBTypes';
import { validationResult } from 'express-validator';
import CustomError from '../../classes/CustomError';

const login = async (
  req: Request<{}, {}, {email: string; password: string}>,
  res: Response<LoginResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.type}`)
      .join(', ');
    console.log('login validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const {email, password} = req.body;
    console.log(req.body, 'req.body');
    const user = await getUserByUsername(email);
    if (!user) {
      next(new CustomError("Invalid email or the user doesn't exist", 401));
      return;
    }
    if (user.password && !bcrypt.compareSync(password, user.password)) {
      next(new CustomError('Invalid password', 401));
      return;
    }
    if (!process.env.JWT_SECRET) {
      next(new CustomError('JWT_SECRET not found', 500));
      return;
    }

    const removePassword: Omit<
      User,
      'password'> = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      user_level_id: user.user_level_id,
      fullname: user.fullname,
      phone: user.phone,
      user_type: user.user_type,
      about_me: user.about_me,
      status: user.status,
      link: user.link,
      field: user.field,
    };

    const tokenContent = {
      user_id: user.user_id,
    };

    const token = jwt.sign(tokenContent, process.env.JWT_SECRET);

    const message: LoginResponse = {
      message: 'Logged in',
      token,
      user: removePassword,
    };

    res.json(message);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

export {login};
