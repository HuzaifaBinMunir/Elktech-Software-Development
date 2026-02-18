const express = require("express");
const morgan = require("morgan");

const usersRoutes = require("./routes/users.routes");
const tasksRoutes = require("./routes/tasks.routes");

const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/users", usersRoutes);
app.use("/tasks", tasksRoutes);

// If no route matched, return JSON 404
app.use(notFound);

// If any route/controller throws or calls next(err), return JSON 500/4xx
app.use(errorHandler);

module.exports = app;
