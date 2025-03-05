# Installation and Setup Guide

## Prerequisites
- Node.js (version 22)
- npm
- MySQL

## Getting Started

### Step 1: Clone the repository
```bash
git clone [<repository-url>](https://github.com/PTIT-NoTarget/DATN)
cd DATN
```
### Step 2: Backend Setup
#### Configure database

Connect to database and create database daily_dev
```sql
create database daily_dev;
```

#### Config backend
```bash
# Navigate to backend directory
cd BE_CODE

# Install dependencies
npm install

# Change database username and password in BECODE/config/config.json and BECODE/app/config/config-db.js

# Start the backend server
npm start
```
The backend server will run on http://localhost:8080

### Step 3: Frontend Setup
```bash
# Navigate to frontend directory
cd ../FE_CODE

# Install dependencies
npm install --force

# Start the Angular development server
npm start
```
The Angular application will be available at http://localhost:4200

## Technology Stack

### Frontend
- Framework: Angular 13
- UI Library: ng-zorro-antd
- State Management: Akita
- CSS: TailwindCSS
- Other libraries: Quill editor, Sentry monitoring
### Backend
- Framework: Express.js
- ORM: Sequelize
- Socket.IO for real-time notifications
### Database
- MySQL
### Main Features
- User management
- Project management
- Export data to Excel
- Real-time notifications
