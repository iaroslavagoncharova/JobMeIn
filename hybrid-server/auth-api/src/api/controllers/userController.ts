import {NextFunction, Response, Request} from 'express';
import {UnauthorizedUser} from '../../../../hybrid-types/DBTypes';
import {getUsers, getUser} from '../models/userModel';
import CustomError from '../../classes/CustomError';
import {validationResult} from 'express-validator';

const getAllUsers = async (
  req: Request,
  res: Response<UnauthorizedUser[]>,
  next: NextFunction
) => {
  try {
    const users = await getUsers();
    if (users === null) {
      next(new CustomError('Users not found', 404));
      return;
    }
    res.status(200).json(users);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const getUserById = async (
  req: Request<{id: number}>,
  res: Response<UnauthorizedUser>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.type}`)
      .join(', ');
    console.log('userGet validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = await getUser(req.params.id);
    if (user === null) {
      next(new CustomError('User not found', 404));
      return;
    }
    res.json(user);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

export {getAllUsers, getUserById};
