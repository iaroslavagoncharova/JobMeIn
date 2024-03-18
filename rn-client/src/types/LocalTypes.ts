import {User, UserWithNoPassword} from '../../../shared-types/DBTypes';

export type Credentials = Pick<User, 'email' | 'password'>;

export type AuthContextType = {
  user: UserWithNoPassword | null;
  handleLogin: (credentials: Credentials) => void;
  handleLogout: () => void;
  handleAutoLogin: () => void;
};
