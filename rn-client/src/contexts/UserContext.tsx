import React, {createContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {AuthContextType, Values} from '../types/LocalTypes';
import {UpdateUser, User} from '../types/DBTypes';
import {useAuth, useUser} from '../hooks/apiHooks';

const UserContext = createContext<AuthContextType | null>(null);

const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const {postLogin} = useAuth();
  const {getUserByToken, putUser} = useUser();

  const handleLogin = async (values: Values) => {
    try {
      console.log('trying to log in');
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

  const handleEdit = async (values: UpdateUser) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await putUser(token, values);
        console.log(values, 'values');
        const result = await getUserByToken(token);
        console.log(result, 'result');
        if (result) {
          setUser(result.user);
        }
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        handleLogin,
        handleLogout,
        handleAutoLogin,
        handleEdit,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export {UserProvider, UserContext};
