# Lumen: A Learning Management System
## Overview
Lumen is a web-based Learning Management System (LMS) built with React, TypeScript, ExpressJS, MongoDB, and Supabase. It provides a platform for educators to create and manage courses, and for students to access and complete course materials.

## Features
- Course Management: Create, edit, and manage courses with multiple sections and modules.
- Content Creation: Upload various types of content (text, images, videos, documents) and organize them into lessons.
- Student Enrollment: Manage student enrollment and track progress.
- Assignments: Create assignments with different question types.
- Gradebook: Track student performance and generate reports.
- Communication: Facilitates communication between instructors and students through announcements and messaging.
  
## Technologies Used
- Frontend: React, TypeScript, TailwindCSS, Shadcn/UI
- Backend: ExpressJS
- Database: MongoDB
- File Storage: Supabase

## Project Structure

/client - Front-end code using Vite, React, and Tauri.  
/docs - Documentation for the project.  
/server - Back-end server using ExpressJS.  

## Prerequisites

Ensure you have the following installed:

- Node.js
- PNPM (Package Manager)
- Tauri CLI (if you're building for Tauri)
- Rust (for Tauri)

## Installation

1. Install client dependencies

```
cd client
pnpm install
```

2. Install server dependencies

```
cd ../server
pnpm install
```

## Running the website

1. Start the server

```
cd server
pnpm run dev
```

2. Start the client in a new session

```
cd client
pnpm run dev
```

This will start the back-end at `http://localhost:3000/` and the front-end at `http://localhost:1420/`.

## Build for production

1. Build the Tauri application

```
cd client
pnpm tauri build
```

This will package the application for the desired platform.

You can also view the production page at:

- Client: [`https://lumen-omega.vercel.app/`](https://lumen-omega.vercel.app/)
- Server: [`https://lumen-668c.onrender.com/api/`](https://lumen-668c.onrender.com`)
