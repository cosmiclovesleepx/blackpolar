/**
 * config/env.js
 * Carga dotenv y centraliza todas las variables de entorno.
 * Al importar este módulo primero, se garantiza que process.env
 * ya tiene los valores del .env antes de que cualquier otro módulo los lea.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Apunta explícitamente al .env en la raíz del proyecto (dos niveles arriba de src/config)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const required = (key) => {
  const val = process.env[key];
  if (!val) {
    console.error(`[CONFIG] ❌ Variable de entorno requerida no encontrada: ${key}`);
    process.exit(1);
  }
  return val;
};

const optional = (key, fallback) => process.env[key] ?? fallback;

export const config = {
  port:    Number(optional('PORT', 5000)),
  env:     optional('NODE_ENV', 'development'),
  appName: optional('APP_NAME', 'Black Polar'),

  isDev:  optional('NODE_ENV', 'development') === 'development',
  isProd: optional('NODE_ENV', 'development') === 'production',

  cors: {
    // En dev permite todo; en prod lee desde .env
    origins: optional('ALLOWED_ORIGINS', '')
      ? optional('ALLOWED_ORIGINS', '').split(',').map(o => o.trim())
      : '*',
  },

  rateLimit: {
    windowMs: Number(optional('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)), // 15 min
    max:      Number(optional('RATE_LIMIT_MAX', 100)),
  },
};
