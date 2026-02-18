const { tasks } = require("../data/tasks.data");
const { users } = require("../data/users.data");
const httpError = require("../middleware/httpError");

/**
 * Helper: create an Error object with HTTP status code
 
function httpError(statusCode, name, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.name = name;
  return err;
}
*/

exports.getAllTasks = (req, res, next) => {
  try {
    res.status(200).json({ count: tasks.length, tasks });
  } catch (err) {
    next(err);
  }
};

exports.createTaskForUser = (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const { title } = req.body || {};

    // Validate first
    if (!Number.isFinite(userId)) {
      throw httpError(400, "ValidationError", "userId must be a valid number");
    }

    const userExists = users.some((u) => u.id === userId);
    if (!userExists) {
      throw httpError(404, "NotFound", `User with id=${userId} not found`);
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      throw httpError(
        400,
        "ValidationError",
        "title is required and must be a non-empty string"
      );
    }

    const newTask = {
      id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
      title: title.trim(),
      done: false,
      userId,
    };

    tasks.push(newTask);

    res.status(201).json({
      message: "Task created",
      task: newTask,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTaskById = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    // FIX: Validate ID before searching
    if (!Number.isFinite(id)) {
      throw httpError(400, "ValidationError", "Task id must be a valid number");
    }

    const task = tasks.find((t) => t.id === id);

    if (!task) {
      throw httpError(404, "NotFound", `Task ${id} not found`);
    }

    const { title, done } = req.body || {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        throw httpError(400, "ValidationError", "title must be a non-empty string");
      }
      task.title = title.trim();
    }

    if (done !== undefined) {
      if (typeof done !== "boolean") {
        throw httpError(400, "ValidationError", "done must be boolean");
      }
      task.done = done;
    }

    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    next(err);
  }
};

exports.deleteTaskById = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    // Validate ID before searching
    if (!Number.isFinite(id)) {
      throw httpError(400, "ValidationError", "Task id must be a valid number");
    }

    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      throw httpError(404, "NotFound", `Task ${id} not found`);
    }

    const deleted = tasks.splice(index, 1)[0];

    res.status(200).json({ message: "Task deleted", deleted });
  } catch (err) {
    next(err);
  }
};
