const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization; // "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized", message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ensure id is a number (prevents subtle bugs)
    if (decoded?.id !== undefined) decoded.id = Number(decoded.id);

    req.user = decoded; // { id, email, ... }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid/expired token" });
  }
};
