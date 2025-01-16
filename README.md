# MaidMatch

A mobile application connecting homeowners with trusted household help. Built with React Native, Node.js, and Postgres.

## Features

- User profiles for maids and homeowners
- Job posting and application system
- Search and filter functionality
- Review and rating system
- Real-time messaging

## Tech Stack

```
Frontend: React Native + Expo + TypeScript
Backend:  Node.js + NestJS + TypeScript
Database: Postgres + TypeORM
```

## Project Structure

```
├── src/               # Frontend
│   ├── components/    # UI components
│   ├── screens/      # App screens
│   ├── services/     # API services
│   └── theme/        # Styling
│
└── backend/          # Server
    └── src/
        ├── routes/   # API endpoints
        ├── models/   # Data models
        └── services/ # Business logic
```

## Quick Start

### Prerequisites
- Node.js (v14+)
- npm/yarn
- Postgres

### Setup

1. Clone and install:
```bash
git clone https://github.com/ClaireAgaba/maidmatch.git
cd maidmatch

# Frontend
npm install
cp .env.example .env

# Backend
cd backend
npm install
cp .env.example .env
```

2. Start servers:
```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd ..
npm start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first.
