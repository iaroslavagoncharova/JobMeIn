import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {fetchData} from '../lib/functions';
import {
  Education,
  EducationInfo,
  Experience,
  JobWithSkillsAndKeywords,
  Skill,
  Test,
  UpdateUser,
  User,
} from '../types/DBTypes';
import {Values} from '../types/LocalTypes';
import {LoginResponse, UserResponse} from '../types/MessageTypes';
import useUpdateContext from './updateHooks';

const useUser = () => {
  const getUserById = async (id: number) => {
    return await fetchData<User>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/' + id,
    );
  };

  const getUserByToken = async (token: string) => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    console.log(options);
    const result = await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/token',
      options,
    );
    return result;
  };

  const postUser = async (user: Record<string, string>) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };
    return await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users',
      options,
    );
  };
  const getUsernameAvailability = async (username: string) => {
    return await fetchData<{available: boolean}>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/username/' + username,
    );
  };

  const getEmailAvailability = async (email: string) => {
    return await fetchData<{available: boolean}>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/email/' + email,
    );
  };

  const putUser = async (
    token: string,
    user: UpdateUser,
  ): Promise<UserResponse> => {
    const userUpdate: Partial<UpdateUser> = {};
    for (const key in user) {
      if (user[key]) {
        userUpdate[key] = user[key];
      }
    }
    return await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(userUpdate),
      },
    );
  };
  return {
    getUserById,
    getUserByToken,
    postUser,
    getUsernameAvailability,
    getEmailAvailability,
    putUser,
  };
};

const useAuth = () => {
  const postLogin = async (values: Values) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    };
    console.log(options);
    const result = await fetchData<LoginResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/auth/login',
      options,
    );
    console.log(result);
    return result;
  };
  return {postLogin};
};

const useEducation = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const {update} = useUpdateContext();
  const getEducation = async () => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await fetchData<Education[]>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/education',
      options,
    );
    setEducation(result);
  };

  useEffect(() => {
    getEducation();
  }, [update]);

  const postEducation = async (education: EducationInfo) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(education),
    };
    return await fetchData<Education>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/education',
      options,
    );
  };
  const getEducationById = async (id: number) => {
    return await fetchData<Education>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/education/' + id,
    );
  };

  const putEducation = async (id: number, education: EducationInfo) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(education),
    };
    return await fetchData<Education>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/education/' + id,
      options,
    );
  };
  return {
    getEducation,
    postEducation,
    getEducationById,
    putEducation,
    education,
  };
};

const useExperience = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const getExperience = async () => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await fetchData<Experience[]>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/experience',
      options,
    );
    setExperience(result);
  };
  return {getExperience, experience};
};

const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const {update} = useUpdateContext();
  const getSkills = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<Skill[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/profile/skills',
        options,
      );
      if (result) {
        setSkills(result);
      }
    } catch (e) {
      console.error('Error fetching skills', e);
    }
  };

  useEffect(() => {
    getSkills();
  }, [update]);

  return {getSkills, skills};
};

const useJobs = () => {
  const [jobs, setJobs] = useState<JobWithSkillsAndKeywords[]>([]);
  const getAllJobs = async () => {
    const result = await fetchData<JobWithSkillsAndKeywords[]>(
      process.env.EXPO_PUBLIC_AUTH_API + '/jobs',
    );
    if (result) {
      setJobs(result);
    }
  };
  useEffect(() => {
    getAllJobs();
  }, []);
  return {getAllJobs, jobs};
};

export {useUser, useAuth, useEducation, useExperience, useSkills, useJobs};
