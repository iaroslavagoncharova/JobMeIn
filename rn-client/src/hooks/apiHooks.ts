import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {fetchData} from '../lib/functions';
import {
  Education,
  EducationInfo,
  Experience,
  ExperienceInfo,
  JobWithSkillsAndKeywords,
  Skill,
  Swipe,
  Test,
  UpdateUser,
  User,
} from '../types/DBTypes';
import {Values} from '../types/LocalTypes';
import {
  LoginResponse,
  MessageResponse,
  UserResponse,
} from '../types/MessageTypes';
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

  const deleteUser = async () => {
    const token = await AsyncStorage.getItem('token');
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users',
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
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
    deleteUser,
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
    try {
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
    } catch (error) {
      if ((error as Error).message === 'No education found') {
        setEducation([]);
      } else {
        console.error('Error fetching education', error);
      }
    }
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
    try {
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
    } catch (e) {
      console.error('Error updating education', e);
      Alert.alert('Error updating education');
    }
  };

  const deleteEducation = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
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
    deleteEducation,
  };
};

const useExperience = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const {update} = useUpdateContext();
  const getExperience = async () => {
    try {
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
      console.log(result);
      setExperience(result);
    } catch (e) {
      if ((e as Error).message === 'No experience found') {
        setExperience([]);
      } else {
        console.error('Error fetching experience', e);
      }
    }
  };

  useEffect(() => {
    getExperience();
  }, [update]);

  const postExperience = async (experience: ExperienceInfo) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(experience),
    };
    return await fetchData<Experience>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/experience',
      options,
    );
  };

  const getExperienceById = async (id: number) => {
    return await fetchData<Experience>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/experience/' + id,
    );
  };

  const putExperience = async (id: number, experience: ExperienceInfo) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(experience),
    };
    return await fetchData<Experience>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/experience/' + id,
      options,
    );
  };

  const deleteExperience = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/experience/' + id,
      options,
    );
  };
  return {
    getExperience,
    experience,
    postExperience,
    getExperienceById,
    putExperience,
    deleteExperience,
  };
};

const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const {update} = useUpdateContext();
  const getAllSkills = async () => {
    const result = await fetchData<Skill[]>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/skills',
    );
    if (result) {
      setAllSkills(result);
    }
  };

  useEffect(() => {
    getAllSkills();
  }, []);

  const getSkills = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<Skill[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/profile/skills/user',
        options,
      );
      if (result) {
        setSkills(result);
      }
    } catch (e) {
      if ((e as Error).message === 'No skills found') {
        setSkills([]);
      } else {
        console.error('Error fetching skills', e);
      }
    }
  };

  useEffect(() => {
    getSkills();
  }, [update]);

  const putSkill = async (id: number, skill: Skill) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(skill),
      };
      return await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/profile/skills/' + id,
        options,
      );
    } catch (e) {
      console.error('Error updating skill', e);
      Alert.alert('Error updating skill');
    }
  };

  const postSkill = async (skill: Skill) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(skill),
      };
      const result = await fetchData<Skill>(
        process.env.EXPO_PUBLIC_AUTH_API + '/profile/skills/' + skill.skill_id,
        options,
      );
      if (result) {
        Alert.alert('Taito lisätty');
      }
    } catch (e) {
      if ((e as Error).message === 'Skill not added or already exists') {
        Alert.alert('Taito on jo lisätty');
      } else {
        console.error('Error adding skill', e);
        Alert.alert('Error adding skill');
      }
    }
  };

  const deleteSkill = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/skills/' + id,
      options,
    );
  };

  return {
    getSkills,
    skills,
    putSkill,
    deleteSkill,
    allSkills,
    getAllSkills,
    postSkill,
  };
};

const useJobs = () => {
  const [jobs, setJobs] = useState<JobWithSkillsAndKeywords[]>([]);
  const {update} = useUpdateContext();
  const getAllJobs = async () => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await fetchData<JobWithSkillsAndKeywords[]>(
      process.env.EXPO_PUBLIC_AUTH_API + '/jobs',
      options,
    );
    if (!result) {
      setJobs([]);
      console.error('Error fetching jobs');
      return;
    }
    setJobs(result);
    console.log(result);
  };
  useEffect(() => {
    getAllJobs();
  }, [update]);
  return {getAllJobs, jobs};
};

const useSwipe = () => {
  const postSwipe = async (
    swipe: Omit<Swipe, 'swipe_id' | 'swiper_id' | 'created_at'>,
  ) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(swipe),
    };
    console.log(options);
    return await fetchData<Swipe>(
      process.env.EXPO_PUBLIC_AUTH_API + '/swipes',
      options,
    );
  };
  return {postSwipe};
};

export {
  useUser,
  useAuth,
  useEducation,
  useExperience,
  useSkills,
  useJobs,
  useSwipe,
};
