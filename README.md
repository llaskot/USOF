Innovation Campus Q&A

A React + Redux SPA for Q&A platform with user registration, login, and content management.

Features

1️⃣ User Authentication

Registration with email confirmation

Login / Logout via modal

Password validation and optional full name

2️⃣ Authorization Logic

Buttons automatically check user status

Unauthorized users trigger login modal

3️⃣ Profile Management

User info, avatar, role, and activity stats

Fallbacks for missing data

4️⃣ Content Management

Categories, posts, comments via Redux

Dynamic forms with real-time validation

5️⃣ Advanced React Patterns

React Portals for modals

Custom middleware for logging and auth checks

Tech Stack

React (hooks, functional components)

Redux Toolkit (slices, middleware)

React Router

CSS Modules

JavaScript ES6+

Project Structure

📁 components/ – UI components (forms, buttons, modals)
📁 store/ – Redux slices and middleware
📁 pages/ – Page-level components (registration, confirmation, profile)
📄 App.jsx – Main router and layout
📄 index.js – Redux provider and app entry

See details about API and additional info in API/docs

# Q_A_full — Full Setup (Production + Development)

This project combines a React frontend and an Express backend with MySQL.  
All commands are ready to copy-paste into your terminal.

---

## Production Setup

# 1️⃣ Install production dependencies (backend only)
# Installs Express, MySQL, bcrypt, etc.
```
npm run install
```

# 2️⃣ Create database and initial tables + data
# Runs init.sql then source.sql in sequence
# - ./API/src/backend/sql/init.sql — creates database and tables
# - ./API/src/backend/sql/source.sql — inserts initial production data
# ⚠️ MySQL will prompt for the root password. Make sure MySQL server is running.
```
npm run db:init
```

# 3️⃣ Optional: insert test data
# - ./API/src/backend/sql/testData.sql — inserts additional test entries
# ⚠️ MySQL will prompt for the root password. Make sure MySQL server is running.
```
npm run db:test
```


# 4️⃣ Start production server
```
npm start
```


# 4️⃣ Build frontend for production
npm run build
# Output will be in front/dist




## Development Setup

# 1️⃣ Install all dependencies (backend + frontend)
# Installs everything needed for development: Express, MySQL, React, Vite, etc.
```
npm run install:dev
```

# 2️⃣ Create database and initial tables + data
# Runs init.sql then source.sql in sequence
# - ./API/src/backend/sql/init.sql — creates database and tables
# - ./API/src/backend/sql/source.sql — inserts initial production data
# ⚠️ MySQL will prompt for the root password. Make sure MySQL server is running.
```
npm run db:init
```

# 3️⃣ Insert optional test data
# - ./API/src/backend/sql/testData.sql — inserts additional test entries
# ⚠️ MySQL will prompt for the root password. Make sure MySQL server is running.
```
npm run db:test
```

# 4️⃣ Start development server (backend + frontend concurrently)
# Backend on port 3001, frontend on Vite default port 5173
```
npm run start:dev
```

# 5️⃣ Optional: Start only backend API for development
```
npm run start:api
```

# 6️⃣ Optional: Start only frontend for development
```
npm run start:front
```

# 7️⃣ Build frontend (optional during dev)
# Compiles React app into static files in front/dist
```
npm run build
```

