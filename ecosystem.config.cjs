/**
 * PM2 Ecosystem Configuration (CommonJS)
 *
 * Uso:
 *   pm2 start ecosystem.config.cjs          # Iniciar todos los servers
 *   pm2 logs
 *   pm2 monit
 *   pm2 status
 *   pm2 restart all
 *   pm2 delete all
 *   pm2 start ecosystem.config.cjs --only main-app
 */

module.exports = {
  apps: [
    {
      name: 'main-app',
      script: 'src/apps/main/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      cwd: '/var/www/blackpolar',
      env: {
            NODE_ENV: 'production',
            MAIN_PORT: 3000,
      },
      error_file: './logs/main-error.log',
      out_file: './logs/main-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '500M',
      kill_timeout: 5000,
      autorestart: true,
      watch: false,
    },
    {
      name: 'portfolios-app',
      script: 'src/apps/portfolios/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      cwd: '/var/www/blackpolar',
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
      watch: false,
    },
    {
      name: 'tlm-app',
      script: 'src/apps/tlm/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      cwd: '/var/www/blackpolar',
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
      watch: false,
    },
  ],

  

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'blackpolar.org',
      ref: 'origin/main',
      repo: 'git@github.com:cosmiclovesleepx/blackpolar.git',
      path: '/var/www/blackpolar',
      'post-deploy':
        'npm ci --omit=dev && mkdir -p logs && pm2 reload ecosystem.config.cjs --env production',
      'post-setup':
        'npm ci --omit=dev && mkdir -p logs',
    },
  },
};