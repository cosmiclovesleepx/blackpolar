/**
 * shared/middlewares/notFound.js
 * Genera error 404 y lo pasa al errorHandler (no responde directo).
 */

export const notFound = (req, res, next) => {
  const err    = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  err.status   = 404;
  err.statusCode = 404;
  next(err);
};
