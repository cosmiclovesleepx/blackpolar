/**
 * src/apps/portfolios/server.js
 */

import { env, validateEnv } from '../../shared/config/env.js';
import { logger }           from '../../shared/utils/logger.js';
import app                  from './app.js';

const startServer = async () => {
  try {
    validateEnv();

    const server = app.listen(env.PORTFOLIOS_PORT, () => {
      logger.success(`PORTFOLIOS → http://localhost:${env.PORTFOLIOS_PORT}  [${env.NODE_ENV}]`);
    });

    const shutdown = (signal) => {
      logger.warn(`${signal} recibido — cerrando servidor...`);
      server.close(() => { logger.info('Servidor cerrado.'); process.exit(0); });
      setTimeout(() => process.exit(1), 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));
    process.on('unhandledRejection', (r) => logger.error('Unhandled Rejection:', r));
    process.on('uncaughtException',  (e) => { logger.error('Uncaught Exception:', e.message); process.exit(1); });

  } catch (err) {
    logger.error('Error al iniciar servidor:', err.message);
    process.exit(1);
  }
};

startServer();
