/**
 * src/apps/main/app.js
 * Black Polar — Main Application (blackpolar.io)
 */

import express from "express";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import serveIndex from "serve-index";
import path from "path";
import { fileURLToPath } from "url";

import { setupLogging } from "../../shared/middlewares/logging.js";
import { setupCORS } from "../../shared/middlewares/cors.js";
import { requestId } from "../../shared/middlewares/requestId.js";
import { sanitizeInput } from "../../shared/middlewares/sanitize.js";
import { notFound } from "../../shared/middlewares/notFound.js";
import { errorHandler } from "../../shared/middlewares/errorHandler.js";
import { viewGuard } from "../../shared/middlewares/viewGuard.js";
import { env } from "../../shared/config/env.js";

// Rutas — descomenta al crear:
// import authRoutes  from './routes/auth.js';
// import usersRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── 1. Proxy ─────────────────────────────────────────────────────
app.set("trust proxy", 1);

// ── 2. Seguridad ─────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: ["'self'"],

        styleSrc: ["'self'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net/"],

        fontSrc: ["'self'", "https://fonts.gstatic.com"],

        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://i.pinimg.com"],

        connectSrc: ["'self'"],
      },
    },
  }),
);

// ── 3. Request ID (trazabilidad) ─────────────────────────────────
app.use(requestId);

// ── 4. CORS ──────────────────────────────────────────────────────
setupCORS(app, { origin: env.cors.origins, credentials: true });

// ── 5. Rate Limiting ─────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { message: "Demasiadas peticiones.", statusCode: 429 } },
  }),
);

// ── 6. Compresión ────────────────────────────────────────────────
app.use(compression());

// ── 7. Logging HTTP ──────────────────────────────────────────────
setupLogging(app);

// ── 8. Parsers ───────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ── 9. Sanitización de input ─────────────────────────────────────
app.use(sanitizeInput);

// ── 10. Estilos Tailwind compilados ──────────────────────────────
//   Ruta: /styles/output.css
app.use(
  "/styles",
  express.static(path.join(__dirname, "../../shared/styles"), {
    maxAge: env.isProd ? "1d" : 0,
    dotfiles: "deny",
    index: false,
  }),
);

// ── 11. Motor de vistas EJS ──────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── 12. Archivos estáticos ───────────────────────────────────────
//   /public/css/index.css
//   /public/js/main.js
//   /public/assets/image/favicon.ico
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    maxAge: env.isProd ? "1d" : 0,
    dotfiles: "deny",
    index: false,
  }),
);
if (env.isDev) {
  app.use("/public", serveIndex(path.join(__dirname, "public"), { icons: true, view: "details" }));
}

// ── 13. Health check ─────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "success",
    app: env.appName,
    env: env.env,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── 14. Ruta raíz ────────────────────────────────────────────────
app.get("/", (req, res) => res.render("index", { appName: env.appName }));

// ── 15. Rutas API (antes de viewGuard) ───────────────────────────
// app.use('/api/auth',  authRoutes);
// app.use('/api/users', usersRoutes);

// ── 16. Rutas dinámicas EJS ──────────────────────────────────────
app.get("/:view", viewGuard);

// ── 17. Errors (siempre al final) ────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
