/**
 * shared/middlewares/cors.js
 * CORS centralizado — acepta opciones por parámetro.
 */

import cors from 'cors';
import { env } from '../config/env.js';

export const setupCORS = (app, options = {}) => {
  const defaultOrigins = env.cors.origins;

  app.use(cors({
    origin:         options.origin         ?? defaultOrigins,
    methods:        options.methods        ?? ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: options.allowedHeaders ?? ['Content-Type','Authorization'],
    credentials:    options.credentials    ?? true,
    maxAge: 86400,
  }));
};
