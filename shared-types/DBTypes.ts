type UserLevel = {
    level_id: number,
    level_name: 'Admin' | 'User';
};

type User = {
    user_id: number,
    username: string,
    password: string,
    email: string,
    user_level_id: number,
    fullname: string,
    phone: string,
    about_me: string,
    status: string,
    user_type: string,
    link: string,
    field: string
};

type JobExperience = {
    experience_id: number,
    user_id: number,
    job_title: string,
    job_place: string,
    job_city: string,
    description: string,
    start_date: Date | string,
    end_date: Date | string;
};

type Education = {
    education_id: number,
    user_id: number,
    school: string,
    degree: string,
    field: string,
    graduation: Date | string;
};

type Attachment = {
    attachment_id: number,
    user_id: number,
    link: string;
};

type JobAd = {
    ad_id: number,
    user_id: number,
    title: string,
    salary: number,
    description: string,
    category: string,
    created_at: Date | string,
    edited_at: Date | string | null;
};

type Application = {
    application_id: number,
    ad_id: number,
    user_id: number,
    match_percentage: number,
    created_at: Date | string;
};

type Test = {
    test_id: number,
    title: string,
    description: string,
    is_default: number,
    link: string,
    created_at: Date | string;
};

type JobTest = {
    ad_id: number,
    test_id: number;
};

type UserTest = {
    user_test_id: number,
    test_id: number,
    user_id: number,
    score: number;
};

type Match = {
    match_id: number,
    job_seeker: number,
    employer: number,
    job_ad_id: number;
};

type Message = {
    message_id: number,
    user_id: number,
    sent: number,
    receiver: number,
    message: string,
    timestamp: Date | string;
};

type Report = {
    report_id: number,
    user_id: number,
    reason: string,
    timestamp: Date | string;
};

type UserWithLevel = Omit<User, 'user_level_id'> &
  Pick<UserLevel, 'level_name'>;

type UserWithNoPassword = Omit<UserWithLevel, 'password'>;

type TokenContent = Pick<User, 'user_id'> & Pick<UserLevel, 'level_name'>;

type FileInfo = {
    filename: string;
    user_id: number;
};

export type {
    UserLevel,
    User,
    JobExperience,
    Education,
    Attachment,
    JobAd,
    Application,
    Test,
    JobTest,
    UserTest,
    Match,
    Message,
    Report,
    UserWithLevel,
    UserWithNoPassword,
    TokenContent,
    FileInfo
};