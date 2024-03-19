import { UnauthorizedUser } from "./DBTypes";
type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type UserResponse = MessageResponse & {
  user: UnauthorizedUser;
};

type LoginResponse = MessageResponse & {
  token: string;
  message: string;
  user: UnauthorizedUser;
};

export type { MessageResponse, ErrorResponse, UserResponse, LoginResponse };
