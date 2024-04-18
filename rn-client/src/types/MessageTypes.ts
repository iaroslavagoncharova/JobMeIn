import {Attachment, Test, Swipe, User} from './DBTypes';

type MessageResponse = {
  message: string;
};

type MediaResponse = MessageResponse & {
  media: Attachment | Attachment[];
};

type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    media_type: string;
    filesize: number;
  };
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

type TestResponse = MessageResponse & {
  test: Test;
};

export type {
  MessageResponse,
  MediaResponse,
  UploadResponse,
  ErrorResponse,
  UserResponse,
  LoginResponse,
  SwipeResponse,
  TestResponse,
};
