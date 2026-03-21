#!/bin/bash

# Setup Script - Configuración inicial del servidor
# Ejecutar una sola vez al inicio del servidor
# Uso: ./setup-server.sh

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ========== Node.js y npm ==========
log_info "Instalando Node.js y npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - || true
sudo apt-get install -y nodejs

log_info "✅ Node.js instalado: $(node --version)"
log_info "✅ npm instalado: $(npm --version)"

# ========== PM2 Global ==========
log_info "Instalando PM2..."
sudo npm install -g pm2
pm2 update || true

log_info "✅ PM2 instalado: $(pm2 --version)"

# ========== MongoDB ==========
log_warn "Instalando MongoDB..."
# Para Ubuntu 20.04+
sudo apt-get install -y mongodb

# O utilizar Docker (alternativa)
# docker run -d -p 27017:27017 --name mongodb mongo

log_info "✅ MongoDB instalado"

# ========== Nginx ==========
log_info "Instalando Nginx..."
sudo apt-get install -y nginx

log_info "✅ Nginx instalado"

# ========== Certbot (Let's Encrypt) ==========
log_info "Instalando Certbot para SSL..."
sudo apt-get install -y certbot python3-certbot-nginx

log_info "✅ Certbot instalado"

# ========== Directorio de aplicación ==========
log_info "Creando directorio de aplicación..."
sudo mkdir -p /var/www/black-polar
sudo chown -R $USER:$USER /var/www/black-polar

log_info "✅ Directorio creado: /var/www/black-polar"

# ========== Firewall ==========
log_info "Configurando Firewall (UFW)..."
sudo apt-get install -y ufw || true
sudo ufw allow 22/tcp || true  # SSH
sudo ufw allow 80/tcp || true  # HTTP
sudo ufw allow 443/tcp || true # HTTPS
sudo ufw --force enable || true

log_info "✅ Firewall configurado"

# ========== SSH Key Setup ==========
log_info "¿Generar SSH key para GitHub? (s/n)"
read -r response
if [[ "$response" =~ ^[Ss]$ ]]; then
    ssh-keygen -t ed25519 -C "$(whoami)@$(hostname)"
    log_warn "Agrega esta clave a GitHub:"
    cat ~/.ssh/id_ed25519.pub
fi

# ========== Resumen ==========
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Setup completado!${NC}"
echo "=========================================="
echo ""
echo "Siguientes pasos:"
echo "1. Agregar SSH key a GitHub (si la generaste)"
echo "2. Clonar el repositorio en /var/www/black-polar"
echo "3. Crear archivo .env con las variables"
echo "4. Ejecutar: npm install"
echo "5. Ejecutar: pm2 start ecosystem.config.js"
echo "6. Configurar Nginx con nginx.prod.conf"
echo "7. Obtener certificado SSL: certbot certonly --nginx -d tu.dominio.com"
echo ""
echo "MongoDB: sudo systemctl start mongod"
echo "Nginx:   sudo systemctl start nginx"
echo "Status:  pm2 status"
echo ""
