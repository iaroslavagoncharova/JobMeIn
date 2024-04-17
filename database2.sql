DROP DATABASE IF EXISTS JobMeIn;
CREATE DATABASE JobMeIn;
USE JobMeIn;

CREATE user 'jobuser'@'localhost' identified by 'MeOllaanRyhma3!';  
GRANT ALL PRIVILEGES on JobMeIn.* to 'jobuser'@'localhost'; 
FLUSH PRIVILEGES; 

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
  end_date date,
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
  attachment_name VARCHAR(255) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  filesize INT NOT NULL,
  media_type VARCHAR(255) NOT NULL,
  user_id int(11) NOT NULL,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
  completed_at date NOT NULL,
  FOREIGN KEY (test_id) REFERENCES Tests (test_id),
  FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE Chats (
  chat_id int(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user1_id int(11) NOT NULL,
  user2_id int(11) NOT NULL,
  interview_status varchar(255),
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
  swipe_type varchar(255) NOT NULL,
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


INSERT INTO UserLevels (level_name) VALUES ("Candidate"), ("Employer"), ("Admin");
INSERT INTO Users (username, password, email, user_level_id, fullname, phone, user_type) VALUES ("Slava", "$2a$10$0.XQQChT9PUlSLKhXe4kweNqkCqcdizWVh45CmZxJ5gEPx5EWm/J2", "slava@example.com", 1, "Iaroslava Goncharova", "+358410000000", "candidate");
INSERT INTO Users (username, password, email, user_level_id, fullname, phone, user_type) VALUES ("Kamilla", "$2a$10$0.XQQChT9PUlSLKhXe4kweNqkCqcdizWVh45CmZxJ5gEPx5EWm/J2", "kamilla@example.com", 2, "Kamilla Karenius", "+358410000000", "employer");
INSERT INTO Users (username, password, email, user_level_id, fullname, phone, user_type) VALUES ("Anna", "$2a$10$0.XQQChT9PUlSLKhXe4kweNqkCqcdizWVh45CmZxJ5gEPx5EWm/J2", "anna@example.com", 3, "Anna Malassu", "+358410000000", "admin");
INSERT INTO Users (username, password, email, user_level_id, fullname, phone, user_type) VALUES ('Bob', '12345', 'bob@example.com', 1, 'Bob Smith', '+358410000000', 'candidate');
INSERT INTO Users (username, password, email, user_level_id, fullname, phone, user_type) VALUES ('Jane', '67890', 'jane@example.com', 1, 'Jane Smith', '+358110000000', 'candidate');
INSERT INTO Education (user_id, school, degree, field, graduation) VALUES (1, 'ammattikoulu', 'ammattitutkinto', 'matkailu', '2022-06-01'), (2, 'amk', 'alempi korkeakoulututkinto', 'it', '2023-08-20'), (3, 'amk', 'ylempi korkeakoulututkinto', 'tietoturva', '2024-03-24');
INSERT INTO JobExperience (user_id, job_title, job_place, job_city, start_date) VALUES (1, 'barista', 'cafe', 'Helsinki', '2022-10-10'), (2, 'hr-manager', 'Kamilla Oy', 'Espoo', '2023-11-11'), (3, 'admin', 'JobMeIn Oy', 'Helsinki', '2024-03-24');
INSERT INTO Attachments (attachment_name, user_id, filename, filesize, media_type) VALUES ('Resume', 1, 'https://example.com/resume.pdf', 256, 'pdf'), ('Cover Letter', 2, 'https://example.com/cover_letter.docx', 24626, 'docx'), ('Portfolio', 3, 'https://example.com/portfolio.pdf', 500, 'pdf');
INSERT INTO JobAds (job_address, job_title, salary, user_id, job_description, deadline_date, field) VALUES ('Helsinki', 'Software Engineer', '7000', 2, 'Etsitään senior software engineerin', '2024-04-30', 'IT'), ('Vantaa', 'Tarjoilija', '1200', 2, 'Kesätöitä opiskelijoille', '2024-04-15', 'Ravintola- ja catering'), ('Joensuu', 'Marjamyyjä', '800', 2, 'Kesätöitä Joensuun torille toukokuusta elokuuhun', '2024-05-15', 'Kauppa');
INSERT INTO Skills (skill_name, type) VALUES ('Java', 'Kova'), ('Asiakaspalvelu', 'Pehmeä'), ('Suomen kieli', 'Kova');
INSERT INTO JobSkills (skill_id, job_id) VALUES (1, 1), (2, 2), (3, 3);
INSERT INTO UserSkills (user_id, skill_id) VALUES (1, 1), (1, 2), (1, 3);
INSERT INTO KeyWords (keyword_name) VALUES ('Full Stack'), ('Ravintola'), ('Marjamyynti');
INSERT INTO KeywordsJobs (keyword_id, job_id) VALUES (1, 1), (2, 2), (3, 3);
INSERT INTO Applications (user_id, job_id, status) VALUES (1, 2, 'Pending'), (1, 1, 'Submitted'), (1, 3, 'Pending');
INSERT INTO ApplicationLinks (application_id, link) VALUES (1, 'https://example.com/application1'), (2, 'https://example.com/application2'), (3, 'https://example.com/application3');
INSERT INTO Tests (test_type, user_id, test_link) VALUES ('Java-testi',  2, 'https://example.com/java_test'), ('Persoonallisuustesti', NULL, 'https://example.com/personality_test'), ('Empatiatesti', 2, 'https://example.com/empathy_test');
INSERT INTO JobTests (job_id, test_id) VALUES (1, 1), (2, 2), (3, 3);
INSERT INTO UserTests (test_id, user_id, completed_at) VALUES (1, 1, '2024-03-24'), (3, 1, '2024-03-23');
INSERT INTO Chats (user1_id, user2_id) VALUES (1, 2), (2, 3);
INSERT INTO Messages (user_id, chat_id, message_text) VALUES (1, 1, 'Hei, olen maailman paras ohjelmistokehittäjä'), (2, 1, 'Ok, kiva');
INSERT INTO Swipes (swiper_id, swiped_id, swipe_direction, swipe_type) VALUES (1, 2, 'right', 'candidate'), (2, 1, 'right', 'job');
INSERT INTO Matches (user1_id, user2_id) VALUES (1, 2);
INSERT INTO Reports (user_id, reported_item_type, reported_item_id, report_reason) VALUES (2, 'User', 1, 'Kysyi henkilökohtaisia kysymyksiä'), (1, 'Job', 3, 'Marjamyyjä ei voi saada 800 euroa');
INSERT INTO Animals (animal_name) VALUES ('Leijona'), ('Kissa'), ('Delfiini');
INSERT INTO Adjectives (adj_name) VALUES ('Ystävällinen'), ('Ahkera'), ('Luova');
INSERT INTO Notifications (match_id) VALUES (1);
