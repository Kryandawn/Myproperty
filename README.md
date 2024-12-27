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
1. Create PostgreSQL database named 'myproperty_dev'
2. Configure database connection in .env:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=myproperty_dev
   ```
3. Run the schema setup:
   ```bash
   node backend/src/scripts/setup-db.js
   ```

### Database Seeding
1. Ensure your PostgreSQL server is running and your .env variables are set
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Run the seeding script to populate sample data:
   ```bash
   npm run seed
   ```
4. Verify the seeding:
   - Connect to PostgreSQL: `psql myproperty_dev`
   - Check users: `SELECT * FROM users;`
   - Check properties: `SELECT * FROM properties;`
   - Check images: `SELECT * FROM property_images;`
   - Check messages: `SELECT * FROM contact_messages;`

The seeding script will create:
- Sample users (admin, landlord, agent, renter)
- Example properties with different statuses
- Property images
- Sample contact messages

## Features
- User authentication (landlords, agents, renters)
- Property listings with approval workflow
- Contact system between users
- Responsive design
- Admin dashboard for property approval
