## JobMe In

**Welcome to JobMe In**, a Tinder-type app for job search free of discrimination. This README provides information on how to use the app, deploy it, and details about its functionalities.

## Screenshots
## Candidate profile
## Employer profile
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/8f56d83e-fa4d-4605-9fee-a59e62dc58fb" width="400" alt="Employer profile"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/f074a2e5-9182-45a6-9198-4473de3f39a1" width="400" alt="Editing company info"/>
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/edc3a1c5-220d-4101-8fc7-cffe7c27ac1a" width="400" alt="Employer chats"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/7bc19bf1-5448-4a48-8ed7-bba98bbfca0c" width="400" alt="Chat with a candidate"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/a112ac5e-cec9-43ca-a38a-d4cc91649dd6" width="400" alt="Applications in the chat"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/00d46d76-3fec-4eb0-a9c1-86c094997b90" width="400" alt="Employer feed page 1"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/f3da802b-2857-4e2c-a93c-b0751437569f" width="400" alt="Employer feed page 2"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/90c2f942-8868-4afc-85f9-a32dbb296b8d" width="400" alt="Employer feed page 3"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/1cc3696e-6b46-436a-b22c-686482298b50" width="400" alt="Employer tests"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/b071f184-85cb-4a80-a9c6-bed5735d1373" width="400" alt="Adding new test"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/293cd649-61fd-45fb-aa10-138b2f710de9" width="400" alt="Editing a test"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/991868a0-7974-4350-a68e-c2f96dfbd4ee" width="400" alt="Employer's jobs"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/d6f89ca3-c214-46c7-aada-03e7cb53ef50" width="400" alt="Editing a job"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/53788d16-41f7-43ec-9d81-5e6fe7c6052d" width="400" alt="Received applications"/> 
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/57fe2196-fd0c-426a-9e4d-e7d67a301bd5" width="400" alt="Received application"/> 
<img src="" width="400" alt=""/> 
<img src="" width="400" alt=""/> 
<img src="" width="400" alt=""/> 
<img src="" width="400" alt=""/> 
<img src="" width="400" alt=""/> 
<img src="" width="400" alt=""/> 
<img src="" width="400" alt=""/> 
<img src="" width="400" alt=""/> 
<img src="" width="400" alt=""/> 
## Administrator
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/12485c5f-7a02-43cc-96ea-935e95afd45d" width="400" alt="Reported users" />
<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/10b476b1-6cf1-435c-9d66-c740049f4fa8" width="400" alt="Administrator profile"/>
## Instructions

## Deployment

To deploy the JobMe In app, follow these steps:

1. **Frontend Deployment**:

   - If using React Native, ensure Expo Go is installed on your device.
   - Clone the repository.
   - Navigate to the project directory and run `npm install` to install dependencies.
   - Ensure both your device and computer are connected to Metropolia VPN.
   - Start the development server with `expo start` or `npm start`.
   - Scan the QR code with Expo Go to view the app on your device.

2. **Backend Deployment**:
   - Ensure your computer is connected to Metropolia VPN.
   - Authentication server is available at [auth-api](http://10.120.32.56/auth-api/api/v1)
   - Upload server is available at [upload](http://10.120.32.56/upload/api/v1)

## Backend

## API Documentation

[Auth-api](https://users.metropolia.fi/~iaroslag/jobmein/)

## UI Design

[Canva mockup](https://www.canva.com/design/DAF77H6FG6M/UkPWFmMVxXkB_4k-d2aC7w/edit?utm_content=DAF77H6FG6M&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Database Description

The app's database consists of 23 tables:

- **Adjectives** stores adjectives that are used for username generation
- **Animals** stores animals' names that are used for username generation         
- **ApplicationLinks** stores links added to applications
- **Applications** stores users' job applications, including application text and status of the application ('submitted', 'accepted', 'declined')
- **Attachments** stores users' attachments, such as resumes, CVs, personal projects, etc.
- **Chats** stores all chats, including user IDs and interview status
- **Education** consists of users' education information, including school, degree, field, and graduation date
- **Fields** stores all available job fields  
- **JobAds** stores all app's job ads and their information, including job title, salary, address, field, description, and deadline date   
- **JobExperience** consists of users' job experience information, including job title, company, city, description, start and end dates
- **JobSkills** associates skills from the Skills table with the job ads they are required for         
- **JobTests** associates tests from the Tests table with the job ads they are added to
- **Keywords** stores the keywords that employers can use to help candidates easily identify and find jobs
- **KeywordsJobs** associates keywords from the Keywords table for job ads
- **Matches** stores information about the matches (employer and candidate have swiped each other right)
- **Messages** stores messages sent in chats by users
- **Reports** stores all reported items (such as job ads and users) with the report reason stored here
- **Skills** stores the skills that employers can use to help candidates easily identify and find jobs and candidates can use to help employers easily choose the most qualified candidates
- **Swipes** consists of swipe records (right-left, who was the swiper, and who/what was swiped)
- **Tests** stores all tests created by JobMe In and employers that can be used for testing various aspects, such as hard and soft skills
- **UserLevels** includes three user levels ('admin', 'candidate', 'employer')
- **Users** stores all user information, including username, full name, address, phone, email, password, field, about me text, status (active or not), user type, etc.
- **UserSkills** associates users with their skills from the Skills table
- **UserTests** associates users with the tests they have taken from the Tests table

<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/edc6f18b-1068-4c9f-8296-ff4ee66e419b" width="400" />
Click the image to open it in a new tab.

## Functionalities

**Users** can 
- create profiles and log in
- access instructions on how to use the application

**Candidates** can 
- add to the profile, edit, and delete personal information, education, work experience, attachments, and skills
- browse job ads by swiping right and left (liking and disliking a job) and using navigation arrows for more details (such as salary, address, required skills, deadline date, and employer's information)
- maintain privacy until accepting interview invitations; introduced to employers by randomized names (adjective + animal)
- set job status ("active" or "not active") to control visibility to employers
- select preferred fields and filter job listings accordingly
- send applications to liked jobs and manage sent applications
- get a notification when there is a match and be able to start a chat with an employer who has swiped them
- complete tests to increase compatibility percentage for jobs and visibility
- view compatibility percentage for each job based on completed tests and skills matching
- report inappropriate job ads

**Employers** can
- add and edit company information
- post job ads, specify required skills, tests, and keywords, and manage them
- browse candidates by swiping right and left (liking or disliking a candidate) and using navigation arrows for more details (education, experience, skills, attachments)
- report inappropriate candidates
- get a notification when there is a match and be able to start a chat with a candidate who has liked one or more job ads of this employer
- create and attach tests to job ads, or utilize existing tests
- review, accept, and decline applications
- send interview invitations to candidates
- select preferred fields and filter candidate listings accordingly

**Administrator** can
- receive and manage reports, including accepting or ignoring them
- remove inappropriate candidates and job ads
- provide support by chatting with candidates and employers regarding issues

## Known issues

## References

**Libraries**: react-native-community/datetimepicker, react-native-fontawesome, react-navigation/bottom-tabs, react-navigation/material-top-tabs, rneui/base, expo-document-picker, expo-file-system, expo-intent-launcher, react-native-swipe-cards

## CI/CD

[Workflow](https://github.com/iaroslavagoncharova/job-server/actions/workflows/node.js.yml)

## Tests (integration+api, unit)

[Tests](https://github.com/iaroslavagoncharova/job-server/tree/main/auth-api/test)


