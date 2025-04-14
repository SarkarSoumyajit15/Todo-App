Overview

- This document outlines the implementation details of the Todo List fullstack application built as part of the assessment. The goal was to create a collaborative task management tool with full CRUD capabilities for todos, user tagging/mentioning, authentication, filtering, sorting, and more.

Tech Stack

- Backend : Node.js + Express (Basic version)
- NestJS (Advanced version following best practices — preferred for evaluation)
- MongoDB (Database)
- Mongoose (ODM for MongoDB)
- JWT Authentication for secure routes
- bcryptjs for password hashing

Frontend
- React (with hooks)
- React Router for navigation
- Context API for global user state management
- Tailwind CSS for styling
- React Icons and Headless UI for UI elements and modals

Project Structure
The repo contains two separate backend implementations:

/client                 # React frontend
/server        # Basic Node.js + Express backend
/nest-server           # Advanced NestJS backend (preferred)


Features Implemented

User Management
JWT-based signup/login

Tokens stored in localStorage

Protected routes


- Todo Management : Create, edit, delete todos
- Set priority (Low, Medium, High)
- Add tags to todos
- Mention other users using @username feature
- View todos created or where user is mentioned
- Only creator or mentioned users can access todo details

Todo Details : 
- Click to view full details of a todo
- Add notes through a modal interface
- List View  : Paginated list of todos [done but static]
- Filtering by tags, priority [done], or mentioned users[ not implimented yet]
- Sorting by date or priority

Real-time UI updates on changes

- Data Export : [Not Implemented] Export todos to CSV/JSON


Authentication Strategy
- Users authenticate using JWT.
- Token is stored in localStorage on the frontend.
- Backend validates JWT on protected routes using middleware (guard in NestJS).
- Users can only access todos they’ve created or where they're mentioned.

Database Schema : MongoDB was chosen for flexible schema design. 

Core collections:
- User: Contains user credentials and assigned todos
- Todo: Main task with metadata like tags, mentions, notes

Tag: Custom tags per user


How to Run the Project


Backend (NestJS)

- cd backend-nest
- npm install
- npm run start:dev


Create a .env file based on .env.sample:

Copy it and Edit it 


Frontend

- cd client
- npm install
- npm run dev


Update API_BASE_URL if needed in your services file.


Assumptions & Design Decisions
- User mentions are validated using username matching during todo creation.

- Notes are embedded in the Todo document for simplicity.

- Tag and User access is scoped based on creation or mentions.

- Used Context API instead of Redux due to app's size and simplicity.

- Validation and error responses follow RESTful API best practices.

Additional Improvements

- Role-based access control at the todo level
- Added meaningful error messages and edge case handling