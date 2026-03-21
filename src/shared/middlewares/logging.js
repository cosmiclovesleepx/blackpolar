/**
 * shared/middlewares/logging.js
 * Morgan HTTP logger con formato según entorno.
 */

import morgan from 'morgan';
import { env } from '../config/env.js';

export const setupLogging = (app) => {
  const format = env.isProd ? 'combined' : 'dev';
  app.use(morgan(format));
};
