import {Attachment, Swipe, User} from './DBTypes';

type MessageResponse = {
  message: string;
};

export type MediaResponse = MessageResponse & {
  media: Attachment | Attachment[];
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type UserResponse = MessageResponse & {
  user: User;
};

type LoginResponse = MessageResponse & {
  token: string;
  message: string;
  user: User;
};

type SwipeResponse = MessageResponse & {
  swipe: Swipe;
};

export type {
  MessageResponse,
  ErrorResponse,
  UserResponse,
  LoginResponse,
  SwipeResponse,
};
