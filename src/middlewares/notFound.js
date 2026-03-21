/**
 * middlewares/notFound.js
 * Captura rutas no registradas y pasa un error 404 al handler global.
 */

export const notFound = (req, res, next) => {
  const err = new Error(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
};
