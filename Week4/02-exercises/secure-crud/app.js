const express = require("express");
const helmet = require("helmet"); //  security headers
const morgan = require("morgan"); // request logging 
const cors = require("cors"); // Cross-Origin Resource Sharing (CORS) - control who can access your API
const rateLimit = require("express-rate-limit");



const usersRoutes = require("./routes/users.routes");
const tasksRoutes = require("./routes/tasks.routes");
const authRoutes = require("./routes/auth.routes");

const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.set("trust proxy", 1);


app.use(express.json());
app.use(morgan("dev"));
// Security headers
app.use(helmet());

// CORS (allow only your defined origin)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

// Basic rate limit (anti-spam / brute force)
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  max: Number(process.env.RATE_LIMIT_MAX) || 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);



app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/tasks", tasksRoutes);

// If no route matched, return JSON 404
app.use(notFound);

// If any route/controller throws or calls next(err), return JSON 500/4xx
app.use(errorHandler);

module.exports = app;
