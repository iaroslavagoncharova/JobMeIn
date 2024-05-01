# JobMe In

**Welcome to JobMe In**, a Tinder-type app for job search free of discrimination. This README provides information on how to use the app, deploy it, and details about its functionalities.

## Screenshots

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

## Database Description

The app's database consists of 23 tables:

- **Adjectives** stores adjectives that are used for username generation
- **Animals** stores animals' names that are used for username generation         
- **ApplicationLinks** stores links added to applications
- **Applications** stores users' job applications, including application text and status of the application ('submitted', 'accepted', 'declined')
- **Attachments** stores users' attachments, such as resumes, CVs, personal projects, etc.
- **Chats** stores all chats, including user IDs and interview status
- **Education** consists of users' education information, including school, degree, field, and graduation date        
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

<img src="https://github.com/iaroslavagoncharova/JobMeIn/assets/111697910/2626cacd-a564-4320-92d0-76f523afb382" width="400" />
Click the image to open it in a new tab.

## Functionalities

## Known issues

## References

**Libraries**: 

## CI/CD

[Workflow](https://github.com/iaroslavagoncharova/job-server/actions/workflows/node.js.yml)

## Tests (integration+api, unit)

[Tests](https://github.com/iaroslavagoncharova/job-server/tree/main/auth-api/test)


