import {Attachment, Swipe, User} from './DBTypes';

type MessageResponse = {
  message: string;
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

type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    media_type: string;
    filesize: number;
  };
};

export type MediaResponse = MessageResponse & {
  media: Attachment | Attachment[];
};

export type {
  MessageResponse,
  ErrorResponse,
  UserResponse,
  LoginResponse,
  SwipeResponse,
  UploadResponse,
};
