# MyProperty - Real Estate Platform

A modern real estate platform connecting landlords, renters, and agents.

## Project Structure

```
MyProperty/
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Database models
│   │   └── routes/       # API routes
│   └── package.json
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── styles/       # Global styles
│   │   └── pages/        # Page components
│   └── package.json
└── docs/                 # Documentation
```

## Color Scheme
- Dark Blue: #0d1b2a
- Dark Gray: #1b263b
- Steel Blue: #415a77
- Light Blue: #778da9
- Light Gray: #e0e1dd

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory
2. Copy .env.example to .env and configure
3. Install dependencies: `npm install`
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

### Database Setup
1. Create PostgreSQL database
2. Run the schema.sql script
3. Configure database connection in .env

## Features
- User authentication (landlords, agents, renters)
- Property listings with approval workflow
- Contact system between users
- Responsive design
- Admin dashboard for property approval
