import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import * as FileSystem from 'expo-file-system';
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
  UnauthorizedUser,
  Test,
  AttachmentInfo,
  UpdateAttachment,
  Report,
  ReportedUser,
  ReportedJob,
  Field,
} from '../types/DBTypes';
import {Values} from '../types/LocalTypes';
import {
  LoginResponse,
  MediaResponse,
  MessageResponse,
  TestResponse,
  UploadResponse,
  UserResponse,
} from '../types/MessageTypes';
import useUpdateContext from './updateHooks';

const useUser = () => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>();
  const getUserById = async (id: number) => {
    return await fetchData<UnauthorizedUser>(
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

  const deleteUserAsAdmin = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/users/admin/' + id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.error('Error deleting user', e);
    }
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
    deleteUserAsAdmin,
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
    try {
      const token = await AsyncStorage.getItem('token');
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(experience),
      };
      const result = await fetchData<Experience>(
        process.env.EXPO_PUBLIC_AUTH_API + '/profile/experience/' + id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'No fields to update') {
        Alert.alert('Et ole tehnyt muutoksia');
      } else {
        console.error('Error updating experience', e);
        Alert.alert('Error updating experience');
      }
    }
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
  const [fields, setFields] = useState<Field[]>([]);
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
        return result;
      } else {
        setCompanyJobs([]);
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
    try {
      const result = await fetchData<Field[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/jobs/fields',
      );
      if (result) {
        setFields(result);
      }
    } catch (e) {
      if ((e as Error).message === 'No fields found') {
        setFields([]);
      } else {
        console.error('Error fetching fields', e);
      }
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

  const deleteJobAsAdmin = async (job_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/jobs/admin/' + job_id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.error('Error deleting job', e);
    }
  };

  const calculatePercentage = async (job_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = fetchData<number>(
        process.env.EXPO_PUBLIC_AUTH_API + '/jobs/calculate/' + job_id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.error('Error calculating percentage', e);
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
    deleteJobAsAdmin,
    calculatePercentage,
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
    try {
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
            interview_status: chat.interview_status,
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
    } catch (e) {
      if ((e as Error).message === 'Chats not found') {
        setChats(null);
      } else {
        console.error('Error fetching chats', e);
      }
    }
  };

  const getChatById = async (chatId: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    console.log(chatId, 'chatId');
    const result = await fetchData<Chat>(
      process.env.EXPO_PUBLIC_AUTH_API + '/chats/' + chatId,
      options,
    );

    const interview = result.interview_status;

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
        interview_status: interview,
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

  const postAdminChat = async () => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await fetchData<Chat>(
      process.env.EXPO_PUBLIC_AUTH_API + '/chats/admin/',
      options,
    );
    if (result) {
      getUserChats();
      return result;
    }
  };

  const sendInterviewInvitation = async (chat_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/chats/interview/' + chat_id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.error('Error sending interview invitation', e);
    }
  };

  const acceptInterviewInvitation = async (chat_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/chats/interview_accept/' + chat_id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.error('Error accepting interview invitation', e);
    }
  };

  const declineInterviewInvitation = async (chat_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API +
          '/chats/interview_decline/' +
          chat_id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.error('Error declining interview invitation', e);
    }
  };

  const deleteChat = async (chat_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/chats/' + chat_id,
        options,
      );
      console.log(result, 'result');
      if (result.message === 'Chat deleted') {
        getUserChats();
        return result;
      }
    } catch (e) {
      console.error('Error deleting chat', e);
    }
  };

  return {
    getUserChats,
    getChatById,
    getOtherUserFromChat,
    getMessagesFromChat,
    chats,
    thisChat,
    chatMessages,
    postAdminChat,
    postMessageToChat,
    sendInterviewInvitation,
    acceptInterviewInvitation,
    declineInterviewInvitation,
    deleteChat,
  };
};

const useAttachments = () => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [thisAttachment, setThisAttachment] = useState<Attachment>();
  const {update} = useUpdateContext();
  const getUserAttachments = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
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
    } catch (e) {
      if ((e as Error).message === 'No attachments found') {
        setAttachments([]);
      } else {
        console.error('Error fetching attachments', e);
      }
    }
  };
  useEffect(() => {
    getUserAttachments();
  }, [update]);

  const getAttachmentById = async (attachmentId: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<Attachment>(
        process.env.EXPO_PUBLIC_AUTH_API +
          '/profile/attachments/' +
          attachmentId,
        options,
      );
      if (result) {
        setThisAttachment(result);
        return result;
      }
    } catch (e) {
      console.error('Error fetching attachment', e);
    }
  };

  const postAttachment = async (
    file: UploadResponse,
    attachmentName: string,
  ) => {
    const token = await AsyncStorage.getItem('token');

    const attachment: AttachmentInfo = {
      attachment_name: attachmentName,
      filename: file.data.filename,
      filesize: file.data.filesize,
      media_type: file.data.media_type,
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attachment),
    };

    console.log('starting fetch');
    return await fetchData<MediaResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/attachments',
      options,
    );
  };

  const putAttachment = async (attId: number, attachment: UpdateAttachment) => {
    console.log('putting attachment');
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(attachment),
    };
    console.log(JSON.stringify(attachment));
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/profile/attachments/' + attId,
      options,
    );
  };

  const deleteAttachment = async (attId: number, token: string) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      };
      console.log(token, 'token');
      const result = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/profile/attachments/' + attId,
        options,
      );
      if (result) {
        getUserAttachments();
        return result;
      }
    } catch (e) {
      console.error('Error deleting attachment', e);
    }
  };
  return {
    getUserAttachments,
    attachments,
    getAttachmentById,
    thisAttachment,
    postAttachment,
    putAttachment,
    deleteAttachment,
  };
};

const useApplications = () => {
  const [savedApplications, setSavedApplications] = useState<Application[]>();
  const [sentApplications, setSentApplications] = useState<Application[]>();
  const [jobApplications, setJobApplications] = useState<Application[]>();
  const {update} = useUpdateContext();
  const getApplicationById = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<Application>(
        process.env.EXPO_PUBLIC_AUTH_API + '/applications/' + id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'No application found') {
        return null;
      } else {
        console.error('Error fetching application', e);
      }
    }
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

  const getUserApplications = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      const result = await fetchData<Application[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/applications/user/' + id,
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
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'No applications found') {
        return [];
      } else {
        console.error('Error fetching applications', e);
      }
    }
  };

  return {
    getSavedApplications,
    getApplicationByJobId,
    getUserApplications,
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

const useTests = () => {
  const [tests, setTests] = useState<Test[]>();
  const {update} = useUpdateContext();
  const getAllTests = async () => {
    try {
      const result = await fetchData<Test[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/tests/all',
      );
      if (result) {
        return result;
      } else {
        return [];
      }
    } catch (e) {
      console.error('Error fetching tests', e);
    }
  };
  const getTests = async () => {
    try {
      const result = await fetchData<Test[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/tests',
      );
      if (result) {
        setTests(result);
      }
    } catch (e) {
      if ((e as Error).message === 'No tests found') {
        setTests([]);
      } else {
        console.error('Error fetching tests', e);
      }
    }
  };
  useEffect(() => {
    getTests();
  }, [update]);

  const getTestsByUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<Test[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/tests/byuser',
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'No tests found') {
        return [];
      } else {
        console.error('Error fetching tests', e);
      }
    }
  };

  const deleteTest = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/tests/' + id,
        options,
      );
      if (result.message === 'Test deleted') {
        getTests();
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'No tests found') {
        return [];
      }
    }
  };

  const getJobsByTest = async (test_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<JobWithSkillsAndKeywords[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/tests/test/' + test_id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'Jobs not found') {
        return [];
      } else {
        console.error('Error fetching jobs', e);
      }
    }
  };

  const addJobToTest = async (test_id: number, job_id: number) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({test_id}),
    };
    console.log(options, 'options');
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/tests/job/' + job_id,
      options,
    );
  };

  const postTest = async (test: Test) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(test),
      };
      const result = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/tests',
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      console.error('Error posting test', e);
    }
  };

  const putTest = async (test_id: number, test: Test) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(test),
      };
      const result = await fetchData<TestResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/tests/' + test_id,
        options,
      );
      if (result) {
        getTests();
        return result;
      }
    } catch (e) {
      console.error('Error updating test', e);
    }
  };

  const deleteJobFromTest = async (test_id: number, job_id: number) => {
    const token = await AsyncStorage.getItem('token');
    // job_id goes to body
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({job_id}),
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/tests/test/' + test_id,
      options,
    );
  };

  const getCandidateTests = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      return await fetchData<Test[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/tests/candidate',
        options,
      );
    } catch (e) {
      if ((e as Error).message === 'No tests found') {
        return [];
      } else {
        console.error('Error fetching tests', e);
      }
    }
  };

  const takeTest = async (test_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      return await fetchData<TestResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/tests/take/test/' + test_id,
        options,
      );
    } catch (e) {
      console.error('Error taking test', e);
    }
  };

  const getTestForJob = async (job_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      return await fetchData<Test[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/tests/job/' + job_id,
        options,
      );
    } catch (e) {
      console.error('Error fetching test', e);
    }
  };

  return {
    tests,
    getTests,
    getTestsByUser,
    postTest,
    putTest,
    deleteTest,
    getJobsByTest,
    addJobToTest,
    deleteJobFromTest,
    getAllTests,
    getCandidateTests,
    takeTest,
    getTestForJob,
  };
};

const useFile = () => {
  const postFile = async (
    uri: string,
    token: string,
  ): Promise<UploadResponse> => {
    console.log('loading....');
    const fileResult = await FileSystem.uploadAsync(
      process.env.EXPO_PUBLIC_UPLOAD_SERVER + '/upload',
      uri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );
    console.log('file posted');
    return fileResult.body ? JSON.parse(fileResult.body) : null;
  };

  return {postFile};
};

const useReports = () => {
  const getReportsByUser = async (user_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<Report[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/reports/user/' + user_id,
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'Reports not found') {
        return [];
      } else {
        console.error('Error fetching reports', e);
      }
    }
  };
  const getReportedUsers = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<ReportedUser[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/reports/reported/users',
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'Reports not found') {
        return [];
      } else {
        console.error('Error fetching reported users', e);
      }
    }
  };

  const getReportedJobs = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<ReportedJob[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/reports/reported/jobs',
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'Reports not found') {
        return [];
      } else {
        console.error('Error fetching reported jobs', e);
      }
    }
  };
  const getUnresolvedReports = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<Report[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/reports/unresolved',
        options,
      );
      if (result) {
        return result;
      }
    } catch (e) {
      if ((e as Error).message === 'No reports found') {
        return [];
      } else {
        console.error('Error fetching reports', e);
      }
    }
  };
  const sendReport = async (report: {
    reported_item_type: string;
    reported_item_id: number;
    report_reason: string;
  }) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(report),
      };
      const result = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/reports',
        options,
      );
      if (result.message === 'Report sent') {
        return result;
      } else {
        return null;
      }
    } catch (e) {
      if ((e as Error).message === 'You have already reported this item') {
        Alert.alert('Reportti on jo tehty');
      } else {
        console.error('Error sending report', e);
        Alert.alert('Error sending report');
      }
    }
  };
  const resolveReport = async (report_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/reports/resolve/' + report_id,
        options,
      );
      if (result.message === 'Report resolved') {
        return result;
      } else {
        return null;
      }
    } catch (e) {
      console.error('Error resolving report', e);
    }
  };

  const deleteReport = async (report_id: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };
      const result = await fetchData<MessageResponse>(
        process.env.EXPO_PUBLIC_AUTH_API + '/reports/' + report_id,
        options,
      );
      if (result.message === 'Report deleted') {
        return result;
      } else {
        return null;
      }
    } catch (e) {
      console.error('Error deleting report', e);
    }
  };
  return {
    getReportsByUser,
    sendReport,
    getUnresolvedReports,
    getReportedJobs,
    getReportedUsers,
    resolveReport,
    deleteReport,
  };
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
  useTests,
  useFile,
  useReports,
};
