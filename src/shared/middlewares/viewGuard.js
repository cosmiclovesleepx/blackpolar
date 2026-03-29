/**
 * shared/middlewares/viewGuard.js
 * Renderiza vistas EJS dinámicas con protección contra path traversal.
 * Agrega el nombre de la vista a ALLOWED_VIEWS para habilitarla.
 */

import { env } from '../config/env.js';

const ALLOWED_VIEWS = new Set([
  'index',
  'about',
  'services',
  'portfolio',
  'contact',
  'error',
  'login',
  'registro'
]);

export const viewGuard = (req, res, next) => {
  const viewName = req.params.view;

  // Bloquear path traversal
  if (!viewName || viewName.includes('..') || viewName.includes('/') || viewName.includes('\\')) {
    const err = new Error('Nombre de vista inválido');
    err.status = 400;
    return next(err);
  }

  if (!ALLOWED_VIEWS.has(viewName)) {
    const err = new Error(`Página no encontrada: ${viewName}`);
    err.status = 404;
    return next(err);
  }

  res.render(viewName, { appName: env.appName }, (err, html) => {
    if (err) return next(err);
    res.send(html);
  });
};

/** Añade vistas a la lista blanca en tiempo de ejecución (útil para apps secundarias) */
export const allowView = (viewName) => ALLOWED_VIEWS.add(viewName);
