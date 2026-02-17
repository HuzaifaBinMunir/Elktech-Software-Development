const { tasks } = require("../data/tasks.data");
const { users } = require("../data/users.data");

/**
 * Helper: create an Error object with HTTP status code
 */
function httpError(statusCode, name, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.name = name;
  return err;
}

/**
 * GET /tasks
 * Protected: returns tasks ONLY for logged-in user
 */
exports.getAllTasks = (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!Number.isFinite(userId)) {
      throw httpError(401, "Unauthorized", "Invalid token user");
    }

    const userTasks = tasks.filter((t) => t.userId === userId);
    res.status(200).json({ count: userTasks.length, tasks: userTasks });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /tasks/user/:userId
 * Protected: create a task for a user
 * Secure rule: logged-in user can ONLY create tasks for themselves
 */
exports.createTaskForUser = (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const authUserId = req.user?.id;
    const { title, completed } = req.body || {};

    if (!Number.isFinite(authUserId)) {
      throw httpError(401, "Unauthorized", "Invalid token user");
    }

    if (!Number.isFinite(userId)) {
      throw httpError(400, "ValidationError", "userId must be a valid number");
    }

    // Prevent creating tasks for other users
    if (userId !== authUserId) {
      throw httpError(403, "Forbidden", "You can only create tasks for your own user");
    }

    const userExists = users.some((u) => u.id === userId);
    if (!userExists) {
      throw httpError(404, "NotFound", `User with id=${userId} not found`);
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      throw httpError(400, "ValidationError", "title is required and must be a non-empty string");
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      throw httpError(400, "ValidationError", "completed must be boolean");
    }

    const newTask = {
      id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
      title: title.trim(),
      completed: completed ?? false,
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

/**
 * PUT /tasks/:id
 * Protected: update ONLY if task belongs to logged-in user
 */
exports.updateTaskById = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const authUserId = req.user?.id;

    if (!Number.isFinite(authUserId)) {
      throw httpError(401, "Unauthorized", "Invalid token user");
    }

    // validate BEFORE find (reviewer fix)
    if (!Number.isFinite(id)) {
      throw httpError(400, "ValidationError", "Task id must be a valid number");
    }

    const task = tasks.find((t) => t.id === id);
    if (!task) {
      throw httpError(404, "NotFound", `Task with id=${id} not found`);
    }

    // ownership check
    if (task.userId !== authUserId) {
      throw httpError(403, "Forbidden", "You are not allowed to update this task");
    }

    const { title, completed } = req.body || {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        throw httpError(400, "ValidationError", "title must be a non-empty string");
      }
      task.title = title.trim();
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        throw httpError(400, "ValidationError", "completed must be boolean");
      }
      task.completed = completed;
    }

    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /tasks/:id
 * Protected: delete ONLY if task belongs to logged-in user
 */
exports.deleteTaskById = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const authUserId = req.user?.id;

    if (!Number.isFinite(authUserId)) {
      throw httpError(401, "Unauthorized", "Invalid token user");
    }

    // validate BEFORE findIndex
    if (!Number.isFinite(id)) {
      throw httpError(400, "ValidationError", "Task id must be a valid number");
    }

    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw httpError(404, "NotFound", `Task with id=${id} not found`);
    }

    // ownership check
    if (tasks[index].userId !== authUserId) {
      throw httpError(403, "Forbidden", "You are not allowed to delete this task");
    }

    const deleted = tasks.splice(index, 1)[0];

    res.status(200).json({ message: "Task deleted", deleted });
  } catch (err) {
    next(err);
  }
};
