/**
 * src/apps/main/server.js
 * Entry point — carga env, conecta DB y arranca el servidor HTTP.
 */

import { env, validateEnv } from '../../shared/config/env.js';
import { connectDB }        from '../../shared/config/db.js';
import { logger }           from '../../shared/utils/logger.js';
import app                  from './app.js';

const startServer = async () => {
  try {
    validateEnv();

    // DB es opcional en dev si MONGODB_URI no está definida
    if (env.MONGODB_URI) {
      await connectDB();
    } else {
      logger.warn('MONGODB_URI no definida — arrancando sin base de datos.');
    }

    const server = app.listen(env.MAIN_PORT, () => {
      logger.success(`MAIN → http://localhost:${env.MAIN_PORT}  [${env.NODE_ENV}]`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.warn(`${signal} recibido — cerrando servidor...`);
      server.close(() => {
        logger.info('Servidor HTTP cerrado.');
        process.exit(0);
      });
      setTimeout(() => { logger.error('Forzando cierre.'); process.exit(1); }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection:', reason));
    process.on('uncaughtException',  (err)    => { logger.error('Uncaught Exception:', err.message); process.exit(1); });

  } catch (err) {
    logger.error('Error al iniciar servidor:', err.message);
    process.exit(1);
  }
};

startServer();
