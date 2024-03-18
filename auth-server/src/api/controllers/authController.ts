import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import {LoginResponse} from '@sharedTypes/MessageTypes';
import {getUserByEmail} from '../models/userModel';
import {UserWithLevel, TokenContent} from '@sharedTypes/DBTypes';
import {validationResult} from 'express-validator';

const login = async (
  req: Request<{}, {}, {email: string; password: string}>,
  res: Response<LoginResponse>,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}`)
      .join(', ');
    console.log('login validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const {email, password} = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      next(new CustomError('Incorrect email/password', 403));
      return;
    }

    if (user.password && !bcrypt.compareSync(password, user.password)) {
      next(new CustomError('Incorrect email/password', 403));
      return;
    }

    if (!process.env.JWT_SECRET) {
      next(new CustomError('JWT secret not set', 500));
      return;
    }

    // delete user.password before sending data back to client
    const outUser: Omit<UserWithLevel, 'password'> = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      phone: user.phone,
      about_me: user.about_me,
      status: user.status,
      user_type: user.user_type,
      link: user.link,
      field: user.field,
      level_name: user.level_name,
    };

    const tokenContent: TokenContent = {
      user_id: user.user_id,
      level_name: user.level_name,
    };

    const token = jwt.sign(tokenContent, process.env.JWT_SECRET);

    const message: LoginResponse = {
      message: 'Login successful',
      token,
      user: outUser,
    };

    res.json(message);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {login};
