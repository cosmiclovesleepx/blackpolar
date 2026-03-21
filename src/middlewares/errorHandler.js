/**
 * middlewares/errorHandler.js
 * Handler global de errores.
 * — Rutas /api/*  → responde JSON
 * — Resto        → renderiza la vista "error.ejs"
 */

import { config } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const isApiRequest = req.originalUrl.startsWith('/api');

  // Log estructurado (evita exponer stacks en producción)
  console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${statusCode}`, {
    message: err.message,
    ...(config.isDev && { stack: err.stack }),
  });

  if (isApiRequest) {
    return res.status(statusCode).json({
      status:  'error',
      message: err.message || 'Error interno del servidor',
      code:    statusCode,
      ...(config.isDev && { stack: err.stack }),
    });
  }

  // Vista HTML de error
  return res.status(statusCode).render('error', {
    statusCode,
    message:  err.message,
    stack:    config.isDev ? err.stack : null,
    appName:  config.appName,
  });
};
