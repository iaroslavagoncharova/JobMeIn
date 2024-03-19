CREATE TABLE UserLevels (
  level_id int(11) AUTO_INCREMENT PRIMARY KEY,
  level_name varchar(255) NOT NULL
);

CREATE TABLE `Users` (
  user_id int(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  user_level_id int NOT NULL,
  fullname varchar(255) NOT NULL,
  phone varchar(255),
  about_me text,
  status varchar(255),
  user_type varchar(255) NOT NULL,
  link varchar(255),
  field varchar(255)
);

CREATE TABLE JobExperience (
  experience_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  job_title varchar(255) NOT NULL,
  job_place varchar(255) NOT NULL,
  job_city varchar(255),
  description varchar(255),
  start_date date NOT NULL,
  end_date date NOT NULL
);

CREATE TABLE Education (
  education_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  school varchar(255) NOT NULL,
  degree varchar(255) NOT NULL,
  field varchar(255),
  graduation date
);

CREATE TABLE Attachments (
  attachment_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  link varchar(255) NOT NULL
);

CREATE TABLE JobAds (
  job_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  job_address varchar(255) NOT NULL,
  job_title varchar(255) NOT NULL,
  salary varchar(255) NOT NULL,
  user_id int(11) NOT NULL,
  job_description varchar(255) NOT NULL,
  deadline_date date NOT NULL,
  field varchar(255) NOT NULL
);

CREATE TABLE Skills (
  skill_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  skill_name varchar(255) NOT NULL,
  type varchar(255) NOT NULL
);

CREATE TABLE JobSkills (
    skill_id int(11) NOT NULL,
    job_id int(11) NOT NULL
);

CREATE TABLE UserSkills (
  user_id int(11) NOT NULL,
  skill_id int(11) NOT NULL
);

CREATE TABLE KeyWords (
    keyword_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    keyword_name VARCHAR(255) NOT NULL
);

CREATE TABLE KeywordsJobs (
  keyword_id int(11) NOT NULL,
  job_id int(11) NOT NULL
);

CREATE TABLE Applications (
  application_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  job_id int(11) NOT NULL,
  status varchar(255) NOT NULL,
  application_text text,
  created_at date NOT NULL
);

CREATE TABLE ApplicationLinks (
  link_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  application_id int(11) NOT NULL,
  link varchar(255) NOT NULL
);

CREATE TABLE Tests (
  test_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  test_type varchar(255) NOT NULL,
  user_id int(11),
  test_link varchar(255)
);

CREATE TABLE JobTests (
  job_id int(11) NOT NULL,
  test_id int(11) NOT NULL
);

CREATE TABLE UserTests (
  test_id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  percentage int(11) NOT NULL,
  completed_at date NOT NULL
);

CREATE TABLE Chats (
  chat_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  created_at date NOT NULL
);

CREATE TABLE UserChats (
  user_id int(11) NOT NULL,
  chat_id int(11) NOT NULL
);

CREATE TABLE Messages (
  message_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id int(11) NOT NULL,
  chat_id int(11) NOT NULL,
  message_text text NOT NULL,
  sent_at date NOT NULL
);

CREATE TABLE Swipes (
  swipe_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  swiper_id int(11) NOT NULL,
  swiped_id int(11) NOT NULL,
  swipe_direction varchar(255) NOT NULL,
  swiped_at datetime NOT NULL
);

CREATE TABLE Matches (
  match_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user1_id int(11) NOT NULL,
  user2_id int(11) NOT NULL,
  matched_at datetime NOT NULL
);

CREATE TABLE Reports (
    report_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id int(11) NOT NULL,
    reported_item_type varchar(255) NOT NULL,
    reported_item_id int(11) NOT NULL,
    report_reason text NOT NULL,
    reported_at datetime NOT NULL,
    is_resolved tinyint NOT NULL
);

ALTER TABLE `JobExperience` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Education` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `UserSkills` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `UserSkills` ADD FOREIGN KEY (`skill_id`) REFERENCES `Skills` (`skill_id`);

ALTER TABLE `UserTests` ADD FOREIGN KEY (`test_id`) REFERENCES `Tests` (`test_id`);

ALTER TABLE `UserTests` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Attachments` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Tests` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Applications` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Applications` ADD FOREIGN KEY (`job_id`) REFERENCES `JobAds` (`job_id`);

ALTER TABLE `JobAds` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Messages` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `Messages` ADD FOREIGN KEY (`chat_id`) REFERENCES `Chats` (`chat_id`);

ALTER TABLE `UserChats` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE `UserChats` ADD FOREIGN KEY (`chat_id`) REFERENCES `Chats` (`chat_id`);

ALTER TABLE `ApplicationLinks` ADD FOREIGN KEY (`application_id`) REFERENCES `Applications` (`application_id`);

ALTER TABLE `Reports` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);

ALTER TABLE KeywordsJobs ADD FOREIGN KEY (keyword_id) REFERENCES KeyWords(keyword_id);

ALTER TABLE KeywordsJobs ADD FOREIGN KEY (job_id) REFERENCES JobAds(job_id);

ALTER TABLE JobSkills ADD FOREIGN KEY (skill_id) REFERENCES Skills(skill_id);

ALTER TABLE JobSkills ADD FOREIGN KEY (job_id) REFERENCES JobAds(job_id);

ALTER TABLE JobTests ADD FOREIGN KEY (job_id) REFERENCES JobAds(job_id);

ALTER TABLE JobTests ADD FOREIGN KEY (test_id) REFERENCES Tests(test_id);
