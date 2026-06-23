# Manual — Subir el monorepo a GitHub y activar deploys automáticos

## Parte 1 — Primera vez: subir el código a GitHub

### 1. Abre VS Code en la carpeta raíz del monorepo
Asegúrate de estar en `blackpolar-monorepo/` (donde están `package.json`, `turbo.json`, etc.)

### 2. Abre la terminal integrada de VS Code (`Ctrl + J`)

### 3. Inicializa el repositorio Git local
```powershell
git init
git branch -M main
```

### 4. Conecta con tu repo de GitHub
Ve a github.com → tu repo `cosmiclovesleepx/blackpolar` → Settings → confirma que está vacío
o crea uno nuevo si prefieres empezar limpio.

```powershell
git remote add origin https://github.com/cosmiclovesleepx/blackpolar.git
```

Si el repo ya tenía código y quieres reemplazarlo con el monorepo:
```powershell
git remote add origin https://github.com/cosmiclovesleepx/blackpolar.git
# O si ya tenías el remote configurado:
git remote set-url origin https://github.com/cosmiclovesleepx/blackpolar.git
```

### 5. Primer commit
```powershell
git add .
git commit -m "chore: migrate to Next.js 15 monorepo (Turborepo)"
```

### 6. Push
```powershell
git push -u origin main
```

Si el repo tenía commits anteriores y hay conflictos:
```powershell
git push -u origin main --force
```
⚠️ `--force` reescribe el historial remoto. Úsalo solo si estás seguro de que
no hay trabajo de otros colaboradores en el repo.

---

## Parte 2 — Configurar los secrets de GitHub Actions

Estos 3 secrets son los que leen los workflows para conectarse a tu VPS.

1. Ve a tu repo en GitHub
2. **Settings → Secrets and variables → Actions → New repository secret**

Agrega estos 3:

| Nombre | Valor |
|---|---|
| `VPS_HOST` | IP de tu VPS (ej. `34.74.240.84`) |
| `VPS_USER` | `root` (o el usuario con el que te conectas por SSH) |
| `VPS_SSH_KEY` | La clave privada SSH completa (el contenido del archivo `.pem` o `google_cloud_key` — incluyendo las líneas `-----BEGIN...` y `-----END...`) |

---

## Parte 3 — Primer deploy manual en la VPS

Los workflows solo se disparan cuando haces push. La primera vez necesitas
hacer el build inicial a mano en la VPS para que PM2 tenga algo que recargar.

Conéctate por SSH:
```bash
ssh -i "C:\Users\blanq\OneDrive\Escritorio\google_cloud_key" root@34.74.240.84
```

En la VPS, si es la primera vez con el repo nuevo:
```bash
# Si el directorio ya existe con el código viejo:
cd /var/www/blackpolar
git pull origin main      # si ya está clonado
# O si es un directorio limpio:
# git clone https://github.com/cosmiclovesleepx/blackpolar.git /var/www/blackpolar
# cd /var/www/blackpolar

# Instalar pnpm si no está
corepack enable
corepack prepare pnpm@9.15.0 --activate

# Instalar dependencias
pnpm install --frozen-lockfile

# Generar cliente de Prisma
pnpm db:generate

# Build de las 3 apps
pnpm build

# Levantar con PM2 (si aún no está corriendo)
pm2 start ecosystem.config.cjs
pm2 save

# O si PM2 ya estaba corriendo con la versión anterior:
pm2 reload all
```

---

## Parte 4 — Flujo de trabajo diario (después de la primera vez)

Una vez configurado todo, el ciclo es simplemente:

```powershell
# 1. Haces cambios en VS Code

# 2. Commit
git add .
git commit -m "feat: descripción del cambio"

# 3. Push — esto dispara el workflow automáticamente
git push
```

GitHub Actions detecta qué carpeta cambió y solo deploya esa app:
- Cambios en `apps/web/**` → solo `deploy-web.yml` corre → solo `pm2 reload blackpolar-web`
- Cambios en `apps/api/**` → solo `deploy-api.yml` corre → solo `pm2 reload blackpolar-api`
- Cambios en `packages/**` → los 3 workflows corren (porque todas las apps los usan)

Puedes ver el progreso en vivo en:
**github.com → tu repo → Actions**

---

## Comandos útiles de referencia rápida

```powershell
# Desarrollo local — levantar todo
pnpm dev

# Levantar solo una app
pnpm dev:web         # localhost:3000
pnpm dev:dashboard   # localhost:3001
pnpm dev:api         # localhost:4000

# Build individual
pnpm build:web
pnpm build:dashboard
pnpm build:api

# Base de datos
pnpm db:generate     # regenerar cliente Prisma después de editar el schema
pnpm db:push         # aplicar el schema a la base de datos (dev)
pnpm db:studio       # abrir Prisma Studio en el navegador (GUI de la DB)
pnpm db:migrate      # crear una migración (producción)

# PM2 (producción en VPS)
pnpm start           # levantar todas las apps con PM2
pnpm stop            # detener todas
pnpm restart         # reiniciar todas
pnpm logs            # ver logs en tiempo real

# Limpieza
pnpm clean           # eliminar .next, dist y cachés (útil si algo falla raro)
```
