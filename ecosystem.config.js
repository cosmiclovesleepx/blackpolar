/**
 * PM2 Ecosystem Configuration
 * 
 * Uso:
 *   pm2 start ecosystem.config.js          # Iniciar todos los servers
 *   pm2 logs                                # Ver logs en vivo
 *   pm2 monit                               # Ver monitor
 *   pm2 status                              # Ver status
 *   pm2 restart all                         # Reiniciar todos
 *   pm2 delete all                          # Parar todos
 *   pm2 start ecosystem.config.js --only main-app  # Iniciar solo uno
 */

module.exports = {
  apps: [
    // ==========================================
    // MAIN APP (Puerto 3000)
    // ==========================================
    {
      // Identificador único
      name: 'main-app',

      // Script a ejecutar
      script: 'src/apps/main/server.js',

      // Número de instancias (cluster mode)
      // "max" = número de CPUs disponibles
      instances: 2,

      // Modo de ejecución: 'cluster' o 'fork'
      exec_mode: 'cluster',

      // Variables de entorno
      env: {
        NODE_ENV: 'production',
        MAIN_PORT: 3000,
      },

      // Archivos de log
      error_file: './logs/main-error.log',
      out_file: './logs/main-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Reiniciar si la memoria excede este limit
      max_memory_restart: '500M',

      // Señal de graceful shutdown
      kill_timeout: 5000,

      // Otros
      autorestart: true,
      watch: false, // Set to true para reinicar al cambiar archivos
    },

    // ==========================================
    // PORTFOLIOS APP (Puerto 4000)
    // ==========================================
    {
      name: 'portfolios-app',
      script: 'src/apps/portfolios/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORTFOLIOS_PORT: 4000,
      },
      error_file: './logs/portfolios-error.log',
      out_file: './logs/portfolios-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '500M',
      kill_timeout: 5000,
      autorestart: true,
    },

    // ==========================================
    // TLM APP (Puerto 5000)
    // ==========================================
    {
      name: 'tlm-app',
      script: 'src/apps/tlm/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        TLM_PORT: 5000,
      },
      error_file: './logs/tlm-error.log',
      out_file: './logs/tlm-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '500M',
      kill_timeout: 5000,
      autorestart: true,
    },
  ],

  // Configuración global
  deploy: {
    production: {
      // Usuario@host
      user: 'ubuntu',
      host: 'midominio.com',

      // Directorio de destino en el servidor
      path: '/var/www/black-polar',

      // Rama de git
      ref: 'origin/main',

      // Comandos a ejecutar en deploy
      'post-deploy':
        'npm ci --only=production && pm2 restart ecosystem.config.js',

      // Ejecutar ssh en los servidores
      'post-setup': 'npm ci --only=production',
    },
  },
};
