export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
