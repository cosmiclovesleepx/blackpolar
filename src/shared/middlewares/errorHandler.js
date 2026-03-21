/**
 * shared/middlewares/errorHandler.js
 * Handler global de errores.
 * — /api/*  → JSON
 * — Vistas  → error.ejs (fallback JSON si la vista no existe)
 */

import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message    = err.message    || 'Error interno del servidor';
  const isApi      = req.originalUrl.startsWith('/api');

  console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${statusCode} — ${message}`);
  if (env.isDev && err.stack) console.error(err.stack);

  if (isApi) {
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
        ...(env.isDev && { stack: err.stack }),
      },
    });
  }

  res.status(statusCode).render('error', {
    statusCode,
    message,
    appName: env.appName,
    stack:   env.isDev ? err.stack : null,
  }, (renderErr, html) => {
    if (renderErr) {
      return res.status(statusCode).json({ success: false, error: { message, statusCode } });
    }
    res.send(html);
  });
};

/** Clase base para errores de aplicación */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/** Wrapper para async route handlers — elimina try/catch repetitivo */
export const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
