import {UpdateUser, User} from './DBTypes';
export type Values = Pick<User, 'email' | 'password'>;
export type AuthContextType = {
  user: User | null;
  handleLogin: (values: Values) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
  handleEdit: (values: UpdateUser) => void;
};
