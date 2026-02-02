// middleware/error.middleware.js
module.exports = (err, req, res, next) => {
  // Log full error on server (good for debugging)
  console.error("Unhandled error:", err);

  // If headers already sent, let Express handle
  if (res.headersSent) return next(err);

  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    error: err.name || "InternalServerError",
    message: err.message || "Something went wrong"
  });
};
