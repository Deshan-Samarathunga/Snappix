# Snappix

A modern, Reddit-style community platform with a React frontend and Spring Boot/PostgreSQL backend.

## 🚀 Tech Stack
- **Frontend**: React 19, Redux Toolkit, React-Bootstrap
- **Backend**: Spring Boot (Java 21), PostgreSQL, JWT, AWS S3

## 🛠️ Getting Started

**1. Database**
Ensure PostgreSQL is running locally on port `5432` with username `postgres` and password `admin`. Tables are auto-generated on startup.

**2. Backend**
```bash
cd server
./mvnw spring-boot:run
```
*(Or run `ServerApplication.java` directly via your IDE).*

**3. Frontend**
```bash
cd client
npm install
npm start
```
App runs at [http://localhost:3000](http://localhost:3000).
