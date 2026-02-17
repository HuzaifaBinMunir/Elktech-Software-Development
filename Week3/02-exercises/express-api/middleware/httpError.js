function httpError(statusCode, name, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.name = name;
  return err;
}

module.exports = httpError;
