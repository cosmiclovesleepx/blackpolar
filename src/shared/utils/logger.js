/**
 * shared/utils/logger.js
 * Logger estructurado con niveles y colores en consola.
 */

import { env } from '../config/env.js';

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = LEVELS[env.logLevel] ?? LEVELS.debug;

const ts = () => new Date().toISOString();

export const logger = {
  debug: (msg, data = '') => {
    if (currentLevel > LEVELS.debug) return;
    console.log(`🐛  [${ts()}] [DEBUG] ${msg}`, data);
  },
  info: (msg, data = '') => {
    if (currentLevel > LEVELS.info) return;
    console.log(`ℹ️  [${ts()}] [INFO]  ${msg}`, data);
  },
  success: (msg, data = '') => {
    if (currentLevel > LEVELS.info) return;
    console.log(`✅  [${ts()}] [OK]    ${msg}`, data);
  },
  warn: (msg, data = '') => {
    if (currentLevel > LEVELS.warn) return;
    console.warn(`⚠️  [${ts()}] [WARN]  ${msg}`, data);
  },
  error: (msg, data = '') => {
    console.error(`❌  [${ts()}] [ERROR] ${msg}`, data);
  },
  http: (msg) => {
    if (currentLevel > LEVELS.debug) return;
    console.log(`🌐  [${ts()}] [HTTP]  ${msg}`);
  },
};
