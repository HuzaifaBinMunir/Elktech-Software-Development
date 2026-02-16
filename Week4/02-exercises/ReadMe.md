# Week 4 – Secure CRUD API (Authentication + Validation + Middleware)

## Overview

Week 4 builds on Week 3's basic CRUD API and transforms it into a **secure, authenticated REST API** using:

- JWT Authentication
- Password hashing (bcrypt)
- Joi Validation
- Authorization & Ownership checks
- Security middleware (Helmet, CORS, Rate Limiting)
- Proper error handling

This week focuses on making the API production-aware and security-focused.

---

# Architecture

```
secure-crud/
│
├── controllers/
│ ├── auth.controller.js
│ ├── users.controllers.js
│ └── tasks.controller.js
│
├── routes/
│ ├── auth.routes.js
│ ├── users.routes.js
│ └── tasks.routes.js
│
├── middleware/
│ ├── auth.middleware.js
│ ├── validate.middleware.js
│ ├── error.middleware.js
│ └── notFound.middleware.js
│
├── validation/
│ ├── auth.validation.js
│ └── task.validation.js
│
├── data/
│ ├── users.data.js
│ └── tasks.data.js
│
├── app.js
├── server.js
├── .env
└── package.json

```

## 1️⃣ Authentication

```
---

# Implemented Features



### Signup
- Requires: `name`, `email`, `password`
- Password is hashed using `bcrypt`
- Email uniqueness enforced

### Login
- Validates credentials
- Returns JWT token
- Token contains:
  ```json
  {
    "id": user.id,
    "email": user.email
  }

```
## 2️⃣ JWT Authorization
Protected routes require:
```
Authorization: Bearer <token>
```
Middleware:
```
auth.middleware.js
```
It:

1) Verifies JWT
2) Attaches decoded user to req.user
3) Blocks unauthorized access

## 3️⃣ Secure Task Ownership Rules
A user:

✔ Can view only their own tasks
✔ Can create tasks only for themselves
✔ Can update only their own tasks
✔ Can delete only their own tasks

Ownership enforced in controllers:
```
if (task.userId !== authUserId) {
  throw httpError(403, "Forbidden", "You are not allowed");
}
```
## 4️⃣ Validation (Joi)
All incoming data is validated using schemas:

### Auth Validation

- signupSchema
- loginSchema

### Task Validation

- createTaskSchema
- updateTaskSchema
Validation middleware:
```
validate.middleware.js
```
## 5️⃣ Security Middleware
Implemented in app.js:

- Helmet (security headers)
- CORS configuration
- Express rate limiting
- Morgan logging
- Centralized error handling
  
## Environment Configuration (.env)

```
PORT=3000
NODE_ENV=development

CORS_ORIGIN=http://localhost:3000

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60

JWT_SECRET=super-secret-change-this
JWT_EXPIRES_IN=1h
```

## API Flow
### Authentication Flow

```
POST /auth/signup
POST /auth/login
        ↓
Receive JWT
        ↓
Use JWT in Authorization header
        ↓
Access protected routes
```

### API Endpoints
#### Auth
| Method | Route | Description |
| :--- | :---: | ---: |
| POST | /auth/signup | Register new user |
| POST | /auth/login | Login and receive token |

#### Users (Protected)
| Method | Route | Description |
| :--- | :---: | ---: |
| GET | /users | Get all users (password hidden) |
| GET | /users/:id | Get own profile + tasks |

#### Tasks (Protected)
| Method | Route | Description |
| :--- | :---: | ---: |
| GET | /tasks | Get logged-in user's tasks |
| POST | /tasks/user/:userId | Create task (self only) |
| PUT | /tasks/:id | Update own task |
| DELETE | /tasks/:id | Delete own task |

## Security Improvements Over Week 3

| Week 3 | Week 4 |
| :--- | ---: | 
| No authentication | JWT Authentication | 
| No password hashing | bcrypt hashing |
| No ownership checks | Strict authorization |
| Basic validation | Joi schema validation |
| Public routes | Protected routes | 
| No security headers | Helmet + Rate limiting |

## Middleware Concept (Assessment Reflection)

Middleware acts as a processing layer between the request and controller logic.

In this project, middleware handles:

- Authentication
- Validation
- Security policies
- Logging
- Error handling

This keeps controllers clean and focused on business logic.

## What Was Achieved

✔ Full JWT authentication system
✔ Secure password storage
✔ Ownership-based authorization
✔ Joi request validation
✔ Centralized error handling
✔ Security middleware
✔ Production-style API structure

## Known Limitations

- Uses in-memory arrays instead of database
- No refresh tokens
- No role-based access control
- No frontend client

## Future Improvements

- Replace in-memory storage with MongoDB
- Implement refresh token strategy
- Add role-based authorization
- Add frontend client
- Add automated testing (Jest / Supertest)

## How To Run

```
npm install
npm run dev
```
Server runs at:

```
http://localhost:3000
```
