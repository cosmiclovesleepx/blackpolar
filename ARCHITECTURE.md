# 📋 Guía de Arquitectura - Black Polar

Explicación detallada de cómo funciona cada parte del proyecto.

## 🏗️ Decisiones Arquitectónicas

### ¿Por qué múltiples apps?

1. **Independencia**: Cada app puede escalarse por separado
2. **Aislamiento**: Fallos en una app no afectan a otras
3. **Equipos**: Diferentes teams pueden trabajar en apps distintas
4. **Deployment**: Actualizar una app sin afectar las otras
5. **Rendimiento**: Cada app puede tener su propia configuración de recursos

### ¿Por qué un folder "shared"?

La carpeta `shared/` existe para:

1. **DRY (Don't Repeat Yourself)**: Código reutilizable
2. **Mantenibilidad**: Cambios en middlewares se aplican a todas las apps
3. **Consistencia**: Todas las apps usan la misma lógica de errores, logging, BD
4. **Escalabilidad**: Fácil agregar nuevas apps sin duplicar código

## 📊 Flujo de Datos

### Request → Response Flow

```
CLIENT REQUEST (http://localhost:3000/)
        ↓
   [Nginx] (en producción)
        ↓
[Express App - /src/apps/main/app.js]
        ↓
   Security Middlewares
   ├── Helmet (Headers de seguridad)
   ├── CORS (Validar origen)
   ├── Body Parser (JSON/URL encoded)
   └── Logging (Morgan)
        ↓
   [Routes - /src/apps/main/routes/index.js]
   ├── GET /
   ├── GET /api/v1
   ├── GET /about
   └── ...
        ↓
   [Shared Code]
   ├── DB Queries (MongoDB)
   ├── Services
   └── Utils
        ↓
   JSON/HTML RESPONSE
```

## 🔄 Ciclo de Inicio del Servidor

```javascript
// /src/apps/main/server.js

1. Importar app.js
2. Importar configuración (env, db)
3. Validar variables de entorno
   └─ validateEnv() lanza error si faltan vars requeridas
4. Conectar a MongoDB
   └─ connectDB() intenta conexión
5. Iniciar servidor HTTP
   └─ app.listen(PORT)
6. Escuchar señales de cierre (SIGTERM, SIGINT)
   └─ Graceful shutdown
```

### Código Actual

```javascript
const startServer = async () => {
  try {
    validateEnv();           // ✓ Todas las vars están?
    await connectDB();       // ✓ Base de datos lista?
    
    const server = app.listen(PORT, () => {
      logger.success(`App running on port ${PORT}`);
    });
    
    // Si recibimos SIGTERM (kill graceful)
    process.on('SIGTERM', () => {
      server.close(() => process.exit(0));
    });
    
  } catch (error) {
    logger.error('Error:', error.message);
    process.exit(1);  // Salir con código de error
  }
};

startServer();
```

## 🔐 Seguridad por Capas

### Capa 1: Helmet (HTTP Headers)

```javascript
app.use(helmet());
// Agrega headers de seguridad:
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: 1; mode=block
// etc.
```

### Capa 2: CORS

```javascript
app.use(cors({
  origin: allowedOrigins,  // Desde .env
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
// Solo dominios autorizados pueden acceder
```

### Capa 3: Validación de Entrada

```javascript
// En tus controladores
import Joi from 'joi';

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const { error, value } = schema.validate(req.body);
if (error) throw new AppError(error.message, 400);
```

### Capa 4: JWT (si implementas autenticación)

```javascript
import jwt from 'jsonwebtoken';
import { env } from '../../shared/config/env.js';

// Crear token
const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
  expiresIn: env.JWT_EXPIRE,
});

// Validar token en middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new AppError('Token required', 401);
  
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
};
```

## 📦 Cómo Agregar una Nueva App

### Paso 1: Crear estructura

```bash
mkdir -p src/apps/nueva/routes src/apps/nueva/public src/apps/nueva/views
```

### Paso 2: Crear `app.js`

Copiar desde `src/apps/main/app.js` y ajustar:

```javascript
// Cambios principales:
app.use(express.static('src/apps/nueva/public'));
app.set('views', 'src/apps/nueva/views');
import nuevaRoutes from './routes/index.js';
app.use('/', nuevaRoutes);
```

### Paso 3: Crear `server.js`

Copiar desde `src/apps/main/server.js` y ajustar:

```javascript
const PORT = env.NUEVA_PORT;  // Agregar a .env primero

const server = app.listen(PORT, () => {
  logger.success(`NUEVA app running on http://localhost:${PORT}`);
});
```

### Paso 4: Crear `routes/index.js`

```javascript
import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Nueva App',
    app: 'nueva',
  });
});

export default router;
```

### Paso 5: Agregar variable `.env`

```env
NUEVA_PORT=6000
```

### Paso 6: Agregar script `package.json`

```json
"dev:nueva": "nodemon src/apps/nueva/server.js",
"start:nueva": "node src/apps/nueva/server.js"
```

## 🧩 Patrón Controlador-Ruta-Modelo

### Modelo (Database Layer)

```javascript
// src/shared/models/Article.js
import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Article', articleSchema);
```

### Controlador (Business Logic)

```javascript
// src/shared/controllers/articleController.js
import Article from '../models/Article.js';
import { AppError, catchAsync } from '../middlewares/errorHandler.js';

export const getArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find();
  res.json({ success: true, data: articles });
});

export const getArticleById = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    throw new AppError('Article not found', 404);
  }
  res.json({ success: true, data: article });
});

export const createArticle = catchAsync(async (req, res, next) => {
  const article = await Article.create(req.body);
  res.status(201).json({ success: true, data: article });
});

export const updateArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!article) {
    throw new AppError('Article not found', 404);
  }
  res.json({ success: true, data: article });
});

export const deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) {
    throw new AppError('Article not found', 404);
  }
  res.json({ success: true, data: article });
});
```

### Ruta (API Endpoints)

```javascript
// src/apps/main/routes/articles.js
import { Router } from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../../shared/controllers/articleController.js';

const router = Router();

router.get('/articles', getArticles);
router.get('/articles/:id', getArticleById);
router.post('/articles', createArticle);
router.put('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

export default router;
```

### Usar en app.js

```javascript
// En src/apps/main/app.js
import articlesRouter from './routes/articles.js';

app.use('/api/v1', articlesRouter);
// Ahora disponible en:
// GET /api/v1/articles
// GET /api/v1/articles/:id
// POST /api/v1/articles
// PUT /api/v1/articles/:id
// DELETE /api/v1/articles/:id
```

## 🔄 Reutilizar Controladores en Múltiples Apps

```javascript
// El mismo controlador se puede usar en varias apps

// src/apps/main/app.js
import articlesRouter from './routes/articles.js';
app.use('/api/v1', articlesRouter);

// src/apps/portfolios/app.js
import articlesRouter from './routes/articles.js';
app.use('/api/v1', articlesRouter);  // Mismo controlador, diferentes rutas

// src/apps/tlm/app.js
import { getArticles } from '../../shared/controllers/articleController.js';
// Usar directamente en una ruta específica
```

## 📝 Ejemplo: Agregar Autenticación

### 1. Crear modelo User

```javascript
// src/shared/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String,, unique: true },
  password: String,
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model('User', userSchema);
```

### 2. Crear controlador de auth

```javascript
// src/shared/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError, catchAsync } from '../middlewares/errorHandler.js';
import { env } from '../config/env.js';

export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  
  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
  
  res.status(201).json({ success: true, token, user });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }
  
  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
  
  res.json({ success: true, token });
});
```

### 3. Crear middleware de protección

```javascript
// src/shared/middlewares/auth.js
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw new AppError('Please login first', 401);
  }
  
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
};
```

### 4. Usar en rutas

```javascript
// src/apps/main/routes/auth.js
import { Router } from 'express';
import { register, login } from '../../shared/controllers/authController.js';
import { protect } from '../../shared/middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;
```

## 🧪 Testing (Próximas Mejoras)

```bash
# Instalar herramientas de testing
npm install --save-dev jest supertest

# Crear test
// tests/api.test.js
import request from 'supertest';
import app from '../src/apps/main/app.js';

describe('Main App API', () => {
  it('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

# Ejecutar tests
npm test
```

---

Esta arquitectura es escalable, mantenible y lista para producción. ¡Felicidades! 🚀
