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
