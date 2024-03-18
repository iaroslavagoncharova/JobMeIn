import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express-serve-static-core';
import {getUser} from './api/models/userModel';
import CustomError from './classes/CustomError';
import {TokenUser} from '../../hybrid-types/DBTypes';
import {ErrorResponse} from '../../hybrid-types/MessageTypes';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  console.error('errorHandler', err);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearer = req.headers.authorization;
    if (!bearer) {
      next(new CustomError('No token provided', 401));
      return;
    }
    const token = bearer.split(' ')[1];

    if (!token) {
      next(new CustomError('No token provided', 401));
      return;
    }

    const tokenUser = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenUser;
    console.log(tokenUser, 'token user');

    const user = await getUser(tokenUser.user_id);

    if (!user) {
      next(new CustomError('Invalid token', 403));
      return;
    }

    res.locals.user = user;

    next();
  } catch (e) {
    next(new CustomError((e as Error).message, 400));
  }
};

export {authenticate, errorHandler, notFound};
