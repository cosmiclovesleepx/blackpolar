/**
 * shared/config/env.js
 * Carga dotenv y centraliza TODAS las variables de entorno.
 */

import dotenv from 'dotenv';
import path   from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const str  = (key, fb = '')    => process.env[key] ?? fb;
const num  = (key, fb = 0)     => Number(process.env[key] ?? fb);
const list = (key, fb = [])    => process.env[key] ? process.env[key].split(',').map(s => s.trim()) : fb;

export const env = {
  NODE_ENV: str('NODE_ENV', 'development'),
  env:      str('NODE_ENV', 'development'),

  isDev:  str('NODE_ENV', 'development') !== 'production',
  isProd: str('NODE_ENV', 'development') === 'production',
  isTest: str('NODE_ENV', 'development') === 'test',

  isDevelopment: str('NODE_ENV', 'development') !== 'production',
  isProduction:  str('NODE_ENV', 'development') === 'production',
  isTesting:     str('NODE_ENV', 'development') === 'test',

  appName: str('APP_NAME', 'Black Polar'),

  MAIN_PORT:       num('MAIN_PORT',       3000),
  PORTFOLIOS_PORT: num('PORTFOLIOS_PORT', 4000),
  TLM_PORT:        num('TLM_PORT',        5000),

  MONGODB_URI: str('MONGODB_URI', ''),
  JWT_SECRET:  str('JWT_SECRET',  'dev-secret-CHANGE-IN-PROD'),
  JWT_EXPIRE:  str('JWT_EXPIRE',  '7d'),

  cors: {
    origins: process.env.CORS_ORIGIN ? list('CORS_ORIGIN') : '*',
  },

  rateLimit: {
    windowMs: num('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    max:      num('RATE_LIMIT_MAX',       100),
  },

  logLevel: str('LOG_LEVEL', 'debug'),
};

export const validateEnv = () => {
  if (!env.isProd) return;
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing  = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`[ENV] Faltan variables requeridas: ${missing.join(', ')}`);
  }
  if (env.JWT_SECRET === 'dev-secret-CHANGE-IN-PROD') {
    throw new Error('[ENV] JWT_SECRET no puede ser el valor por defecto en producción.');
  }
};
