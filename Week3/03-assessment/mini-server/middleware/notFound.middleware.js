// middleware/notFound.middleware.js
module.exports = (req, res, next) => {
  res.status(404).json({
    error: "NotFound",
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};
