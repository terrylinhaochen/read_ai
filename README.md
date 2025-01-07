# AI Book Learning Assistant

An interactive React application that helps users explore and understand books through AI-powered discussions and learning aids.

## Features

- 🤖 AI-powered book discussions and analysis
- 📚 Curated selection of classic and contemporary books
- 🎯 Personalized learning goals and progress tracking
- 💡 Interactive learning aids and discussion prompts
- 📝 Reflection tools and note-taking capabilities
- 🔄 Chat history persistence with Firebase
- 🎨 Modern, responsive UI with Tailwind CSS

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book-learning-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

## System Architecture

### Frontend Components

- **BookLearningApp.js**: Main application component handling the core UI and user interactions
- **LearningAid.js**: Reusable components for displaying various types of learning content
- **AuthContext.js**: Authentication context provider for Firebase authentication

### Services

- **chatService.js**: Handles chat-related operations with Firebase
- **openai.js**: Manages communication with OpenAI API for generating responses

### Key Features Implementation

1. **Authentication Flow**
   - Implemented using Firebase Authentication
   - Managed through AuthContext for global state management

2. **Chat System**
   - Real-time chat persistence using Firebase Firestore
   - Structured message format with support for various content types
   - Automatic chat history saving and retrieval

3. **AI Integration**
   - OpenAI GPT-4 integration for intelligent responses
   - Structured response format including:
     - Main answer
     - Learning aids
     - Follow-up questions

4. **Learning Progress**
   - Four-stage learning process:
     1. Aim (Goal Setting)
     2. Listen (Content Overview)
     3. Talk (Interactive Discussion)
     4. Reflect (Understanding Review)

5. **UI/UX Features**
   - Responsive sidebar for book selection and navigation
   - Progress tracking bar
   - Interactive message components
   - Dynamic learning aids
   - Real-time chat interface

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Add the following security rules to Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
    }
  }
}
```

## OpenAI Integration

The application uses OpenAI's GPT-4 model for generating responses. The integration:

- Maintains a consistent response format
- Includes error handling and response parsing
- Supports various types of learning aids and prompts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 API
- Firebase for backend services
- React and Tailwind CSS communities
