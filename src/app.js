/**
 * app.js
 * Configura y exporta la aplicación Express.
 * El servidor (listen) vive en server.js para facilitar testing.
 */

import express        from 'express';
import cors           from 'cors';
import morgan         from 'morgan';
import helmet         from 'helmet';
import compression    from 'compression';
import rateLimit      from 'express-rate-limit';
import path           from 'path';
import serveIndex from 'serve-index';
import { fileURLToPath } from 'url';

import { config }       from './config/env.js';
import { notFound }     from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { viewGuard }    from './middlewares/viewGuard.js';

// ── Rutas de módulo (ESM) ────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Importa tus rutas aquí ───────────────────────────────────────
// import authRoutes     from './routes/auth.js';
// import usersRoutes    from './routes/users.js';
// import productsRoutes from './routes/products.js';

const app = express();


//  SEGURIDAD


// Helmet: cabeceras HTTP de seguridad
// En dev relajamos la CSP para que CDN / live-reload funcionen sin problemas
app.use(helmet({
  contentSecurityPolicy: config.isDev ? false : undefined,
}));

// CORS
app.use(cors({
  origin:      config.cors.origins,
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// Rate Limiting global — protege contra brute-force y DDoS básico
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max:      config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    status:  'error',
    message: 'Demasiadas peticiones, intenta más tarde.',
    code:    429,
  },
});
app.use(limiter);

//  RENDIMIENTO


// Compresión gzip/brotli para respuestas
app.use(compression());


//  PARSERS

app.use(express.json({ limit: '10kb' }));           // Protege contra payloads enormes
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//  LOGGING 


// 'combined' en prod (formato Apache), 'dev' en desarrollo
app.use(morgan(config.isProd ? 'combined' : 'dev'));


//  MOTOR DE VISTAS (EJS)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ════════════════════════════════════════════════════════════════
//  ARCHIVOS ESTÁTICOS
//  localhost:5000/public/css/index.css  
//  localhost:5000/public/js/index.js    
// ════════════════════════════════════════════════════════════════


app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: config.isProd ? '1d' : 0,
  dotfiles: 'deny',
}));

// Mostrar listado de directorios
app.use('/public', serveIndex(path.join(__dirname, 'public'), {
  icons: true,   // muestra íconos junto a cada archivo
  view: 'details' // 'details' o 'tiles'
}));


//  RUTAS DE VISTAS (páginas HTML)


// Ruta raíz  renderiza views/index.ejs
app.get('/', (req, res) => {
  res.render('index', { appName: config.appName });
});

// Ruta dinámica genérica (con protección de path traversal)
app.get('/:view', viewGuard);

//  RUTAS DE API

// Health-check (útil para Docker / load balancers)
app.get('/api/health', (req, res) => {
  res.json({
    status:    'success',
    message:   `${config.appName} API funcionando correctamente`,
    env:       config.env,
    timestamp: new Date().toISOString(),
  });
});

// Monta tus rutas aquí:
// app.use('/api/auth',     authRoutes);
// app.use('/api/users',    usersRoutes);
// app.use('/api/products', productsRoutes);

//  ERROR HANDLING(siempre al final)

app.use(notFound);
app.use(errorHandler);

export default app;
