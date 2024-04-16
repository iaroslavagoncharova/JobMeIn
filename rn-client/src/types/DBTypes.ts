import {Key} from 'react';

type UserLevel = {
  level_id: number;
  level_name: 'User' | 'Admin';
};

type User = {
  user_id: number;
  username: string;
  password: string;
  email: string;
  user_level_id: number;
  fullname: string;
  address: string;
  phone: string;
  about_me: string;
  status: string;
  user_type: 'candidate' | 'employer';
  link: string;
  field: string;
};

type UnauthorizedUser = Omit<User, 'password'>;

type Experience = {
  experience_id: number;
  user_id: number;
  job_title: string;
  job_place: string;
  job_city: string;
  description: string;
  start_date: Date | string;
  end_date: Date | string;
};

type SkillName = {
  [x: string]: Key | null | undefined;
  skill_name: string;
};

type CandidateProfile = {
  user_id: number;
  username: string;
  about_me: string;
  link: string;
  field: string;
  skills: SkillName[];
  experience: Experience[];
  education: Education[];
  attachments: Attachment[];
};

type ExperienceInfo = {
  job_title?: string | null;
  job_place?: string | null;
  job_city?: string | null;
  description?: string | null;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
};

type Education = {
  education_id: number;
  user_id: number;
  school: string;
  degree: string;
  field: string | null | undefined;
  graduation: string;
};

export type EducationInfo = {
  school?: string | null;
  degree?: string | null;
  field?: string | null;
  graduation?: Date | null | string;
};

type Skill = {
  skill_id: number;
  skill_name: string;
  type: string;
};

type JobSkill = {
  skill_id: number;
  job_id: number;
};

type UserSkill = {
  userskill_id: number;
  user_id: number;
  skill_id: number;
};

type KeyWord = {
  keyword_id: number;
  keyword_name: string;
};

type KeywordsJob = {
  keyword_id: number;
  job_id: number;
};

type Attachment = {
  attachment_id: number;
  attachment_name: string;
  user_id: number;
  link: string;
};

type Application = {
  application_id: number;
  user_id: number;
  job_id: number;
  status: string;
  application_text: string | null;
  created_at: Date | string;
  job: JobWithUser;
};

type ApplicationLink = {
  link_id: number;
  application_id: number;
  link: string;
};

type Test = {
  test_id: number;
  test_type: string;
  user_id: number | null;
  test_link: string | null;
};

type JobTest = {
  job_id: number;
  test_id: number;
};

type UserTest = {
  test_id: number;
  user_id: number;
  percentage: number;
  completed_at: Date | string;
};

type Chat = {
  chat_id: number;
  user1_id: number;
  user2_id: number;
  interview_status: string;
  created_at: Date | string;
};

type ChatWithMessages = Pick<Chat, 'chat_id' | 'interview_status'> & {
  chatting_with: {
    username: string;
    user_id: number;
  };
  messages?: Omit<MessageWithUser, 'chat_id'>[];
};

type Message = {
  message_id: number;
  user_id: number;
  chat_id: number;
  message_text: string;
  sent_at: Date | string;
};

type PostMessage = {
  chat_id: number;
  message_text: string;
};

type PostMessageText = {
  message_text: string;
};

type MessageWithUser = Message & Pick<User, 'username'>;

type Swipe = {
  swipe_id: number;
  swiper_id: number;
  swiped_id: number;
  swipe_type: string;
  swipe_direction: string;
  created_at: Date | string | null;
};

type Match = {
  match_id: number;
  user1_id: number;
  user2_id: number;
  matched_at: Date | string | null;
};

type MatchWithUser = Match & {
  user: UnauthorizedUser;
};

type UpdateUser = {
  email: string;
  fullname: string;
  phone: string;
  address: string;
  about_me: string;
  field: string;
  link: string;
  status: string;
  username: string;
  [key: string]: string | undefined;
};

type ApplicationApplied = {
  application_id: string;
  companyName: string;
  position: string;
  dateApplied: string;
  matchPercentage: number;
  testsCompleted: number;
  totalTests: number;
};

type ApplicationSaved = {
  id: string;
  companyName: string;
  position: string;
  dateSaved: string;
  matchPercentage: number;
};

export type Job = {
  job_id: number;
  job_address: string;
  job_title: string;
  salary: string;
  user_id: number;
  job_description: string;
  deadline_date: Date | string | null | undefined;
  field: string;
};

export type UpdateJob = {
  job_address: string;
  job_title: string;
  salary: string;
  job_description: string;
  deadline_date: Date | string;
  field: string;
  skills: string;
  keywords: string;
};

export type JobWithUser = Job & {
  username: string;
};

export type Notification = {
  notification_id: number;
  match_id: number;
  created_at: Date | string;
};

export type JobWithSkillsAndKeywords = Job & {
  skills: string;
  keywords: string;
  username: string;
};

export type {
  UserLevel,
  User,
  UnauthorizedUser,
  CandidateProfile,
  SkillName,
  Experience,
  ExperienceInfo,
  Education,
  Attachment,
  Skill,
  JobSkill,
  UserSkill,
  KeyWord,
  KeywordsJob,
  Application,
  ApplicationLink,
  Test,
  JobTest,
  UserTest,
  Chat,
  ChatWithMessages,
  MessageWithUser,
  Message,
  PostMessage,
  PostMessageText,
  Swipe,
  Match,
  UpdateUser,
  ApplicationApplied,
  ApplicationSaved,
  MatchWithUser,
};
