/**
 * server.js
 * Punto de entrada. Carga .env, importa la app y arranca el servidor.
 * Separado de app.js para facilitar testing (importar app sin hacer listen).
 */

// dotenv se carga dentro de config/env.js apuntando al .env del root
import { config } from './config/env.js';
import app from './app.js';

const server = app.listen(config.port, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║          BLACK POLAR — Server            ║
  ╠══════════════════════════════════════════╣
  ║  URL  : http://localhost:${config.port}           ║
  ║  Env  : ${config.env.padEnd(32)}║
  ║  Vistas: /src/views/*.ejs                ║
  ║  CSS  : /public/css/index.css            ║
  ║  JS   : /public/js/index.js             ║
  ╚══════════════════════════════════════════╝
  `);
});

// ── Graceful Shutdown ────────────────────────────────────────────
// Permite que las conexiones activas terminen antes de cerrar el proceso
const gracefulShutdown = (signal) => {
  console.log(`\n[SERVER] Señal ${signal} recibida. Cerrando servidor...`);
  server.close(() => {
    console.log('[SERVER] Servidor cerrado correctamente.');
    process.exit(0);
  });

  // Fuerza el cierre si tarda más de 10 segundos
  setTimeout(() => {
    console.error('[SERVER] Forzando cierre por timeout.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

// Captura errores no manejados para evitar caídas silenciosas
process.on('unhandledRejection', (reason) => {
  console.error('[SERVER] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[SERVER] Uncaught Exception:', err);
  process.exit(1);
});
