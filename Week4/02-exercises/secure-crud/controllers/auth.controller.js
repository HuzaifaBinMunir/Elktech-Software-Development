const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { users } = require("../data/users.data");

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = users.find((u) => u.email === email);
    if (exists) {
      return res.status(409).json({ error: "Conflict", message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: sanitizeUser(newUser),
      // user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login };
