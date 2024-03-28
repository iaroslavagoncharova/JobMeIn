import React, {createContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {AuthContextType, Values} from '../types/LocalTypes';
import {User} from '../types/DBTypes';
import {useAuth, useUser} from '../hooks/apiHooks';

const UserContext = createContext<AuthContextType | null>(null);

const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const {postLogin} = useAuth();
  const {getUserByToken} = useUser();

  const handleLogin = async (values: Values) => {
    try {
      const result = await postLogin(values);
      if (result) {
        AsyncStorage.setItem('token', result.token);
        setUser(result.user);
        console.log(result.user, 'result.user', result.token, 'result.token');
      }
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };

  const handleAutoLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token, 'token');
      if (token) {
        const result = await getUserByToken(token);
        if (result) {
          setUser(result.user);
        }
      }
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        handleLogin,
        handleLogout,
        handleAutoLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export {UserProvider, UserContext};
