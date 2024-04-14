import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {fetchData} from '../lib/functions';
import {
  Chat,
  ChatWithMessages,
  Education,
  EducationInfo,
  Experience,
  ExperienceInfo,
  JobWithSkillsAndKeywords,
  MatchWithUser,
  MessageWithUser,
  PostMessage,
  Skill,
  Swipe,
  UpdateUser,
  User,
  Attachment,
  ApplicationSaved,
  ApplicationApplied,
  Application,
  JobWithUser,
  CandidateProfile,
  Match,
  KeyWord,
  UpdateJob,
} from '../types/DBTypes';
import {Values} from '../types/LocalTypes';
import {
  LoginResponse,
  MessageResponse,
  UserResponse,
} from '../types/MessageTypes';
import useUpdateContext from './updateHooks';

const useUser = () => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>();
  const getUserById = async (id: number) => {
    return await fetchData<User>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/' + id,
    );
  };

  const getAllCandidates = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<CandidateProfile[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/users/candidates',
        options,
      );
      if (result) {
        setCandidates(result);
      }
      return result;
    } catch (e) {
      if ((e as Error).message === 'Users not found') {
        setCandidates([]);
      } else {
        console.error('Error fetching candidates', e);
      }
    }
  };

  const getUserByToken = async (token: string) => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/token',
      options,
    );
    return result;
  };

  const getCandidate = async (id: number) => {
    return await fetchData<CandidateProfile>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/candidate/' + id,
    );
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
    candidates,
    getAllCandidates,
    getCandidate,
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
    const result = await fetchData<LoginResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/auth/login',
      options,
    );
    if (result) {
      return result;
    } else {
      return null;
    }
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
    try {
      const token = await AsyncStorage.getItem('token');
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(education),
      };
      const result = await fetchData<Education>(
        process.env.EXPO_PUBLIC_AUTH_API + '/profile/education',
        options,
      );
      if (result) {
        Alert.alert('Koulutus lisätty');
      }
    } catch (e) {
      console.error('Error adding education', e);
      Alert.alert('Error adding education');
    }
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

  const getSkillsByUserId = async (id: number) => {
    console.log(id, 'id');
    return await fetchData<Skill[]>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/skills/user/' + id,
    );
  };

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
    getSkillsByUserId,
  };
};

const useJobs = () => {
  const [jobs, setJobs] = useState<JobWithSkillsAndKeywords[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [companyJobs, setCompanyJobs] = useState<JobWithSkillsAndKeywords[]>(
    [],
  );
  const {update} = useUpdateContext();
  const getAllJobs = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<JobWithSkillsAndKeywords[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/jobs',
        options,
      );
      if (result) {
        setJobs(result);
      }
    } catch (e) {
      if ((e as Error).message === 'No jobs found') {
        setJobs([]);
      } else {
        console.error('Error fetching jobs', e);
      }
    }
  };
  useEffect(() => {
    getAllJobs();
    getFields();
    getJobsByCompany();
  }, [update]);

  const getJobsByCompany = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<JobWithSkillsAndKeywords[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/jobs/company',
        options,
      );
      if (result) {
        setCompanyJobs(result);
      }
    } catch (e) {
      if ((e as Error).message === 'No jobs found') {
        setCompanyJobs([]);
      } else {
        console.error('Error fetching jobs', e);
      }
    }
  };

  const getFields = async () => {
    const result = await fetchData<string[]>(
      process.env.EXPO_PUBLIC_AUTH_API + '/jobs/fields',
    );
    if (result) {
      setFields(result);
    }
  };

  const getJobById = async (id: number) => {
    return await fetchData<JobWithSkillsAndKeywords>(
      process.env.EXPO_PUBLIC_AUTH_API + '/jobs/' + id,
    );
  };

  const getJobForApplication = async (job_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<JobWithUser>(
        process.env.EXPO_PUBLIC_AUTH_API + '/jobs/application/' + job_id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.error('Error fetching job for application', e);
    }
  };

  const postJob = async (
    job: Omit<JobWithSkillsAndKeywords, 'job_id' | 'user_id' | 'username'>,
  ) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(job),
      };
      const result = await fetchData<JobWithSkillsAndKeywords>(
        process.env.EXPO_PUBLIC_AUTH_API + '/jobs',
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.error((e as Error).message);
    }
  };

  const putJob = async (job_id: number, job: UpdateJob) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(job),
      };
      const result = await fetchData<JobWithSkillsAndKeywords>(
        process.env.EXPO_PUBLIC_AUTH_API + '/jobs/' + job_id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.error('Error updating job', e);
    }
  };

  const deleteJob = async (job_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/jobs/' + job_id,
        options,
      );
      if (!result) {
        console.error('Error deleting job');
      }
      return result;
    } catch (e) {
      console.error('Error deleting job', e);
    }
  };
  return {
    getAllJobs,
    jobs,
    getFields,
    fields,
    getJobById,
    getJobForApplication,
    getJobsByCompany,
    companyJobs,
    postJob,
    putJob,
    deleteJob,
  };
};

const useSwipe = () => {
  const {getUserMatches} = useMatch();
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
    const result = await fetchData<Swipe>(
      process.env.EXPO_PUBLIC_AUTH_API + '/swipes',
      options,
    );
    if (result) {
      getUserMatches();
      return result;
    }
  };
  return {postSwipe};
};

const useMatch = () => {
  const [matches, setMatches] = useState<MatchWithUser[]>();
  const {update} = useUpdateContext();
  const getUserMatches = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<MatchWithUser[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/matches/user',
        options,
      );
      if (result) {
        setMatches(result);
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'No matches found') {
        setMatches([]);
      } else {
        console.error('Error fetching matches', e);
      }
    }
  };
  useEffect(() => {
    getUserMatches();
  }, [update]);

  const postMatch = async (match: Match) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(match),
    };
    return await fetchData<MatchWithUser>(
      process.env.EXPO_PUBLIC_AUTH_API + '/matches',
      options,
    );
  };

  const deleteMatch = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/matches/' + id,
      options,
    );
  };
  return {getUserMatches, matches, deleteMatch, postMatch};
};

const useChats = () => {
  const [chats, setChats] = useState<ChatWithMessages[] | null>();
  const {update} = useUpdateContext();
  const [thisChat, setThisChat] = useState<ChatWithMessages>();
  const [chatMessages, setChatMessages] = useState<MessageWithUser[]>();

  const getUserChats = async () => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await fetchData<Chat[]>(
      process.env.EXPO_PUBLIC_AUTH_API + '/chats/user',
      options,
    );

    const chatsWithMessages: ChatWithMessages[] = [];

    if (result) {
      for (const chat of result) {
        const chattingWith = await getOtherUserFromChat(chat.chat_id);
        if (!chattingWith) {
          continue;
        }
        const thisChat = {
          chat_id: chat.chat_id,
          chatting_with: {
            username: chattingWith.username.toString(),
            user_id: chattingWith.user_id,
          },
        };

        const chatWithMessages: ChatWithMessages = {
          ...thisChat,
          messages: [],
        };
        const msgs = await getMessagesFromChat(chat.chat_id);
        if (msgs) {
          const messages: Omit<MessageWithUser, 'chat_id'>[] = [];
          for (const msg of msgs) {
            const {chat_id, ...msgNoChatId} = msg;
            messages.push(msgNoChatId);
          }
          chatWithMessages.messages = messages;
        }
        chatsWithMessages.push(chatWithMessages);
      }
      setChats(chatsWithMessages);
      return result;
    } else {
      setChats(null);
      return 'No chats found';
    }
  };

  const getChatById = async (chatId: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await fetchData<Chat>(
      process.env.EXPO_PUBLIC_AUTH_API + '/chats/' + chatId,
      options,
    );

    if (result) {
      const chattingWith = await getOtherUserFromChat(chatId);
      if (!chattingWith) {
        return null;
      }
      const thisChat = {
        chat_id: chatId,
        chatting_with: {
          username: chattingWith.username.toString(),
          user_id: chattingWith.user_id,
        },
      };

      const chatWithMessages: ChatWithMessages = {
        ...thisChat,
        messages: [],
      };
      const msgs = await getMessagesFromChat(chatId);
      if (msgs) {
        const messages: Omit<MessageWithUser, 'chat_id'>[] = [];
        for (const msg of msgs) {
          const {chat_id, ...msgNoChatId} = msg;
          messages.push(msgNoChatId);
        }
        chatWithMessages.messages = messages;
      }
      setThisChat(chatWithMessages);
      return result;
    }
  };

  const getMessagesFromChat = async (chatId: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      const result = await fetchData<MessageWithUser[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/chats/' + chatId + '/messages',
        options,
      );
      if (result) {
        setChatMessages(result);
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'Messages not found') {
        return [];
      } else {
        console.error('Error fetching messages', e);
      }
    }
  };

  const getOtherUserFromChat = async (chatId: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await fetchData<Pick<User, 'username' | 'user_id'>>(
      process.env.EXPO_PUBLIC_AUTH_API + '/chats/' + chatId + '/otherUser',
      options,
    );
    if (result) {
      return result;
    }
  };

  const postMessageToChat = async (message: PostMessage) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(message),
    };
    const result = await fetchData<MessageWithUser>(
      process.env.EXPO_PUBLIC_AUTH_API +
        '/chats/' +
        message.chat_id +
        '/messages',
      options,
    );
    if (result) {
      getUserChats();
      return result;
    }
  };

  useEffect(() => {
    getUserChats();
  }, [update]);

  return {
    getUserChats,
    getChatById,
    getOtherUserFromChat,
    getMessagesFromChat,
    chats,
    thisChat,
    postMessageToChat,
  };
};

const useAttachments = () => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const {update} = useUpdateContext();
  const getUserAttachments = async () => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await fetchData<Attachment[]>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/attachments',
      options,
    );
    if (result) {
      setAttachments(result);
      return result;
    }
  };
  useEffect(() => {
    getUserAttachments();
  }, [update]);
  return {getUserAttachments, attachments};
};

const useApplications = () => {
  const [savedApplications, setSavedApplications] = useState<Application[]>();
  const [sentApplications, setSentApplications] = useState<Application[]>();
  const [jobApplications, setJobApplications] = useState<Application[]>();
  const {update} = useUpdateContext();
  const getApplicationById = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<Application>(
      process.env.EXPO_PUBLIC_AUTH_API + '/applications/' + id,
      options,
    );
  };
  const getApplicationByJobId = async (job_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<Application[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/applications/job/' + job_id,
        options,
      );
      if (result) {
        setJobApplications(result);
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'No applications found') {
        setJobApplications([]);
      } else {
        console.error('Error fetching applications', e);
      }
    }
  };
  const putApplication = async (application: Application) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(application),
    };
    return await fetchData<Application>(
      process.env.EXPO_PUBLIC_AUTH_API +
        '/applications/' +
        application.application_id,
      options,
    );
  };
  const getSavedApplications = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<Application[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/applications/user/saved',
        options,
      );
      if (result) {
        for (const app of result) {
          const job = await fetchData<JobWithUser>(
            process.env.EXPO_PUBLIC_AUTH_API +
              '/jobs/application/' +
              app.job_id,
            options,
          );
          app.job = job;
        }
        setSavedApplications(result);
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'No saved applications found') {
        setSavedApplications([]);
      } else {
        console.error('Error fetching saved applications', e);
      }
    }
  };

  const sendApplication = async (application: Application) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(application),
      };
      const result = await fetchData<Application>(
        process.env.EXPO_PUBLIC_AUTH_API +
          '/applications/' +
          application.application_id +
          '/send',
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.error('Error posting application', e);
    }
  };

  const getSentApplications = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<Application[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/applications/user/sent',
        options,
      );
      if (result) {
        for (const app of result) {
          const job = await fetchData<JobWithUser>(
            process.env.EXPO_PUBLIC_AUTH_API +
              '/jobs/application/' +
              app.job_id,
            options,
          );
          app.job = job;
        }
        setSentApplications(result);
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'No sent applications found') {
        setSentApplications([]);
      } else {
        console.error('Error fetching sent applications', e);
      }
    }
  };

  useEffect(() => {
    getSavedApplications();
    getSentApplications();
  }, [update]);

  const deleteApplication = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/applications/' + id,
      options,
    );
  };

  const dismissApplication = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/applications/dismiss/' + id,
      options,
    );
  };

  const acceptApplication = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/applications/accept/' + id,
      options,
    );
  };

  return {
    getSavedApplications,
    getApplicationByJobId,
    savedApplications,
    jobApplications,
    putApplication,
    getApplicationById,
    dismissApplication,
    sendApplication,
    getSentApplications,
    sentApplications,
    deleteApplication,
    acceptApplication,
  };
};

const useKeywords = () => {
  const [keywords, setKeywords] = useState<KeyWord[]>();
  const {update} = useUpdateContext();
  const getKeywords = async () => {
    try {
      const result = await fetchData<KeyWord[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/jobs/keywords',
      );
      if (result) {
        setKeywords(result);
      } else {
        setKeywords([]);
      }
    } catch (e) {
      console.error('Error fetching keywords', e);
    }
  };
  useEffect(() => {
    getKeywords();
  }, [update]);
  return {keywords, getKeywords};
};

export {
  useUser,
  useAuth,
  useEducation,
  useExperience,
  useSkills,
  useJobs,
  useSwipe,
  useMatch,
  useChats,
  useApplications,
  useAttachments,
  useKeywords,
};
