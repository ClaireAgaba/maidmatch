# MaidMatch

MaidMatch is a mobile application that connects homeowners with trusted household help. The app provides a platform for maids to find employment opportunities and for homeowners to find reliable domestic help.

## Features

- **User Registration**
  - Separate signup flows for maids and homeowners
  - Detailed profile creation for both user types

- **For Maids**
  - Professional profile creation
  - Experience and skills showcase
  - Job application system

- **For Homeowners**
  - Easy maid search and filtering
  - Requirement specification
  - Secure hiring process

## Tech Stack

### Frontend
- React Native with Expo
- TypeScript for type safety
- React Navigation for screen management
- React Native Paper for UI components
- Organized in a modular structure:
  - `components/`: Reusable UI components
  - `screens/`: Main application screens
  - `navigation/`: Navigation configuration
  - `services/`: API integration
  - `theme/`: Styling and theming
  - `types/`: TypeScript type definitions

### Backend
- Node.js/Express server
- TypeScript for type safety
- Structured in layers:
  - `controllers/`: Request handlers
  - `routes/`: API endpoints
  - `models/`: Data models
  - `middleware/`: Auth and request processing
  - `services/`: Business logic
  - `config/`: Application configuration

### Database
- MongoDB with Mongoose ORM
- Collections:
  - Users (Maids and Homeowners)
  - Jobs
  - Reviews
  - Messages
  - Reference Data (Districts, Tribes, Languages)
- Optimized with indexes for frequently queried fields

## Project Structure
```
maidmatch/
├── src/                   # Frontend source code
│   ├── components/        # Reusable UI components
│   ├── screens/          # Application screens
│   ├── navigation/       # Navigation setup
│   ├── services/         # Frontend services
│   ├── theme/           # UI theming
│   └── types/           # TypeScript definitions
│
├── backend/              # Backend source code
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API routes
│   │   ├── models/      # Database models
│   │   ├── middleware/  # Express middleware
│   │   ├── services/    # Business logic
│   │   └── config/      # Backend configuration
│   └── package.json     # Backend dependencies
│
├── assets/              # Static assets
├── App.tsx             # Main application entry
└── package.json        # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- MongoDB (v4.4 or newer)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ClaireAgaba/maidmatch.git
```

2. Install frontend dependencies:
```bash
cd maidmatch
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both root and backend directories
   - Update the variables with your configuration

5. Start the backend server:
```bash
cd backend
npm run dev
```

6. Start the frontend development server:
```bash
cd ..
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact

Claire Agaba - [GitHub](https://github.com/ClaireAgaba)

Project Link: [https://github.com/ClaireAgaba/maidmatch](https://github.com/ClaireAgaba/maidmatch)
