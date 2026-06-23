# Black Polar — Monorepo

Migración de Express + EJS hacia Next.js 15 + TypeScript, con API separada en Fastify.

## Estructura

```
apps/
  web/         → blackpolar.org — Next.js. Rutas: / (home), /login, /registro,
                 /portfolios, /tlm — todas migradas desde las 3 sub-apps EJS originales.
  dashboard/   → app.blackpolar.org (panel admin, Next.js, protegido)
  api/         → api.blackpolar.org (Fastify + Better Auth)
packages/
  database/    → Prisma schema + cliente (PostgreSQL)
  auth/        → Better Auth, compartido por web/dashboard/api
  validators/  → schemas Zod compartidos
  api-client/  → fetch wrapper tipado, reutilizable en mobile/desktop a futuro
  ui/          → utilidad cn() de shadcn + Tremor
deploy/
  nginx.conf       → config de producción (puerto 443 directo, Vless quedó en 7443)
  server-setup.sh  → bootstrap de una VPS nueva (Node, pnpm, PM2, Postgres, Nginx)
```

Ver `MIGRATION_NOTES.md` para el detalle de qué se migró desde el repo EJS original
y qué queda pendiente de conectar (formularios, auth real, endpoints de TLM).

## Setup local

```bash
# 1. Instalar pnpm si no lo tienes
npm install -g pnpm

# 2. Instalar dependencias
pnpm install

# 3. Copiar variables de entorno
cp .env.example .env
# editar .env con tu DATABASE_URL real

# 4. Generar cliente de Prisma y aplicar schema
pnpm db:generate
pnpm db:push

# 5. Levantar todo en dev (web:3000, dashboard:3001, api:4000)
pnpm dev
```

## Agregar componentes de shadcn

Desde `apps/web` o `apps/dashboard`:

```bash
npx shadcn@latest init
npx shadcn@latest add button card input table dialog
```

## Setup en la VPS (producción)

Ya existe `deploy/server-setup.sh` que automatiza casi todo este proceso —
instala Node, pnpm, PM2, PostgreSQL, Nginx, clona el repo, y genera una clave
SSH dedicada para GitHub Actions. Solo corre:

```bash
cd /var/www
curl -O https://raw.githubusercontent.com/cosmiclovesleepx/blackpolar/main/deploy/server-setup.sh
bash server-setup.sh
```

El script imprime al final exactamente qué secrets de GitHub configurar y qué
archivos de `.env` editar. Si prefieres hacerlo manual, aquí el detalle:

### 1. PostgreSQL

```bash
apt install -y postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE USER blackpolar WITH PASSWORD 'CAMBIA_ESTO';"
sudo -u postgres psql -c "CREATE DATABASE blackpolar OWNER blackpolar;"
```

### 2. Clonar el repo y configurar

```bash
mkdir -p /var/www/blackpolar
cd /var/www/blackpolar
git clone https://github.com/cosmiclovesleepx/blackpolar.git .
cp .env.example .env  # editar con valores reales de producción
corepack enable && corepack prepare pnpm@9.15.0 --activate
npm install -g pm2
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:push
pnpm build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 3. Nginx — el puerto 443 ahora está libre

Como Vless/Xray se movió al puerto 7443, Nginx puede escuchar directo en el
443 sin necesitar el truco de proxy de Cloudflare. La config completa ya está
en `deploy/nginx.conf` — solo cópiala:

```bash
cp deploy/nginx.conf /etc/nginx/sites-available/blackpolar
ln -s /etc/nginx/sites-available/blackpolar /etc/nginx/sites-enabled/
mkdir -p /etc/nginx/ssl
```

Necesitas un certificado para que Nginx termine TLS en el 443. Como el DNS ya
está en Cloudflare, lo más simple es un **Origin Certificate** (gratis, válido
15 años, no hay que renovarlo cada 90 días como Let's Encrypt):

1. Cloudflare Dashboard → tu dominio → SSL/TLS → Origin Server → Create Certificate
2. Pega el certificado en `/etc/nginx/ssl/cloudflare-origin.pem`
3. Pega la llave privada en `/etc/nginx/ssl/cloudflare-origin.key`
4. En Cloudflare: SSL/TLS → Overview → modo **Full (strict)**

```bash
nginx -t && systemctl reload nginx
```

### 4. GitHub Actions — secrets necesarios

En el repo → Settings → Secrets and variables → Actions:

| Secret | Valor |
|---|---|
| `VPS_HOST` | IP de la VPS |
| `VPS_USER` | usuario SSH (`root` si seguiste el script) |
| `VPS_SSH_KEY` | clave privada SSH **dedicada** para deploys (no la tuya personal — `server-setup.sh` genera una en `/root/.ssh/github-actions-deploy`) |

Cada workflow (`deploy-web`, `deploy-dashboard`, `deploy-api`) solo se dispara
cuando cambian archivos de esa app o de `packages/` — así no rebuildeas todo
en cada push. Como `/portfolios` y `/tlm` ahora viven dentro de `apps/web`,
cualquier cambio ahí dispara solo `deploy-web`, no los tres.

### 5. Primer deploy automático

Una vez configurados los secrets, cualquier push a `main` que toque `apps/web`,
`apps/dashboard`, `apps/api`, o `packages/` dispara su workflow correspondiente
automáticamente. Para probarlo, haz un cambio trivial (ej. un comentario) en
`apps/web` y haz push — revisa la pestaña **Actions** del repo para ver el log
en vivo del deploy.

## Próximos pasos sugeridos

1. ~~Migrar las vistas EJS a `apps/web/app/**/page.tsx`~~ — ya hecho, ver `MIGRATION_NOTES.md`
2. Conectar Better Auth de verdad en `apps/web/app/login` y `/registro`
   (los formularios hoy validan en el cliente pero no llaman al backend)
3. Wirear el formulario de contacto de la home a un endpoint real (`/api/contact`)
4. Agregar componentes de shadcn según se necesiten (`button`, `table`, `dialog`)
5. Construir el dashboard de métricas con `@tremor/react` en
   `apps/dashboard/app/(protected)/dashboard/page.tsx`
6. Implementar la gestión de API keys ("keypass") usando el modelo `ApiKey`
   ya definido en el schema de Prisma
7. Revisar los endpoints que `tlm/index.js` espera consumir (`/api/...`) y
   decidir si se migran a Fastify o se retiran
