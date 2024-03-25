DROP DATABASE IF EXISTS JobMeIn;
CREATE DATABASE JobMeIn;
USE JobMeIn;

CREATE TABLE UserLevels (
  level_id int(11) AUTO_INCREMENT PRIMARY KEY,
  level_name varchar(255) NOT NULL
);

CREATE TABLE Users (
  user_id int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  user_level_id int NOT NULL,
  fullname varchar(255) NOT NULL,
  phone varchar(255) NOT NULL,
  about_me text,
  address varchar(255),
  status varchar(255),
  user_type varchar(255) NOT NULL,
  link varchar(255),
  field varchar(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE JobExperience (
  experience_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  job_title varchar(255) NOT NULL,
  job_place varchar(255) NOT NULL,
  job_city varchar(255),
  description varchar(255),
  start_date date NOT NULL,
  end_date date NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Education (
  education_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  school varchar(255) NOT NULL,
  degree varchar(255) NOT NULL,
  field varchar(255),
  graduation date,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Attachments (
  attachment_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  atachment_name int(11) NOT NULL,
  user_id int(11) NOT NULL,
  link varchar(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE JobAds (
  job_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  job_address varchar(255) NOT NULL,
  job_title varchar(255) NOT NULL,
  salary varchar(255) NOT NULL,
  user_id int(11) NOT NULL,
  job_description varchar(255) NOT NULL,
  deadline_date date NOT NULL,
  field varchar(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE Skills (
  skill_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  skill_name varchar(255) NOT NULL,
  type varchar(255) NOT NULL
);

CREATE TABLE JobSkills (
  skill_id int(11) NOT NULL,
  job_id int(11) NOT NULL,
  FOREIGN KEY (skill_id) REFERENCES Skills(skill_id),
  FOREIGN KEY (job_id) REFERENCES JobAds(job_id)
);

CREATE TABLE UserSkills (
  userskill_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  skill_id int(11) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
);

CREATE TABLE KeyWords (
    keyword_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    keyword_name VARCHAR(255) NOT NULL
);

CREATE TABLE KeywordsJobs (
  keyword_id int(11) NOT NULL,
  job_id int(11) NOT NULL,
  FOREIGN KEY (keyword_id) REFERENCES KeyWords(keyword_id),
  FOREIGN KEY (job_id) REFERENCES JobAds(job_id)
);

CREATE TABLE Applications (
  application_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  job_id int(11) NOT NULL,
  status varchar(255) NOT NULL,
  application_text text,
  created_at date NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users (user_id),
  FOREIGN KEY (job_id) REFERENCES JobAds (job_id)
);

CREATE TABLE ApplicationLinks (
  link_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  application_id int(11) NOT NULL,
  link varchar(255) NOT NULL,
  FOREIGN KEY (application_id) REFERENCES Applications (application_id)
);

CREATE TABLE Tests (
  test_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  test_type varchar(255) NOT NULL,
  user_id int(11),
  test_link varchar(255),
  FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE JobTests (
  job_id int(11) NOT NULL,
  test_id int(11) NOT NULL,
  FOREIGN KEY (job_id) REFERENCES JobAds (job_id),
  FOREIGN KEY (test_id) REFERENCES Tests(test_id)
);

CREATE TABLE UserTests (
  test_id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  percentage int(11) NOT NULL,
  completed_at date NOT NULL,
  FOREIGN KEY (test_id) REFERENCES Tests (test_id),
  FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE Chats (
  chat_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user1_id int(11) NOT NULL,
  user2_id int(11) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Messages (
  message_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  chat_id int(11) NOT NULL,
  message_text text NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users (user_id),
  FOREIGN KEY (chat_id) REFERENCES Chats (chat_id)
);

CREATE TABLE Swipes (
  swipe_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  swiper_id int(11) NOT NULL,
  swiped_id int(11) NOT NULL,
  swipe_direction varchar(255) NOT NULL,
  swiped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Matches (
  match_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user1_id int(11) NOT NULL,
  user2_id int(11) NOT NULL,
  matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Reports (
  report_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  reported_item_type varchar(255) NOT NULL,
  reported_item_id int(11) NOT NULL,
  report_reason text NOT NULL,
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_resolved TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE Adjectives (
  adj_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  adj_name varchar(255) NOT NULL
);

CREATE TABLE Animals (
  animal_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  animal_name varchar(255) NOT NULL
);

CREATE TABLE Notifications (
  notification_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  match_id int(11) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES Matches(match_id)
);
