import {Key} from 'react';

export type UserLevel = {
  level_id: number;
  level_name: 'User' | 'Admin';
};

export type User = {
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
  user_type: 'candidate' | 'employer' | 'admin';
  link: string;
  field: string;
};

export type ReportedUser = {
  user_id: number;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  about_me: string;
  status: string;
  link: string;
  field: string;
  address: string;
  user_type: string;
  report_reason: string;
};

export type UnauthorizedUser = Omit<User, 'password'>;

export type Experience = {
  experience_id: number;
  user_id: number;
  job_title: string;
  job_place: string;
  job_city: string;
  description: string;
  start_date: Date | string;
  end_date: Date | string;
};

export type SkillName = {
  [x: string]: Key | null | undefined;
  skill_name: string;
};

export type CandidateProfile = {
  user_id: number;
  username: string;
  about_me: string;
  link: string;
  field: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  attachments: Attachment[];
};

export type ExperienceInfo = {
  job_title?: string | null;
  job_place?: string | null;
  job_city?: string | null;
  description?: string | null;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
};

export type Education = {
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

export type Skill = {
  skill_id: number;
  skill_name: string;
  type: string;
};

export type JobSkill = {
  skill_id: number;
  job_id: number;
};

export type UserSkill = {
  userskill_id: number;
  user_id: number;
  skill_id: number;
};

export type KeyWord = {
  keyword_id: number;
  keyword_name: string;
};

export type KeywordsJob = {
  keyword_id: number;
  job_id: number;
};

export type Attachment = {
  attachment_id: number;
  attachment_name: string;
  filename: string;
  filesize: number;
  media_type: string;
  user_id: number;
};

export type Application = {
  application_id: number;
  user_id: number;
  job_id: number;
  status: string;
  application_text: string | null;
  created_at: Date | string;
  job: JobWithUser;
};

export type ApplicationLink = {
  link_id: number;
  application_id: number;
  link: string;
};

export type UploadAttachment = {
  attachment_name?: string;
  file?: File | null;
};

export type AttachmentInfo = {
  attachment_name: string;
  filename: string;
  filesize: number;
  media_type: string;
};

export type UpdateAttachment = {
  attachment_name?: string | undefined;
  preferred_filename?: string | undefined;
  filename?: string;
  filesize?: number;
  media_type?: string;
};

export type FileValues = {
  filename?: string | undefined;
  filesize?: number | undefined;
  media_type?: string | undefined;
  uri?: string | undefined;
};

export type Test = {
  test_id: number;
  test_type: string;
  user_id: number | null;
  test_link: string | null;
};

export type JobTest = {
  job_id: number;
  test_id: number;
};

export type UserTest = {
  test_id: number;
  user_id: number;
  percentage: number;
  completed_at: Date | string;
};

export type Chat = {
  chat_id: number;
  user1_id: number;
  user2_id: number;
  interview_status: string;
  created_at: Date | string;
};

export type ChatWithMessages = Pick<Chat, 'chat_id' | 'interview_status'> & {
  chatting_with: {
    username: string;
    user_id: number;
  };
  messages?: Omit<MessageWithUser, 'chat_id'>[];
};

export type Message = {
  message_id: number;
  user_id: number;
  chat_id: number;
  message_text: string;
  sent_at: Date | string;
};

export type PostMessage = {
  chat_id: number;
  message_text: string;
};

export type PostMessageText = {
  message_text: string;
};

export type MessageWithUser = Message & Pick<User, 'username'>;

export type Swipe = {
  swipe_id: number;
  swiper_id: number;
  swiped_id: number;
  swipe_type: string;
  swipe_direction: string;
  created_at: Date | string | null;
};

export type Match = {
  match_id: number;
  user1_id: number;
  user2_id: number;
  matched_at: Date | string | null;
};

export type MatchWithUser = Match & {
  user: UnauthorizedUser;
};

export type UpdateUser = {
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

export type ApplicationApplied = {
  application_id: string;
  companyName: string;
  position: string;
  dateApplied: string;
  matchPercentage: number;
  testsCompleted: number;
  totalTests: number;
};

export type ApplicationSaved = {
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

export type ReportedJob = {
  job_id: number;
  job_address: string;
  job_title: string;
  salary: string;
  user_id: number;
  job_description: string;
  deadline_date: Date | string;
  field: string;
  report_reason: string;
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
  userTestsCount: number;
  jobTestsCount: number;
  percentage: number;
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

export type JobWithSkillSKeywordsAndUser = JobWithSkillsAndKeywords & {
  userTestsCount: number;
  jobTestsCount: number;
  percentage: number;
};

export type Report = {
  report_id: number;
  user_id: number;
  reported_item_type: string;
  reported_item_id: number;
  report_reason: string;
  reported_at: Date | string;
  is_resolved: string;
};

export type Field = {
  field_id: number;
  field_name: string;
};
