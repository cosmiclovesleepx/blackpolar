#!/bin/bash

# Deploy Script para Black Polar
# Uso: ./deploy.sh [main|portfolios|tlm|all]
# Nota: Requiere PM2 instalado globalmente

set -e

# ========== Variables ==========
APP_NAME="black-polar"
REPO_URL="https://github.com/tu-usuario/tu-repo.git"
DEPLOY_DIR="/var/www/black-polar"
BRANCH="main"

# ========== Colors ==========
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ========== Functions ==========

log_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_requirements() {
    log_info "Verificando requisitos..."

    if ! command -v node &> /dev/null; then
        log_error "Node.js no está instalado"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        log_error "npm no está instalado"
        exit 1
    fi

    if ! command -v pm2 &> /dev/null; then
        log_warn "PM2 no está instalado globalmente. Instalando..."
        sudo npm install -g pm2
    fi

    log_info "✅ Requisitos verificados"
}

clone_or_pull() {
    log_info "Clonando/Actualizando repositorio..."

    if [ -d "$DEPLOY_DIR" ]; then
        cd "$DEPLOY_DIR"
        git fetch origin
        git checkout $BRANCH
        git pull origin $BRANCH
        log_info "✅ Repositorio actualizado"
    else
        sudo mkdir -p "$DEPLOY_DIR"
        sudo git clone -b $BRANCH $REPO_URL $DEPLOY_DIR
        log_info "✅ Repositorio clonado"
    fi
}

install_dependencies() {
    log_info "Instalando dependencias..."

    cd "$DEPLOY_DIR"
    npm ci --only=production

    log_info "✅ Dependencias instaladas"
}

setup_environment() {
    log_info "Configurando variables de entorno..."

    if [ ! -f "$DEPLOY_DIR/.env" ]; then
        log_warn ".env no existe. Copiando de .env.example"
        cp "$DEPLOY_DIR/.env.example" "$DEPLOY_DIR/.env"
        log_warn "⚠️  IMPORTANTE: Edita $DEPLOY_DIR/.env con los valores reales"
        exit 1
    fi

    log_info "✅ Variables de entorno configuradas"
}

setup_logs() {
    log_info "Creando directorio de logs..."

    mkdir -p "$DEPLOY_DIR/logs"
    sudo chown -R $USER:$USER "$DEPLOY_DIR/logs"

    log_info "✅ Directorio de logs creado"
}

setup_pm2() {
    log_info "Configurando PM2..."

    cd "$DEPLOY_DIR"

    # Parar aplicaciones existentes
    pm2 delete all || true

    # Iniciar con ecosystem.config.js
    pm2 start ecosystem.config.js

    # Guardar lista de procesos para restarts
    pm2 save

    # Opcional: Configurar para iniciar al bootear
    # sudo pm2 startup systemd -u $USER --hp /home/$USER
    # pm2 save

    log_info "✅ PM2 configurado y aplicaciones iniciadas"

    # Mostrar status
    pm2 status
}

verify_deployment() {
    log_info "Verificando deployment..."

    sleep 2

    # Verificar health endpoints
    for port in 3000 4000 5000; do
        if curl -sf http://localhost:$port/health > /dev/null; then
            log_info "✅ Health check pasó en puerto $port"
        else
            log_error "Health check falló en puerto $port"
            exit 1
        fi
    done

    log_info "✅ Deployment verificado exitosamente"
}

deploy_app() {
    local app=$1

    log_info "Iniciando deployment de $app..."

    check_requirements
    clone_or_pull
    install_dependencies
    setup_environment
    setup_logs
    setup_pm2
    verify_deployment

    log_info "✅ Deployment completado para $app"
}

# ========== Main ==========

if [ $# -eq 0 ]; then
    log_error "Uso: ./deploy.sh [main|portfolios|tlm|all]"
    exit 1
fi

case $1 in
    main|portfolios|tlm)
        deploy_app $1
        ;;
    all)
        deploy_app "all"
        ;;
    *)
        log_error "Opción no válida: $1"
        exit 1
        ;;
esac

log_info "🎉 ¡Listo! Accede a:"
log_info "  Main:       http://localhost:3000"
log_info "  Portfolios: http://localhost:4000"
log_info "  TLM:        http://localhost:5000"
