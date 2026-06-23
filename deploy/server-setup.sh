#!/usr/bin/env bash
# deploy/server-setup.sh
# Corre esto UNA VEZ en la VPS, recién provisionada, para dejar todo listo
# antes de que GitHub Actions empiece a deployar automáticamente.
#
# Uso: bash server-setup.sh

set -e

echo "== 1. Node.js 20 LTS =="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "== 2. pnpm (versión fija, igual a la del repo) =="
corepack enable
corepack prepare pnpm@9.15.0 --activate

echo "== 3. PM2 =="
npm install -g pm2

echo "== 4. PostgreSQL =="
apt install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

echo "== 5. Base de datos y usuario =="
read -p "Contraseña para el usuario de PostgreSQL 'blackpolar': " -s DB_PASSWORD
echo ""
sudo -u postgres psql -c "CREATE USER blackpolar WITH PASSWORD '${DB_PASSWORD}';" || true
sudo -u postgres psql -c "CREATE DATABASE blackpolar OWNER blackpolar;" || true

echo "== 6. Nginx =="
apt install -y nginx
mkdir -p /etc/nginx/ssl

echo "== 7. Carpeta del proyecto y clonado =="
mkdir -p /var/www/blackpolar
cd /var/www/blackpolar
if [ ! -d ".git" ]; then
  git clone https://github.com/cosmiclovesleepx/blackpolar.git .
fi

echo "== 8. Clave SSH dedicada para GitHub Actions =="
mkdir -p /root/.ssh
if [ ! -f /root/.ssh/github-actions-deploy ]; then
  ssh-keygen -t ed25519 -C "github-actions-deploy" -f /root/.ssh/github-actions-deploy -N ""
  cat /root/.ssh/github-actions-deploy.pub >> /root/.ssh/authorized_keys
  chmod 600 /root/.ssh/authorized_keys
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  Setup base completo. Próximos pasos manuales:"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "1. Copia esta clave privada y pégala en GitHub como secret VPS_SSH_KEY:"
echo ""
cat /root/.ssh/github-actions-deploy
echo ""
echo "2. Edita /var/www/blackpolar/.env con tus valores reales:"
echo "   DATABASE_URL=\"postgresql://blackpolar:${DB_PASSWORD}@localhost:5432/blackpolar\""
echo "   BETTER_AUTH_SECRET=\$(openssl rand -base64 32)"
echo "   BETTER_AUTH_URL=\"https://api.blackpolar.org\""
echo "   NEXT_PUBLIC_API_URL=\"https://api.blackpolar.org\""
echo ""
echo "3. Coloca tu Cloudflare Origin Certificate en:"
echo "   /etc/nginx/ssl/cloudflare-origin.pem"
echo "   /etc/nginx/ssl/cloudflare-origin.key"
echo ""
echo "4. Copia deploy/nginx.conf a /etc/nginx/sites-available/blackpolar y actívalo:"
echo "   ln -s /etc/nginx/sites-available/blackpolar /etc/nginx/sites-enabled/"
echo "   nginx -t && systemctl reload nginx"
echo ""
echo "5. Build inicial manual (antes de automatizar):"
echo "   cd /var/www/blackpolar"
echo "   pnpm install --frozen-lockfile"
echo "   pnpm db:generate && pnpm db:push"
echo "   pnpm build"
echo "   pm2 start ecosystem.config.cjs"
echo "   pm2 save && pm2 startup"
echo ""
echo "6. Agrega los 3 secrets en GitHub (Settings -> Secrets -> Actions):"
echo "   VPS_HOST = $(curl -s ifconfig.me)"
echo "   VPS_USER = root"
echo "   VPS_SSH_KEY = (la clave privada de arriba)"
echo ""
