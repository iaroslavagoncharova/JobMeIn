# JobMe In

**Welcome to JobMe In**, a Tinder-type app for job search free of discrimination. This README provides information on how to use the app, deploy it, and details about its functionalities.

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

[Auth-api](https://users.metropolia.fi/~iaroslag/apidoc/auth-api/)
[Media-api](https://users.metropolia.fi/~iaroslag/apidoc/media-api/)

## Database Description

The app's database consists of 23 tables:

- **Adjectives**:
- **Animals**:           
- **ApplicationLinks**: 
- **Applications**:
- **Attachments**:       
- **Chats**:             
- **Education**:        
- **JobAds**:            
- **JobExperience**:
- **JobSkills**:         
- **JobTests**:     
- **Keywords**:
- **KeywordsJobs**:
- **Matches**:
- **Messages**:
- **Reports**:
- **Skills**:
- **Swipes**:
- **Tests**:
- **UserLevels**:
- **Users**:
- **UserSkills**:
- **UserTests**:

