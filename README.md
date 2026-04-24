# 🚀 Ground Control Station (GCS)

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-TypeScript-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![License](https://img.shields.io/badge/License-Academic-lightgrey)

A web-based **Ground Control Station** for monitoring and controlling a virtual robot through a REST API.

Developed as part of a software engineering project, this system is designed to support real-time robot interaction, continuous system monitoring, and comprehensive audit logging.

---

## 📸 Screenshots

### SignUp

Allows new users to create an account by providing required details.
Registers users with a default role and stores their information securely.

![SignUp](./screenshots/Signup.jpeg)

### SignIn

Enables registered users to securely access the system using their credentials.
Grants role-based access (Commander or Viewer) with authentication and error handling.

![SignIn](./screenshots/Signin.jpeg)

### Dashboard

Shows the robot’s real-time status—such as battery level, position, and movement state—while also providing controls to move and reset it.

![Dashboard](./screenshots/Dashboard.jpeg)

---

### LiDAR Summary

Presents an overview of LiDAR scan data, highlighting the nearest and farthest detected objects, average distance, and directional measurements.

![LidarSummary](./screenshots/LidarSummary.jpeg)

---

### Logs

Displays a paginated list of mission logs, including user actions, command types, timestamps, and whether each operation succeeded or failed.

![Logs](./screenshots/Logs.jpeg)

---

### Users

Displays all registered users along with their assigned roles, with the ability to switch roles between Commander and Viewer.

![Users](./screenshots/Users.jpeg)

---

## 📖 Overview

The Ground Control Station allows users to interact with a virtual robot in real time.

Users can:

* Monitor real-time robot status
* Send movement commands to the robot
* Reset the robot system
* View environment maps
* Inspect sensor readings
* Review mission logs

The system is split into:

- **Frontend** → dashboard and UI
- **Backend** → authentication, logging, API integration
- **Robot Simulator** → provides robot data

---

## ✨ Features

- 🔐 Authentication (Sign up, Sign in, Sign out)
- 👥 Role-based access (**Commander / Viewer**)
- 🤖 Robot control system
- 📊 Live robot status display
- 🗺️ Map visualisation
- 📡 Sensor data display
- 📈 LiDAR scan summary
- 🧾 Mission audit logs (with pagination)
- ⚙️ User role management
- 📱 Responsive UI

---

## 🧰 Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Axios
- React Router DOM
- Lucide Icons

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- node-fetch
- dotenv

---

## 🏗️ Architecture

```
Frontend (React) → Backend (Express API) → Robot Simulator API → MongoDB (Logs + Users)
```

---

## ⚙️ Core Functionalities

### 🔐 Authentication

- Email + password login
- JWT-based authentication
- Stored in localStorage

### 👤 Role Management

- **COMMANDER** → full control
- **VIEWER** → limited access

### 🤖 Robot Control

- Move robot
- Reset robot
- Fetch live status
- View map and sensors

### 🧾 Mission Logging

Every action logs:

- timestamp
- user
- action
- payload
- success/failure

---

## 🔌 Robot API Endpoints

```
GET    /api/status
POST   /api/move
POST   /api/reset
GET    /api/map
GET    /api/sensor
WS     /ws/telemetry
```

---

## 📁 Project Structure

### Frontend

```
src/
  components/
  hooks/
  pages/
  services/
  types/
  App.css
  App.tsx
  index.css
  main.tsx
```

### Backend

```
src/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
  app.js
  server.js
```

---

## ⚡ Getting Started

### 1. Clone repo

```bash
git clone https://github.com/Josyboy/CMP9134-Assessment1
cd CMP9134-Assessment1
```

---

### 2. Prerequisites

Make sure you have the following installed:

Docker Desktop
Git

---

### 3. Docker setup

This project runs using Docker Compose and includes:

frontend container
backend container
Virtual Robot Simulator container

The backend connects to:

MongoDB Atlas for database storage
Robot Simulator through Docker networking

---

### 4. Environment configuration

The required environment values are already defined in docker-compose.yml.

Backend environment includes:

```
MONGO_URI=mongodb+srv://nwarungwa21_db_user:A4SnJBjufRG6zUyW@cluster0.8xbjtgz.mongodb.net/
PORT=3500
JWT_SECRET=josiah_secret_key
ROBOT_API_BASE=http://localhost:5000
```

Frontend environment includes:

```
VITE_API_BASE_URL=http://localhost:3500
VITE_ROBOT_API_BASE_URL=http://localhost:5000
VITE_TELEMETRY_WS_URL=ws://localhost:5001
```

---

### 5. Run the application with Docker

Build and start all services:

docker compose up --build

To run in detached mode:

docker compose up --build -d

To stop the services:

docker compose down

---

### 6. Application URLs

Once the containers are running, the application will be available at:

Frontend: http://localhost:2500
Backend: http://localhost:3500
Robot API Docs: http://localhost:5001/docs

### 7. Notes on Docker networking

The backend connects to the robot simulator using the Docker service name:

http://robot-api:5000

The browser/frontend connects to the robot simulator WebSocket using the host-mapped port:

ws://localhost:5001/ws/telemetry

## 📡 API Routes

### Auth

- POST `/api/auth/signup`
- POST `/api/auth/signin`
- POST `/api/auth/signout`

### Robot

- GET `/api/robot/status`
- POST `/api/robot/move`
- POST `/api/robot/reset`
- GET `/api/robot/map`
- GET `/api/robot/sensor`

### Users

- GET `/api/users`
- PATCH `/api/users/:id/role`

### Logs

- GET `/api/audit?page=1&limit=10`

---

## 🖥️ Pages

- `/login`
- `/signup`
- `/dashboard`
- `/lidar_summary`
- `/audit_logs`
- `/users`

---

## 🎯 UI Design

* Clear and structured control-room interface
* Real-time status cards
* User role display indicator
* Styled striped data tables
* System notifications and loading indicators

---

## 👨‍💻 Author

**Josiah Nwarungwa**
Computer Science — University of Lincoln

---

## 📜 License

Academic use only.