const { users } = require("../data/users.data");
const { tasks } = require("../data/tasks.data");
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


exports.getAllUsers = (req, res, next) => {
  try {
    res.status(200).json({ count: users.length, users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      throw httpError(400, "ValidationError", "User id must be a valid number");
    }

    const user = users.find(u => u.id === id);
    if (!user) {
      throw httpError(404, "NotFound", `User with id=${id} not found`);
    }

    const userTasks = tasks.filter(t => t.userId === id);

    res.status(200).json({
      ...user,
      tasks: userTasks
    });
  } catch (err) {
    next(err);
  }
};

exports.createUser = (req, res, next) => {
  try {
    const { name, email } = req.body || {};

    if (!name || typeof name !== "string" || !name.trim()) {
      throw httpError(400, "ValidationError", "name is required and must be a non-empty string");
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      throw httpError(400, "ValidationError", "email is required and must be a non-empty string");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = users.some(u => (u.email || "").toLowerCase() === normalizedEmail);

    if (exists) {
      throw httpError(400, "ValidationError", "email must be unique");
    }

    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: name.trim(),
      email: normalizedEmail
    };

    users.push(newUser);

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    next(err);
  }
};
