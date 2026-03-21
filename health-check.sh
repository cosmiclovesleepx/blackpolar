#!/bin/bash

# Health Check Script
# Monitorea el health de todos los servidores
# Uso: ./health-check.sh

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# URLs a verificar
URLS=(
    "http://localhost:3000/health"
    "http://localhost:4000/health"
    "http://localhost:5000/health"
)

# Apps
APPS=("MAIN" "PORTFOLIOS" "TLM")

echo "=========================================="
echo "Health Check - Black Polar Apps"
echo "=========================================="
echo ""

all_healthy=true

for i in "${!URLS[@]}"; do
    url="${URLS[$i]}"
    app="${APPS[$i]}"

    if curl -sf "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $app${NC} - $(curl -s $url | grep -o '"timestamp":"[^"]*"')"
    else
        echo -e "${RED}❌ $app${NC} - No response"
        all_healthy=false
    fi
done

echo ""
echo "=========================================="

if [ "$all_healthy" = true ]; then
    echo -e "${GREEN}✅ Todos los servidores están activos${NC}"
    exit 0
else
    echo -e "${RED}❌ Algunos servidores están inactivos${NC}"
    exit 1
fi
