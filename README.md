# Full-Stack Study Room Booking Application

A complete MERN stack application designed to solve scheduling conflicts for university study rooms. The platform provides a secure, role-based system for students and administrators, featuring a polished UI, automated notifications, and an intelligent suggestion engine.

**Live Demo:** [https://study-room-booking-app-1.onrender.com](https://study-room-booking-app-1.onrender.com)
---

## 🚀 Project Overview

This application was built to address the common problem of scheduling conflicts and inefficient use of study spaces on a university campus. It provides a centralized, digital solution where students can find and reserve rooms, and administrators can manage the entire system.

The project was developed using an AI-assisted workflow, where I served as the project lead, architect, and prompt engineer, guiding a large language model (Gemini) through the entire development lifecycle, from initial concept to final deployment.

## ✨ Key Features

This application is packed with professional, real-world features:

* **Role-Based Authentication:** Secure login and registration system using JWT (JSON Web Tokens) with separate permissions for regular users and administrators.
* **Conflict Detection Engine:** The core backend logic automatically prevents any double-bookings or scheduling overlaps.
* **Interactive Calendar View:** A clean, full-page calendar displays all existing bookings, with navigation to view different months, weeks, and days.
* **Comprehensive Admin Panel:** A secure, admin-only dashboard to:
    * Create, view, and delete study rooms.
    * View and delete user accounts (with a safeguard to prevent self-deletion).
    * View and delete all bookings.
* **Reporting Dashboard:** An admin-only analytics page with a dynamic bar chart visualizing room usage statistics.
* **Automated Email Notifications:** Users automatically receive a professional confirmation email upon a successful booking, sent via Nodemailer.
* **AI-Powered Suggestions:** An intelligent feature that analyzes a room's schedule and suggests the next 3 available time slots if a user's initial choice is already taken.
* **Polished & Multi-Language UI/UX:** A modern, fully responsive user interface built with MUI, featuring a professional monochromatic theme. The entire application is translated into four languages (English, Spanish, Hindi, Telugu) with a seamless language switcher.

## 🛠️ Tech Stack

This project utilizes the MERN stack and other modern web technologies.

| Frontend | Backend | Database | Deployment |
| :--- | :--- | :--- | :--- |
| React.js | Node.js | MongoDB | Render.com |
| MUI (Material-UI) | Express.js | Mongoose | GitHub |
| `react-router-dom` | JWT (Authentication) | | |
| `axios` | `bcryptjs` (Hashing) | | |
| `i1next` (Translation) | Nodemailer (Email) | | |
| `react-big-calendar` | `moment.js` | | |
| `chart.js` | | | |

## 📂 Project Structure

This project is structured as a **monorepo**, with the frontend and backend codebases managed in separate folders within a single GitHub repository.

* `/frontend`: Contains the complete React application.
* `/backend`: Contains the Node.js/Express server and all related API logic.

## ⚙️ Getting Started: Local Setup

To run this project on your local machine, follow these steps:

### Prerequisites

* Node.js installed
* npm or yarn installed
* MongoDB Atlas account (for the database)
* A Gmail account with an "App Password" (for email notifications)

### 1. Clone the Repository

```bash
git clone [https://github.com/Sat-C05/Study-room-Booking-App](https://github.com/Sat-C05/Study-room-Booking-App)
cd Study-room-Booking-App
```

2. Backend Setup
```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file in the backend folder and add the following variables:
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-digit-gmail-app-password

# Start the backend server
npm start
```
The backend will be running on http://localhost:5000.

3. Frontend Setup
```bash
# Navigate to the frontend folder from the root directory
cd frontend

# Install dependencies
npm install

# Create a .env file in the frontend folder and add the following variable:
REACT_APP_API_URL=http://localhost:5000

# Start the frontend development server
npm start
```

The frontend will be running on http://localhost:3000.

☁️ Deployment
The application is deployed on Render using its monorepo support:

The backend is deployed as a Web Service.

The frontend is deployed as a Static Site.

Render is configured to automatically redeploy the application whenever new changes are pushed to the main branch of the GitHub repository.
