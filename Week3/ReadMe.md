# 📦 Week 3 – Express API & Mini Server (CRUD Application)

## 📌 Overview

This repository contains the **Week 3 work** for the ElkTech Software Development program.  
The goal was to build a **RESTful API using Express.js**, implement full **CRUD operations**, apply **middleware**, and finally create a **mini server assessment** using the same architecture.

The work is divided into **Exercises** and an **Assessment (Mini Server)**.

```
Week3/
├── 02-exercises/express-api
└── 03-assessment/mini-server
```
Both follow the same clean, scalable backend structure.

---

## 🧠 Concepts Covered

- Express.js fundamentals
- REST API design
- CRUD operations
- Route → Controller → Data flow
- Middleware usage
- Centralized error handling
- Input validation
- HTTP status codes
- Postman API testing
- Mini server implementation

---

## 📁 Project Structure

### 🔹 Express API (Exercises)

```text
express-api/
├── app.js
├── server.js
├── routes/
│   ├── users.routes.js
│   └── tasks.routes.js
├── controllers/
│   ├── users.controllers.js
│   └── tasks.controller.js
├── middleware/
│   ├── notFound.middleware.js
│   └── error.middleware.js
├── data/
│   ├── users.data.js
│   └── tasks.data.js
├── package.json
└── package-lock.json
```

### 🔹 Mini Server (Assessment)

```
mini-server/
├── app.js
├── server.js
├── routes/
├── controllers/
├── middleware/
├── data/
├── package.json
└── package-lock.json
```

✅ The mini server reuses the **same architecture**, confirming understanding and reusability.

---

## 🔁 Request Flow

Every API request follows this flow:

```
Client (Postman)
↓
Route (routes/*.js)
↓
Middleware (validation / notFound)
↓
Controller (business logic)
↓
Data layer (in-memory arrays)
↓
Response (JSON)
↓
Error middleware (if an error occurs)
```

This mirrors **real-world Express backend design**.

---

## 🧩 Middleware

### 1️⃣ Not Found Middleware

Handles invalid routes.

```js
module.exports = (req, res) => {
  res.status(404).json({
    error: "NotFound",
    message: "Route not found"
  });
};
```
###2️⃣ Error Middleware

Centralized error handling.
```
module.exports = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.name || "ServerError",
    message: err.message || "Internal server error"
  });
};
```
✔ Keeps controllers clean
✔ Ensures consistent error responses

## 📌 API Endpoints
<img width="871" height="317" alt="image" src="https://github.com/user-attachments/assets/0c0844d8-2ff0-45cb-8f90-ddc6e2f8db08" />

<img width="904" height="383" alt="image" src="https://github.com/user-attachments/assets/1b770567-0cec-4305-8d57-f40e88e206be" />

## Validation Rules
- User name and email must be non-empty strings

- Email must be unique

- Task title must be a non-empty string

- done must be a boolean

- Invalid IDs return 404 Not Found

## Testing

- All endpoints were tested using Postman:

- Creating users and tasks

- Fetching users with related tasks

- Updating task completion status

- Deleting tasks

- Validating error responses

## Running the Project
1) Install dependencies
` npm install
`
2) Start the server
`
node server.js
`
3) Server runs on:
`
http://localhost:3000
`
## ⚠️ Notes

- Data is stored in-memory

- Restarting the server resets data

- node_modules is excluded via .gitignore

## 👤 Author

Huzaifa Bin Munir
Week 3 – Software Development

`

---

### ✅ What to do next (very important)

1. Save this as `README.md`
2. Run:
   ```bash
   git add README.md
   git commit -m "Add Week 3 Express API and mini server README"
   git push
```


