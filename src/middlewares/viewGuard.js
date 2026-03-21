/**
 * middlewares/viewGuard.js
 * Renderiza vistas EJS dinámicamente desde /:view
 * con protección contra path traversal.
 */

import path from 'path';

// Lista blanca de vistas permitidas (agrega aquí cada vista válida)
const ALLOWED_VIEWS = new Set([
  'index',
  'about',
  'services',
  'portfolio',
  'contact',
  'error',
]);

export const viewGuard = (req, res, next) => {
  const viewName = req.params.view;

  // Bloquear path traversal: "../admin", "../../etc/passwd", etc.
  if (viewName.includes('..') || viewName.includes('/') || viewName.includes('\\')) {
    const err = new Error('Nombre de vista inválido');
    err.status = 400;
    return next(err);
  }

  // Si no está en la lista blanca → 404
  if (!ALLOWED_VIEWS.has(viewName)) {
    const err = new Error(`Vista no encontrada: ${viewName}`);
    err.status = 404;
    return next(err);
  }

  res.render(viewName, { appName: 'Black Polar' }, (err, html) => {
    if (err) return next(err);
    res.send(html);
  });
};
