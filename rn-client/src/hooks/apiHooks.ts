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
  Match,
  MessageWithUser,
  Notification,
  PostMessage,
  Skill,
  Swipe,
  UpdateUser,
  User,
  Attachment,
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
      console.log(options);
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
  const [fields, setFields] = useState<string[]>([]);
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
  };
  useEffect(() => {
    getAllJobs();
    getFields();
  }, [update]);

  const getFields = async () => {
    const result = await fetchData<string[]>(
      process.env.EXPO_PUBLIC_AUTH_API + '/jobs/fields',
    );
    if (result) {
      setFields(result);
    }
  };
  return {getAllJobs, jobs, getFields, fields};
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

const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const {update} = useUpdateContext();
  const getUserNotifications = async () => {
    const token = await AsyncStorage.getItem('token');
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const result = await fetchData<Notification[]>(
      process.env.EXPO_PUBLIC_AUTH_API + '/notifications',
      options,
    );
    if (result) {
      // for each notification create an alert
      console.log(result);
      setNotifications(result);
      return result;
    }
  };
  useEffect(() => {
    getUserNotifications();
  }, [update]);
  return {getUserNotifications, notifications};
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
      console.log(result);
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
  return {getUserMatches, matches, deleteMatch};
};

const useChats = () => {
  const [chats, setChats] = useState<ChatWithMessages[]>();
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
    console.log('result', result);

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
          for (const msg of msgs) {
            const {chat_id, ...msgNoChatId} = msg;
            chatWithMessages.messages.push(msgNoChatId);
          }
        }
        chatsWithMessages.push(chatWithMessages);
      }
      setChats(chatsWithMessages);
      return result;
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
        for (const msg of msgs) {
          const {chat_id, ...msgNoChatId} = msg;
          chatWithMessages.messages.push(msgNoChatId);
        }
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
      console.log('result', result);
      if (result) {
        setChatMessages(result);
        return result;
      }
    } catch (e) {
      console.error('Error fetching messages', e);
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
      console.log('other user from caht', result);
      return result;
    }
  };

  const postMessageToChat = async (message: PostMessage) => {
    const token = await AsyncStorage.getItem('token');
    console.log('postMessageToChat', message);
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
  }, []);

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

export {
  useUser,
  useAuth,
  useEducation,
  useExperience,
  useSkills,
  useJobs,
  useSwipe,
  useNotification,
  useMatch,
  useChats,
  useAttachments,
};
