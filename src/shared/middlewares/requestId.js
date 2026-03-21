/**
 * shared/middlewares/requestId.js
 * Añade un ID único a cada petición para trazabilidad en logs.
 * Accesible como req.id y en el header X-Request-Id de la respuesta.
 */

import { randomUUID } from 'crypto';

export const requestId = (req, res, next) => {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};
