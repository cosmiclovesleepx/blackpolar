# Guía de Setup: Autenticación con Login/Register, Google OAuth y Admin Login

## 📋 Cambios Realizados

### 1. **Base de Datos (Prisma)**
- ✅ Agregado campo `adminUniqueId` en modelo `User` para login de admin

### 2. **Backend (API)**
- ✅ Configurado Google OAuth en Better Auth
- ✅ Creadas rutas de autenticación de admin:
  - `POST /api/admin/login` - Login con Admin Unique ID
  - `POST /api/admin/init` - Inicializar usuario admin (solo si no existe)
  - `GET /api/admin/exists` - Verificar si existe admin

### 3. **Frontend**
- ✅ Actualizada página de login con 3 tabs:
  - Email & Password (Better Auth)
  - Google OAuth
  - Admin Login (Unique ID)
- ✅ Actualizada página de register con Google OAuth
- ✅ Estilos CSS mejorados
- ✅ Scripts JS con validación

---

## 🚀 Pasos Para Implementar

### Paso 1: Actualizar Prisma y Base de Datos

```bash
# 1. Ir al directorio de database
cd packages/database

# 2. Crear migración
npx prisma migrate dev --name add_admin_unique_id

# 3. Generar cliente Prisma
npx prisma generate
```

### Paso 2: Variables de Entorno

Crear/actualizar archivos `.env` en cada app:

#### **apps/api/.env**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/blackpolar"
BETTER_AUTH_SECRET="generate-random-secret-key-here"
BETTER_AUTH_URL="http://localhost:4000"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GOOGLE_REDIRECT_URL="http://localhost:4000/api/auth/callback/google"
PORT=4000
NODE_ENV="development"
```

#### **apps/web/.env.local**
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### Paso 3: Instalar Dependencias

Para Better Auth con Google OAuth, asegúrate de tener instaladas:

```bash
cd packages/auth
npm install better-auth
```

### Paso 4: Crear Usuario Admin Inicial

**Opción A: Via API (Recomendado)**

```bash
curl -X POST http://localhost:4000/api/admin/init \
  -H "Content-Type: application/json" \
  -d '{
    "adminUniqueId": "ADMIN_SECRET_KEY_123",
    "email": "admin@blackpolar.org",
    "name": "Admin User"
  }'
```

**Opción B: Via Prisma Studio**

```bash
cd packages/database
npx prisma studio

# Luego:
# 1. Ve a la tabla "users"
# 2. Crea un nuevo usuario con:
#    - role: "ADMIN"
#    - adminUniqueId: "ADMIN_SECRET_KEY_123"
#    - email: tu-email
#    - name: tu nombre
```

### Paso 5: Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Ve a "Credenciales" y crea "OAuth 2.0 Client ID"
4. Tipo: "Web Application"
5. URIs autorizados:
   - `http://localhost:4000`
   - `http://localhost:4000/api/auth/callback/google`
   - `http://localhost:3000`
   - `http://localhost:3001`
6. Copia Client ID y Secret a tu `.env`

### Paso 6: Iniciar las Aplicaciones

**Terminal 1 - API**
```bash
cd apps/api
npm run dev
```

**Terminal 2 - Web**
```bash
cd apps/web
npm run dev
```

---

## 🔐 Flujos de Autenticación

### Email & Password
1. Usuario ingresa email y contraseña
2. Form hace POST a `/api/auth/sign-in/email`
3. Better Auth maneja la autenticación
4. Usuario es redirigido a dashboard

### Google OAuth
1. Usuario hace click en "Sign in with Google"
2. Redirigido a Google para autenticación
3. Google redirige de vuelta con token
4. Better Auth crea/vincula cuenta
5. Usuario autenticado

### Admin Login
1. Admin ingresa su Unique ID
2. Form hace POST a `/api/admin/login`
3. API busca usuario con ese adminUniqueId
4. Si existe y es ADMIN, crea sesión
5. Token se guarda en localStorage
6. Redirigido a `/dashboard`

---

## 📝 Notas Importantes

### Security
- El endpoint `/api/admin/init` debería estar protegido en producción
- Considera agregar un token especial o restringir por IP
- Los tokens de sesión se guardan en localStorage (considera usar httpOnly cookies)

### Validaciones
- Register valida: nombres, ID, email, contraseña, edad mínima
- Login valida: email y contraseña
- Admin login valida: adminUniqueId no vacío

### Estilos
- Consistente con paleta polar: grises oscuros y acentos claros
- Responsive para mobile
- Tabs animados para cambiar métodos de login

---

## 🐛 Solución de Problemas

### "Google OAuth no funciona"
- Verifica que Google Client ID/Secret estén en `.env`
- Verifica que las URIs autorizados coincidan exactamente
- Limpia cache del navegador

### "Admin login dice 'Invalid admin ID'"
- Verifica que el usuario existe y tiene `role: ADMIN`
- Verifica que `adminUniqueId` no sea null
- Usa Prisma Studio para verificar datos

### "Register no funciona"
- Verifica que Better Auth esté configurado correctamente
- Revisa la consola del navegador y servidor para errores
- Asegúrate de que `requireEmailVerification` sea el comportamiento que quieres

---

## 📦 Rutas API Disponibles

```
POST   /api/auth/sign-up/email        - Register con email/password
POST   /api/auth/sign-in/email        - Login con email/password
GET    /api/auth/callback/google      - Google OAuth callback
POST   /api/admin/login               - Admin login con ID único
POST   /api/admin/init                - Inicializar admin (primera vez)
GET    /api/admin/exists              - Verificar si existe admin
```

---

## ✅ Checklist de Deployment

- [ ] Prisma migration ejecutada
- [ ] Variables de entorno configuradas
- [ ] Usuario admin creado
- [ ] Google OAuth configurado
- [ ] CORS configurado correctamente
- [ ] Database URL apunta a PostgreSQL
- [ ] Tests realizados en cada flujo
- [ ] Error handling revisado
